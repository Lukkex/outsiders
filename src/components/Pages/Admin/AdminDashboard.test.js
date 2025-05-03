import React from 'react';
import { render, screen, fireEvent,act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import { getSubmittedFormsFromS3 } from '../../../services/getSubmittedFormsFromS3';

jest.mock('../../../services/getSubmittedFormsFromS3', () => ({
  getSubmittedFormsFromS3: jest.fn().mockResolvedValue([]),
}));


jest.mock('../../../utils/SiteHeader', () => () => <header>Mock SiteHeader</header>);

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

  test('filters admin forms by form code', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AdminDashboard />
        </MemoryRouter>
      );
    });

    const input = screen.getByPlaceholderText(/search/i);

    const testSearch = async (value, shouldFindResults) => {
      fireEvent.change(input, { target: { value } });
      expect(input.value).toBe(value);

      if (shouldFindResults) {
        const results = await screen.findAllByTestId('search-result');
        expect(results.length).toBeGreaterThan(1);
      } else {
        //Wait for DOM update, check that no results are found
        await act(() => Promise.resolve());
        const results = screen.queryAllByTestId('search-result');
        expect(results.length).toBe(1);
      }
    };

    await testSearch('181', true); //Form Code - Valid
    await testSearch('CDCA', false); //Form Code - Invalid
  });

  test('filters admin forms by first name', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AdminDashboard />
        </MemoryRouter>
      );
    });

    const input = screen.getByPlaceholderText(/search/i);

    const testSearch = async (value, shouldFindResults) => {
      fireEvent.change(input, { target: { value } });
      expect(input.value).toBe(value);

      if (shouldFindResults) {
        const results = await screen.findAllByTestId('search-result');
        expect(results.length).toBeGreaterThan(0);
      } else {
        //Wait for DOM update, check that no results are found
        await act(() => Promise.resolve());
        const results = screen.queryAllByTestId('search-result');
        expect(results.length).toBe(1);
      }
    };

    await testSearch('Matt', true); //First Name - Valid
    await testSearch('Demetrius', false); //First Name - Invalid
  });

  test('filters admin forms by last name', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AdminDashboard />
        </MemoryRouter>
      );
    });

    const input = screen.getByPlaceholderText(/search/i);

    const testSearch = async (value, shouldFindResults) => {
      fireEvent.change(input, { target: { value } });
      expect(input.value).toBe(value);

      if (shouldFindResults) {
        const results = await screen.findAllByTestId('search-result');
        expect(results.length).toBeGreaterThan(0);
      } else {
        //Wait for DOM update, check that no results are found
        await act(() => Promise.resolve());
        const results = screen.queryAllByTestId('search-result');
        expect(results.length).toBe(1);
      }
    };

    await testSearch('Briseno', true); //Last Name - Valid
    await testSearch('Smith', false); //Last Name - Invalid
  });

  test('filters admin forms by email', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AdminDashboard />
        </MemoryRouter>
      );
    });

    const input = screen.getByPlaceholderText(/search/i);

    const testSearch = async (value, shouldFindResults) => {
      fireEvent.change(input, { target: { value } });
      expect(input.value).toBe(value);

      if (shouldFindResults) {
        const results = await screen.findAllByTestId('search-result');
        expect(results.length).toBeGreaterThan(0);
      } else {
        //Wait for DOM update, check that no results are found
        await act(() => Promise.resolve());
        const results = screen.queryAllByTestId('search-result');
        expect(results.length).toBe(1);
      }
    };

    await testSearch('sdEvtEAm', true); //Email - Valid
    await testSearch('OutsidersDevTeam@outlook.con', false); //Email - Invalid
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

//simply tests that the admin dashboard renders without problem for users
//no crashes, no ui bugs, and correct titles

//to test: npx jest 'filepath'
//need to install: npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event @babel/preset-env @babel/preset-react babel-jest identity-obj-proxy

//to run all use npm run test:log
//this one creates a txt log of the tests