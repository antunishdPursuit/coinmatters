import { useEffect } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import axios from 'axios';
import NewList from './NewList';
import { buildShelf } from './shelf';
import { ItemListProvider, useItemListContext } from '../../context/GetItems';

vi.mock('axios');

const auth = vi.hoisted(() => ({ lists: [] }));
vi.mock('../../context/GetUser', () => ({
  AuthData: () => ({
    user: { user_id: 1, username: 'testuser' },
    userList: { lists: auth.lists },
  }),
}));

const products = [
  { product_name: 'Farmland Fat Free Milk' },
  { product_name: 'Large Brown Eggs' },
  { product_name: 'Poland Spring Water' },
  { product_name: 'Vanilla Ice Cream' },
];

beforeEach(() => {
  auth.lists = [
    { list_id: 7, list_name: 'Grocery List', products: ['Milk', ' ', 'bread'], note: 'every day groceries' },
  ];
  axios.get.mockResolvedValue({ data: products });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

// Search's "Save my list" puts its items in the shared list before opening this page.
function StartWith({ items, children }) {
  const { itemList, setItemList } = useItemListContext();
  useEffect(() => setItemList(items), [items, setItemList]);
  return itemList.length === items.length ? children : null;
}

const page = (path, items) => (
    <MemoryRouter initialEntries={[path]}>
      <ItemListProvider>
        <StartWith items={items}>
          <Routes>
            <Route path="/list/new" element={<NewList />} />
            <Route path="/list/:id/edit" element={<NewList />} />
            <Route path="/profile" element={<p>My lists page</p>} />
          </Routes>
        </StartWith>
      </ItemListProvider>
    </MemoryRouter>
);

function renderPage(path, items = []) {
  return render(page(path, items));
}

const productList = () => screen.queryByRole('list', { name: /Products/ });

test('builds the shelf from what the stores sell', () => {
  expect(buildShelf(products)).toEqual([
    { name: 'Dairy and eggs', items: ['milk', 'eggs'] },
    { name: 'Drinks', items: ['water'] },
    { name: 'Frozen', items: ['ice cream'] },
  ]);
});

test('makes a list from the shelf and typed items', async () => {
  axios.post.mockResolvedValue({ data: {} });
  renderPage('/list/new', ['Milk']);

  expect(screen.getByRole('heading', { name: 'New list' })).toBeInTheDocument();
  expect(within(productList()).getByText('milk')).toBeInTheDocument();

  const milk = await screen.findByRole('button', { name: /^milk/i });
  expect(milk).toHaveAttribute('aria-pressed', 'true');
  expect(screen.queryByRole('heading', { name: 'Pantry' })).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /^ice cream/i }));
  expect(screen.getByRole('button', { name: /^ice cream/i })).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(screen.getByRole('button', { name: /^water/i }));
  fireEvent.click(screen.getByRole('button', { name: /^water/i }));
  expect(screen.getByRole('button', { name: /^water/i })).toHaveAttribute('aria-pressed', 'false');
  expect(screen.getByRole('region', { name: 'Dairy and eggs' })).toBeInTheDocument();

  const own = screen.getByLabelText('Not on the shelf? Type it');
  fireEvent.change(own, { target: { value: ' Paper Towels ' } });
  fireEvent.click(screen.getByRole('button', { name: 'Add' }));
  fireEvent.change(own, { target: { value: 'milk' } });
  fireEvent.keyDown(own, { key: 'Enter' });
  expect(screen.getByRole('alert')).toHaveTextContent('milk is already on your list.');

  fireEvent.click(screen.getByRole('button', { name: 'Remove milk' }));
  expect(own).toHaveFocus();
  expect(screen.getByRole('heading', { name: 'Products · 2' })).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText('Name'), { target: { value: ' Party ' } });
  fireEvent.change(screen.getByLabelText('Note'), { target: { value: 'for saturday' } });
  fireEvent.submit(screen.getByRole('button', { name: 'Save list' }).closest('form'));

  expect(axios.post).toHaveBeenCalledWith(
    expect.stringMatching(/\/lists\/1$/),
    { list_name: 'Party', products: ['ice cream', 'paper towels'], note: 'for saturday' },
    { withCredentials: true },
  );
  expect(await screen.findByText('My lists page')).toBeInTheDocument();
});

test('edits a saved list', async () => {
  axios.put.mockResolvedValue({ data: {} });
  renderPage('/list/7/edit');

  expect(screen.getByRole('heading', { name: 'Edit list' })).toBeInTheDocument();
  expect(screen.getByLabelText('Name')).toHaveValue('Grocery List');
  expect(screen.getByLabelText('Note')).toHaveValue('every day groceries');
  expect(within(productList()).getAllByRole('listitem')).toHaveLength(2);
  expect(screen.getByRole('link', { name: 'Nevermind!' })).toHaveAttribute('href', '/profile');

  fireEvent.click(await screen.findByRole('button', { name: /^water/i }));
  fireEvent.submit(screen.getByRole('button', { name: 'Save list' }).closest('form'));

  expect(axios.put).toHaveBeenCalledWith(
    expect.stringMatching(/\/lists\/user\/1\/7$/),
    { list_name: 'Grocery List', products: ['milk', 'bread', 'water'], note: 'every day groceries' },
    { withCredentials: true },
  );
  expect(await screen.findByText('My lists page')).toBeInTheDocument();
});

test('says when a list cannot be found', () => {
  renderPage('/list/99/edit');
  expect(screen.getByText("We couldn't find that list.")).toBeInTheDocument();
});

test('shows the error when saving fails', async () => {
  axios.post.mockRejectedValue({ response: { data: { error: 'List name must be 1 to 255 characters' } } });
  renderPage('/list/new');

  expect(screen.getByText('Pick from the shelf or type your own.')).toBeInTheDocument();
  fireEvent.submit(screen.getByRole('button', { name: 'Save list' }).closest('form'));

  expect(await screen.findByRole('alert')).toHaveTextContent('List name must be 1 to 255 characters');
  expect(screen.queryByText('My lists page')).not.toBeInTheDocument();
});

test('waits for the saved lists before filling the edit form', () => {
  auth.lists = undefined;
  const { rerender } = renderPage('/list/7/edit');

  expect(screen.queryByText("We couldn't find that list.")).not.toBeInTheDocument();
  expect(screen.getByLabelText('Name')).toBeDisabled();

  auth.lists = [{ list_id: 7, list_name: 'Grocery List', products: ['milk'], note: null }];
  rerender(page('/list/7/edit', []));

  expect(screen.getByLabelText('Name')).toBeEnabled();
  expect(screen.getByLabelText('Name')).toHaveValue('Grocery List');
  expect(screen.getByLabelText('Note')).toHaveValue('');
});

test('says when the shelf cannot load', async () => {
  axios.get.mockRejectedValue(new Error('offline'));
  vi.spyOn(console, 'error').mockImplementation(() => {});
  renderPage('/list/new');

  expect(screen.getByText('Loading the shelf…')).toBeInTheDocument();
  expect(await screen.findByText("We couldn't load the shelf. You can still type your own items.")).toBeInTheDocument();
  expect(screen.queryByText('Loading the shelf…')).not.toBeInTheDocument();
});
