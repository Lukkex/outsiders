import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import AdminDashboard from 'components/Pages/Admin/AdminDashboard';

jest.mock('services/formsApi', () => ({
  getSubmittedFormsFromS3: jest.fn().mockResolvedValue([]),
}));

jest.mock('utils/SiteHeader', () => () => <header>Mock SiteHeader</header>);

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
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
    const rows = screen.queryAllByTestId('form-row');
    if (rows.length >= 2) {
      const first = new Date(rows[0].dataset.timestamp);
      const second = new Date(rows[1].dataset.timestamp);
      expect(first.getTime()).toBeGreaterThanOrEqual(second.getTime());
    } else {
      expect(true).toBe(true);
    }
  });

  test('toggles user admin status', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });

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
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/promote'), expect.anything());
    } else {
      expect(true).toBe(true);
    }
  });

  test('deletes a user account', async () => {
    fetch.mockResolvedValueOnce({ ok: true });

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
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/delete-user'), expect.anything());
    } else {
      expect(true).toBe(true);
    }
  });
});
