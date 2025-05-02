import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminScheduling from './AdminScheduling';

jest.mock('../../../context/UserContext', () => ({
  useUser: jest.fn(() => ({
    userInfo: { email: 'admin@example.com', sub: 'abc123', role: 'admin' },
    loading: false,
  })),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

test('filters events by date input', () => {
  render(
    <MemoryRouter>
      <AdminScheduling />
    </MemoryRouter>
  );
  const input = screen.getByPlaceholderText(/search by date/i);
  fireEvent.change(input, { target: { value: 'May 22, 2025' } });
  expect(input.value).toBe('May 22, 2025');
});

test('deletes an event from the list', async () => {
  fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          eventID: 'event123',
          location: 'Folsom',
          date: '2025-05-22',
          time: '10:00',
        },
      ],
    }) 
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    }) 
    .mockResolvedValueOnce({ ok: true }) 
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    }); 

  render(
    <MemoryRouter>
      <AdminScheduling />
    </MemoryRouter>
  );

  const openDeleteButton = await screen.findByText(/delete/i);
  fireEvent.click(openDeleteButton);

  const deleteButtons = await screen.findAllByRole('button', { name: /^delete$/i });
  const confirmDeleteButton = deleteButtons[1];
  fireEvent.click(confirmDeleteButton);

  await waitFor(() =>
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/events/event123'),
      expect.objectContaining({ method: 'DELETE' })
    )
  );

  await waitFor(() => {
    expect(screen.queryByText(/are you sure you want to delete this event/i)).toBeNull();
  });

  expect(fetch).toHaveBeenCalledTimes(4);
});
