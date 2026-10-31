import { act, render, screen } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthData, AuthWrapper } from './GetUser';

// Each request waits until the test answers it, so the tests choose the order.
const api = vi.hoisted(() => ({ pending: [] }));
vi.mock('axios', () => {
  const request = (url) => new Promise((resolve, reject) => api.pending.push({ url, resolve, reject }));
  const client = { get: request, post: request };
  return { default: { ...client, create: () => client } };
});

// Stands in for the app's pages and shows what the login context holds.
const probe = vi.hoisted(() => ({ render: null, auth: null, navigate: null, shown: [] }));
vi.mock('../Routes', () => ({
  default: function Probe() {
    return probe.render();
  },
}));

const firstUser = { user_id: 1, username: 'testuser' };
const otherUser = { user_id: 2, username: 'other' };
const twoLists = [{ list_id: 7 }, { list_id: 8 }];

beforeEach(() => {
  api.pending = [];
  probe.shown = [];
  probe.render = () => {
    probe.auth = AuthData();
    probe.navigate = useNavigate();
    const { user, userList, listsError } = probe.auth;
    const text = `${user.username || 'nobody'}: ${(userList.lists || []).length} lists${listsError ? ', error' : ''}`;
    probe.shown.push(text);
    return <p>{text}</p>;
  };
});

async function answer(end, data) {
  const index = api.pending.findIndex((request) => request.url.endsWith(end));
  if (index < 0) throw new Error(`no request for ${end}`);
  const [request] = api.pending.splice(index, 1);
  await act(async () => (data instanceof Error ? request.reject(data) : request.resolve({ data })));
}

const asked = (end) => api.pending.some((request) => request.url.endsWith(end));

function renderAuth() {
  render(
    <MemoryRouter>
      <AuthWrapper />
    </MemoryRouter>
  );
}

test('drops a lists answer that arrives after logging out', async () => {
  renderAuth();
  await answer('/check-login', { user: firstUser });
  expect(asked('/lists/user/1')).toBe(true);

  act(() => probe.auth.logout());
  await answer('/lists/user/1', { user: firstUser, lists: twoLists });

  expect(screen.getByText('nobody: 0 lists')).toBeInTheDocument();
});

test('ignores a refresh for a user who has logged out', async () => {
  renderAuth();
  await answer('/check-login', { user: firstUser });
  await answer('/lists/user/1', { user: firstUser, lists: twoLists });
  act(() => probe.auth.logout());

  // a save or delete that finishes after logging out
  await act(() => probe.auth.getUserList(1));

  expect(asked('/lists/user/1')).toBe(false);
  expect(screen.getByText('nobody: 0 lists')).toBeInTheDocument();
});

test("doesn't show the last account's lists under a new one", async () => {
  renderAuth();
  await answer('/check-login', { user: firstUser });
  await answer('/lists/user/1', { user: firstUser, lists: twoLists });
  expect(screen.getByText('testuser: 2 lists')).toBeInTheDocument();

  // another tab logged in as someone else; the next page's check finds them
  act(() => probe.navigate('/search'));
  await answer('/check-login', { user: otherUser });
  await answer('/lists/user/2', new Error('down'));

  expect(screen.getByText('other: 0 lists, error')).toBeInTheDocument();
  // not even one render paired the new name with the old lists
  expect(probe.shown).not.toContain('other: 2 lists');
});
