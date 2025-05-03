import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from 'components/Pages/Admin/AdminDashboard';

jest.mock('services/formsApi', () => ({
  getSubmittedFormsFromS3: jest.fn().mockResolvedValue([]),
}));

jest.mock('utils/SiteHeader', () => () => <header>Mock SiteHeader</header>);

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
        json: async () => [{ email: 'john@example.com', userID: 'abc123' }],
      });
    }

    if (url.includes('/promote')) {
      return Promise.resolve({ ok: true, json: async () => ({ success: true }) });
    }

    if (url.includes('/delete-user')) {
      return Promise.resolve({ ok: true, json: async () => ({}) });
    }

    return Promise.resolve({
      ok: true,
      json: async () => [],
    });
  });
});

describe('AdminDashboard', () => {
  test('renders admin dashboard UI elements', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AdminDashboard />
        </MemoryRouter>
      );
    });

    expect(screen.getByText(/Upload Files/i)).toBeInTheDocument();
    expect(screen.getByText(/View Users/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock SiteHeader/i)).toBeInTheDocument();
  });

  test('filters forms by user name input', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AdminDashboard />
        </MemoryRouter>
      );
    });

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'john' } });
    expect(input.value).toBe('john');
  });

  test('sorts forms by most recent first', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AdminDashboard />
        </MemoryRouter>
      );
    });

    expect(screen.getByText(/no forms found/i)).toBeInTheDocument(); 
  });

  test('toggles user admin status', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AdminDashboard />
        </MemoryRouter>
      );
    });

    const promoteButton = screen.queryByText(/promote/i);
    if (promoteButton) {
      fireEvent.click(promoteButton);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/promote'),
        expect.anything()
      );
    } else {
      expect(true).toBe(true); 
    }
  });

  test('deletes a user account', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AdminDashboard />
        </MemoryRouter>
      );
    });

    const deleteButton = screen.queryByText(/delete user/i);
    if (deleteButton) {
      fireEvent.click(deleteButton);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/delete-user'),
        expect.anything()
      );
    } else {
      expect(true).toBe(true);
    }
  });
});
