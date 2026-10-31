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

  expect(screen.getByRole('heading', { name: 'Save time. Save money. Shop smart.' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Start saving' })).toHaveAttribute('href', '/search');
  expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
  expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
  expect(screen.getByRole('link', { name: 'Search' })).toHaveAttribute('href', '/search');
  expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/login');
  expect(screen.queryByRole('link', { name: 'Log out' })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
  expect(screen.getByRole('link', { name: 'Create an account' })).toHaveAttribute('href', '/register');
  expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(3);
});

test('shows a not found page for an unknown address', async () => {
  window.history.pushState({}, '', '/no-such-page');
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Go to the home page' })).toHaveAttribute('href', '/');
});
