import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import axios from 'axios';
import UserMenu from './UserMenu';
import { ItemListProvider, useItemListContext } from '../../context/GetItems';

vi.mock('axios');

const savedLists = [
  { list_id: 7, list_name: 'Grocery List', products: ['Milk', 'eggs', ' ', 'milk'], note: 'every day groceries', date_created: '2024-01-16T12:00:00Z' },
  { list_id: 8, list_name: 'Party List', products: ['pizza'], note: '', date_created: '2024-01-16T12:00:00Z' },
];

// The user's lists come from a fixed mock, so a deleted card stays on screen;
// the tests check that the lists are fetched again instead.
const auth = vi.hoisted(() => ({ getUserList: null, lists: [] }));
vi.mock('../../context/GetUser', () => ({
  AuthData: () => ({
    user: { user_id: 1, username: 'testuser', email: 'testuser@example.com' },
    getUserList: auth.getUserList,
    userList: { lists: auth.lists },
  }),
}));

function SearchStub() {
  const { itemList } = useItemListContext();
  return <p>Searching {itemList.join(', ')}</p>;
}

function renderProfile() {
  render(
    <MemoryRouter initialEntries={['/profile']}>
      <ItemListProvider>
        <Routes>
          <Route path="/profile" element={<UserMenu />} />
          <Route path="/search" element={<SearchStub />} />
        </Routes>
      </ItemListProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  auth.lists = savedLists;
  auth.getUserList = vi.fn().mockResolvedValue();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

test('shows each saved list with its items, date and note', () => {
  renderProfile();

  expect(screen.getByRole('heading', { name: 'Hi, testuser' })).toBeInTheDocument();
  expect(screen.getByText('2 saved lists')).toBeInTheDocument();
  expect(screen.getByText('4 items')).toBeInTheDocument();

  const grocery = screen.getByRole('article', { name: 'Grocery List' });
  expect(within(grocery).getAllByRole('listitem')).toHaveLength(3);
  expect(within(grocery).getByText('3 items · Created January 16, 2024')).toBeInTheDocument();
  expect(within(grocery).getByText('every day groceries')).toBeInTheDocument();

  const party = screen.getByRole('article', { name: 'Party List' });
  expect(within(party).getByText('1 item · Created January 16, 2024')).toBeInTheDocument();
  expect(within(party).queryByText('Note:')).not.toBeInTheDocument();

  const newLinks = screen.getAllByRole('link').filter((link) => link.getAttribute('href') === '/list/new');
  expect(newLinks).toHaveLength(2);
});

test('compares prices for a saved list', () => {
  renderProfile();
  fireEvent.click(screen.getByRole('button', { name: 'Compare prices for Grocery List' }));

  expect(screen.getByText('Searching milk, eggs')).toBeInTheDocument();
});

test('deletes a list after the user confirms', async () => {
  axios.delete.mockResolvedValue({ data: {} });
  const confirm = vi.spyOn(window, 'confirm');
  renderProfile();

  confirm.mockReturnValueOnce(false);
  fireEvent.click(screen.getByRole('button', { name: 'Delete Party List' }));
  expect(axios.delete).not.toHaveBeenCalled();

  confirm.mockReturnValueOnce(true);
  fireEvent.click(screen.getByRole('button', { name: 'Delete Party List' }));
  expect(confirm).toHaveBeenLastCalledWith('Delete the list "Party List"? This can\'t be undone.');
  expect(axios.delete.mock.calls[0][0]).toMatch(/\/lists\/user\/1\/8$/);
  expect(await screen.findByText('Party List deleted.')).toBeInTheDocument();
  expect(auth.getUserList).toHaveBeenCalledWith(1);
  expect(screen.getByRole('heading', { name: 'Hi, testuser' })).toHaveFocus();
});

test('says when a list could not be deleted', async () => {
  axios.delete.mockRejectedValue(new Error('offline'));
  vi.spyOn(window, 'confirm').mockReturnValue(true);
  renderProfile();
  fireEvent.click(screen.getByRole('button', { name: 'Delete Party List' }));

  const party = screen.getByRole('article', { name: 'Party List' });
  expect(await within(party).findByRole('alert')).toHaveTextContent("We couldn't delete this list.");
});

test('shows only the new list tile when there are no lists', () => {
  auth.lists = [];
  renderProfile();

  expect(screen.getByText('0 saved lists')).toBeInTheDocument();
  expect(screen.queryByRole('article')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Start a new list/ })).toHaveAttribute('href', '/list/new');
});

test('shows a list saved without products', () => {
  auth.lists = [{ list_id: 9, list_name: 'Empty', products: null, note: null, date_created: '2024-01-16T12:00:00Z' }];
  renderProfile();

  expect(screen.getByText('0 items')).toBeInTheDocument();
  const empty = screen.getByRole('article', { name: 'Empty' });
  expect(within(empty).getByText('0 items · Created January 16, 2024')).toBeInTheDocument();
});
