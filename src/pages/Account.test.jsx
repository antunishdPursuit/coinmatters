import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import axios from 'axios';
import Account from './Account';

vi.mock('axios');

const auth = vi.hoisted(() => ({ logInUser: null }));
vi.mock('../context/GetUser', () => ({
  AuthData: () => ({ logInUser: auth.logInUser }),
}));

beforeEach(() => {
  auth.logInUser = vi.fn().mockResolvedValue();
});

afterEach(() => vi.clearAllMocks());

function renderAccount(start) {
  render(
    <MemoryRouter initialEntries={[`/${start}`]}>
      <Routes>
        <Route path="/login" element={<Account start="login" />} />
        <Route path="/register" element={<Account start="register" />} />
        <Route path="/" element={<p>Home page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

const form = (name) => within(screen.getByRole('region', { name }));

function fill(name, label, value) {
  fireEvent.change(form(name).getByLabelText(label), { target: { value } });
}

test('puts the form the visitor came for first', () => {
  renderAccount('login');
  const headings = screen.getAllByRole('heading');
  expect(headings.map((heading) => [heading.tagName, heading.textContent])).toEqual([['H1', 'Log in'], ['H2', 'Register']]);
  expect(screen.getByRole('link', { name: 'Register' })).toHaveAttribute('href', '/register');
});

test('logs in and goes home', async () => {
  renderAccount('login');
  fill('Log in', 'Email', 'testuser@example.com');
  fill('Log in', 'Password', 'password123');
  fireEvent.submit(screen.getByRole('button', { name: 'Log in' }).closest('form'));

  expect(auth.logInUser).toHaveBeenCalledWith({ email: 'testuser@example.com', password: 'password123' });
  expect(await screen.findByText('Home page')).toBeInTheDocument();
});

test('says when the log in fails', async () => {
  auth.logInUser.mockRejectedValue(new Error("That email and password don't match an account."));
  renderAccount('login');
  fireEvent.submit(screen.getByRole('button', { name: 'Log in' }).closest('form'));

  expect(await screen.findByRole('alert')).toHaveTextContent("That email and password don't match an account.");
  expect(screen.queryByText('Home page')).not.toBeInTheDocument();
});

test('registers, then waits for the password to log in', async () => {
  axios.post.mockResolvedValue({ data: {} });
  renderAccount('register');
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Register');

  fill('Register', 'Username', 'Rex45');
  fill('Register', 'Email', 'rex@example.com');
  fill('Register', 'Password', 'password123');
  const registerForm = screen.getByRole('button', { name: 'Register' }).closest('form');
  fireEvent.submit(registerForm);

  expect(axios.post).toHaveBeenCalledWith(
    expect.stringMatching(/\/register$/),
    { username: 'Rex45', email: 'rex@example.com', password: 'password123' },
    { withCredentials: true },
  );
  expect(await screen.findByText("You're registered. Log in to start saving.")).toBeInTheDocument();
  expect(form('Log in').getByLabelText('Email')).toHaveValue('rex@example.com');
  expect(form('Log in').getByLabelText('Password')).toHaveFocus();
  expect(form('Register').getByLabelText('Password')).toHaveValue('');
});

test('counts a password the way the server does', () => {
  renderAccount('register');
  fill('Register', 'Username', 'Rex45');
  fill('Register', 'Email', 'rex@example.com');
  // 19 emoji are 38 characters on screen but 76 bytes, over the 72-byte limit
  fill('Register', 'Password', '😀'.repeat(19));
  fireEvent.submit(screen.getByRole('button', { name: 'Register' }).closest('form'));

  expect(screen.getByRole('alert')).toHaveTextContent('That password is too long.');
  expect(axios.post).not.toHaveBeenCalled();
});

test('shows why registering failed', async () => {
  axios.post.mockRejectedValue({ response: { data: { error: 'That username or email is already in use' } } });
  renderAccount('register');
  fireEvent.submit(screen.getByRole('button', { name: 'Register' }).closest('form'));

  expect(await screen.findByRole('alert')).toHaveTextContent('That username or email is already in use');
  expect(screen.getByRole('status')).toBeEmptyDOMElement();
});
