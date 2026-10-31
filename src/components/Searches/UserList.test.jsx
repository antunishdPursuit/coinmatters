import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import axios from 'axios';
import UserList from './UserList';
import { ItemListProvider } from '../../context/GetItems';

vi.mock('axios');

const stores = [
  { retailer_id: 1, retailer_name: 'CTown', zipcodes_array: [10456, 10029], website: 'https://ctown.example' },
  { retailer_id: 3, retailer_name: 'Walmart', zipcodes_array: [10456], website: 'https://walmart.example' },
];

const products = [
  { product_name: 'Farmland Fat Free Milk', size: '1/2 Gallon', price: 3.69, retailer_id: 1 },
  { product_name: 'Horizon Organic Whole Milk', size: '1/2 Gallon', price: 4.79, retailer_id: 1 },
  { product_name: 'Great Value 2% Milk', size: '64 Ounces', price: 3.98, retailer_id: 3 },
  { product_name: 'Bananas', size: '1 Pound', price: 0.5, retailer_id: 3 },
];

beforeEach(() => {
  axios.get.mockImplementation((url) => Promise.resolve({
    data: url.endsWith('/retailer') ? stores : products,
  }));
});

// Types into a field and presses Enter, which submits its form.
function enter(label, text) {
  const input = screen.getByLabelText(label);
  fireEvent.change(input, { target: { value: text } });
  fireEvent.submit(input.closest('form'));
}

function renderSearch() {
  render(
    <MemoryRouter>
      <ItemListProvider>
        <UserList />
      </ItemListProvider>
    </MemoryRouter>
  );
}

test('compares the cheapest match at each nearby store', async () => {
  renderSearch();

  expect(await screen.findByText('We cover 10029 and 10456.')).toBeInTheDocument();

  enter('Add your items', 'Milk');
  enter('Add your items', 'bananas');
  enter('Add your items', 'milk');
  expect(screen.getByRole('alert')).toHaveTextContent('Item already added to the list');

  enter('Zip code', '10456');

  const ctown = screen.getByRole('article', { name: 'CTown' });
  expect(within(ctown).getByText('$3.69', { selector: '.price-tag' })).toBeInTheDocument();
  expect(within(ctown).getByText('Not at CTown')).toBeInTheDocument();
  expect(within(ctown).getByText("Doesn't include bananas")).toBeInTheDocument();

  const walmart = screen.getByRole('article', { name: 'Walmart' });
  expect(within(walmart).getByText('$4.48')).toBeInTheDocument();
  expect(within(walmart).getByText('64 Ounces · Great Value 2% Milk')).toBeInTheDocument();
  expect(within(walmart).queryByText(/Doesn't include/)).not.toBeInTheDocument();

  expect(screen.getByText('Sample prices for demonstration.')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Remove bananas' }));
  expect(screen.queryByRole('button', { name: 'Remove bananas' })).not.toBeInTheDocument();
  expect(screen.getByLabelText('Add your items')).toHaveFocus();
});

test('says when no store covers the zip code', async () => {
  renderSearch();

  await screen.findByText('We cover 10029 and 10456.');
  enter('Add your items', 'milk');
  enter('Zip code', '90210');

  expect(screen.getByText(/do not have store details for that zip code/)).toBeInTheDocument();
  expect(screen.queryByRole('article')).not.toBeInTheDocument();
});

test('marks one best deal and replaces the stores on a new search', async () => {
  renderSearch();
  await screen.findByText('We cover 10029 and 10456.');
  enter('Add your items', 'milk');
  enter('Zip code', '10456');

  expect(screen.getAllByText('Best deal')).toHaveLength(1);
  const ctown = screen.getByRole('article', { name: 'CTown' });
  expect(within(ctown).getByText('Best deal')).toBeInTheDocument();
  expect(within(ctown).getByRole('link', { name: 'View on CTown' })).toHaveAttribute('href', 'https://ctown.example');

  enter('Zip code', '10029');
  expect(screen.getAllByRole('article')).toHaveLength(1);
  expect(screen.queryByRole('article', { name: 'Walmart' })).not.toBeInTheDocument();
});

test('asks for items when the list is empty', async () => {
  renderSearch();
  await screen.findByText('We cover 10029 and 10456.');
  enter('Zip code', '10456');

  expect(screen.getByText('Add items to your list to start searching for the best deals near you!')).toBeInTheDocument();
  expect(screen.queryByRole('article')).not.toBeInTheDocument();
});
