import { render, screen } from '@testing-library/react';
import App from './App';

// The app checks the login cookie on every route change. Answer as a
// logged-out visitor so the test never needs the API.
vi.mock('axios', () => {
  const rejectRequest = () => Promise.reject(new Error('no API in tests'));
  const client = { get: rejectRequest, post: rejectRequest };
  return { default: { ...client, create: () => client } };
});

// Tests that change the address put it back afterwards.
afterEach(() => window.history.pushState({}, '', '/'));

test('renders the home page and main navigation for a logged-out visitor', async () => {
  render(<App />);

  expect(screen.getByText('Save Time. Save Money. Shop Smart.')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Start Saving' })).toHaveAttribute('href', '/search');
  expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
  expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
  expect(screen.getByRole('link', { name: 'Search' })).toHaveAttribute('href', '/search');
  expect(screen.queryByRole('link', { name: 'Log Out' })).not.toBeInTheDocument();
  expect(screen.getAllByAltText('a user who uses this app')).toHaveLength(3);
});

test('shows a not found page for an unknown address', async () => {
  window.history.pushState({}, '', '/no-such-page');
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Go to the home page' })).toHaveAttribute('href', '/');
});
