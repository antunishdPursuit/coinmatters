import { render, screen } from '@testing-library/react';
import App from './App';

// The app checks the login cookie on every route change. Answer as a
// logged-out visitor so the test never needs the API.
vi.mock('axios', () => {
  const rejectRequest = () => Promise.reject(new Error('no API in tests'));
  const client = { get: rejectRequest, post: rejectRequest };
  return { default: { ...client, create: () => client } };
});

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
