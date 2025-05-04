// npx jest src/components/Pages/Admin/EventCreation.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EventCreation from '../../src/components/Pages/Admin/EventCreation';
import '@testing-library/jest-dom';
import { fetchAuthSession } from '@aws-amplify/auth';
import { act } from 'react';

jest.mock('@aws-amplify/auth', () => ({
  fetchAuthSession: jest.fn(),
}));

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
  fetchAuthSession.mockResolvedValue({
    tokens: { idToken: 'mock-token' },
  });

  fetch.mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: async () => [],
    })
  );
  
});

describe('EventCreation - Admin creates event', () => {
  test('Admin can create an event successfully', async () => {
    // Mock POST /events call
    fetch
    .mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({ eventID: '12re' }) // POST response
      })
    )
    .mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: async () => [] // GET events (empty list is fine)
      })
    )
    .mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({}) // Optional: name lookup fetch
      })
    );


    await act(async () => {
      render(
        <MemoryRouter>
          <EventCreation />
        </MemoryRouter>
      );
    });

    // Fill the form: select location, date, and verify time
    fireEvent.change(screen.getByLabelText(/prison/i), {
      target: { value: 'Folsom' },
    });

    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: '2025-12-01' },
    });

    // Time auto-fills on location select, but you can assert it:
    expect(screen.getByLabelText(/time/i).value).toBe('09:30');

    // Submit the form
    fireEvent.click(screen.getByText(/create event/i));

    // Wait for fetch to be called and verify arguments
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/events'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-token',
          }),
          body: JSON.stringify({
            location: 'Folsom',
            date: '2025-12-01',
            time: '09:30',
          }),
        })
      );
    });

    // Check that form was reset
    await waitFor(() => {
        expect(screen.getByLabelText(/prison/i).value).toBe('');
        expect(screen.getByLabelText(/date/i).value).toBe('');
        expect(screen.getByLabelText(/time/i).value).toBe('');
    });
  });
});

describe('EventCreation - UI rendering', () => {
    test('renders all core form fields, RSVP count, and RSVP names correctly', async () => {
      // Mock 1: fetchEvents (returns future event)
      fetch
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: async () => [
              {
                eventID: 'event-123',
                location: 'Folsom',
                date: '2030-01-01',
                time: '09:30'
              }
            ]
          })
        )
        // Mock 2: fetchRsvpData returns 2 entries
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: async () => [
              { userID: 'u1' },
              { userID: 'u2' }
            ]
          })
        )
        // Mock 3: get-user-names returns user names
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: async () => [
              { userID: 'u1', name: 'Alice Smith' },
              { userID: 'u2', name: 'Bob Jones' }
            ]
          })
        );
  
        await act(async () => {
          render(
            <MemoryRouter>
              <EventCreation />
            </MemoryRouter>
          );
        });
  
      // Form fields
      expect(screen.getByLabelText(/prison/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/time/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create event/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/search by date/i)).toBeInTheDocument();
  
      // Wait for table to render
      await waitFor(() => {
        expect(screen.getByText('RSVP Count')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument(); // 2 RSVPs
      });
  
      // Expand RSVP list and check names
      fireEvent.click(screen.getByText(/view rsvp list/i));
      expect(await screen.findByText('Alice Smith')).toBeInTheDocument();
      expect(await screen.findByText('Bob Jones')).toBeInTheDocument();
    });
  });
  
  
