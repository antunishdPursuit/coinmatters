import { StrictMode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

// The app checks the login cookie on every route change. Visitors are logged
// out unless a test logs them in, so the tests never need the API.
const api = vi.hoisted(() => ({ loggedIn: false, calls: 0 }));
vi.mock('axios', () => {
  const user = { user_id: 1, username: 'testuser', email: 'testuser@example.com' };
  const answers = {
    '/check-login': { message: 'Cookie Works', user },
    '/user': { authorizedData: user },
    '/lists/user/1': { user, lists: [] },
  };
  const get = (url) => {
    const path = Object.keys(answers).find((end) => url.endsWith(end));
    // each answer takes a little longer than the one before, like a busy network,
    // so an earlier check can answer while a later one is still waiting
    api.calls += 1;
    return new Promise((resolve, reject) => setTimeout(() => (api.loggedIn && path ? resolve({ data: answers[path] }) : reject(new Error('no API in tests'))), api.calls * 20));
  };
  // the only account the API knows is turned away with a wrong password
  const post = (url) => Promise.reject(url.endsWith('/login') ? { response: { status: 401, data: { error: 'Invalid credentials' } } } : new Error('no API in tests'));
  const client = { get, post };
  return { default: { ...client, create: () => client } };
});

// Tests that change the address or log in put things back afterwards.
afterEach(() => {
  window.history.pushState({}, '', '/');
  api.loggedIn = false;
  api.calls = 0;
});

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

test('sends a logged-out visitor from a members page to log in', async () => {
  window.history.pushState({}, '', '/profile');
  render(<App />);

  expect(await screen.findByRole('heading', { level: 1, name: 'Log in' })).toBeInTheDocument();
  expect(window.location.pathname).toBe('/login');
});

test('keeps a logged-in visitor on a members page after a reload', async () => {
  api.loggedIn = true;
  window.history.pushState({}, '', '/profile');
  // StrictMode runs the login check twice, as in the real app
  render(<StrictMode><App /></StrictMode>);

  expect(await screen.findByRole('heading', { level: 1, name: 'Hi, testuser' })).toBeInTheDocument();
  expect(window.location.pathname).toBe('/profile');
});

test('sends a logged-in visitor from log in to the home page', async () => {
  api.loggedIn = true;
  window.history.pushState({}, '', '/login');
  render(<App />);

  expect(await screen.findByRole('link', { name: 'Log out' })).toBeInTheDocument();
  expect(window.location.pathname).toBe('/');
  expect(screen.queryByRole('heading', { name: 'Log in' })).not.toBeInTheDocument();
});

test('explains a wrong email or password', async () => {
  window.history.pushState({}, '', '/login');
  render(<App />);

  const email = await screen.findByLabelText('Email', { selector: '#login-email' });
  fireEvent.change(email, { target: { value: 'testuser@example.com' } });
  fireEvent.submit(email.closest('form'));

  expect(await screen.findByRole('alert')).toHaveTextContent("That email and password don't match an account.");
});
