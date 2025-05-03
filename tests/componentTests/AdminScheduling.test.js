import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EventCreation from 'components/Pages/Admin/EventCreation';

jest.mock('context/UserContext', () => ({
  useUser: jest.fn(() => ({
    userInfo: { email: 'admin@example.com', sub: 'abc123', role: 'admin' },
    loading: false,
  })),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

beforeEach(() => {
  global.fetch = jest.fn((url, options = {}) => {
    if (url.includes('/events') && options.method === 'GET') {
      return Promise.resolve({
        ok: true,
        json: async () => [
          {
            eventID: 'event123',
            location: 'Folsom',
            date: '2025-05-22',
            time: '10:00',
          },
        ],
      });
    }

    if (url.includes('/user-events?eventId=')) {
      return Promise.resolve({
        ok: true,
        json: async () => [],
      });
    }

    if (url.includes('/get-user-names')) {
      return Promise.resolve({
        ok: true,
        json: async () => [{ userID: 'abc123', name: 'John Admin' }],
      });
    }

    if (url.includes('/events') && options.method === 'DELETE') {
      return Promise.resolve({ ok: true, json: async () => ({}) });
    }

    if (url.includes('/user-events') && options.method === 'DELETE') {
      return Promise.resolve({ ok: true, json: async () => ({}) });
    }

    return Promise.resolve({ ok: true, json: async () => ({}) });
  });
});

test('filters events by date input', async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <EventCreation />
      </MemoryRouter>
    );
  });

  const input = screen.getByPlaceholderText(/search by date/i);
  fireEvent.change(input, { target: { value: 'May 22, 2025' } });
  expect(input.value).toBe('May 22, 2025');
});

test('deletes an event from the list and removes users from RSVP', async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <EventCreation />
      </MemoryRouter>
    );
  });

  const openDeleteButton = await screen.findByText(/^delete$/i);
  fireEvent.click(openDeleteButton);

  const confirmDeleteButton = await screen.findAllByText(/^delete$/i);
  fireEvent.click(confirmDeleteButton[1]); 

  await waitFor(() =>
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/events'),
      expect.objectContaining({
        method: 'DELETE',
        body: expect.stringContaining('event123'),
      })
    )
  );
});
