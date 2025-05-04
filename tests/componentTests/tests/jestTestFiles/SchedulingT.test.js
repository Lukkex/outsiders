import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Scheduling from '../../../../src/components/Pages/User/Scheduling';
import { fetchAuthSession } from '@aws-amplify/auth';
import '@testing-library/jest-dom';

jest.mock('@aws-amplify/auth');

// Mock upcoming events
const mockEvents = [
  {
    eventID: '1',
    location: 'Folsom',
    date: '2030-05-10',
    time: '10:00',
  },
  {
    eventID: '2',
    location: 'San Quentin',
    date: '2030-06-12',
    time: '12:00',
  },
];

beforeEach(() => {
  fetchAuthSession.mockResolvedValue({
    tokens: {
      idToken: {
        toString: () => 'mock-token',
        payload: { sub: 'mock-user' },
      },
    },
  });

  global.fetch = jest.fn((url) => {
    if (url.includes('user-events')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    }

    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockEvents),
    });
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Scheduling - Location Filtering', () => {
  it('filters events by selected location', async () => {
    render(<Scheduling />);

    await screen.findByText('Available Events');

    // Select Folsom from the dropdown
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Folsom' },
    });

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows.some(row => row.textContent.includes('Folsom'))).toBe(true);
      expect(rows.some(row => row.textContent.includes('San Quentin'))).toBe(false);
    });
  });
});

describe('Scheduling - RSVP number count', () => {
  it('increments RSVP confirmation count when events are selected', async () => {
    render(<Scheduling />);
    await screen.findByText('Available Events');

    // Wait for buttons to appear
    const rsvpButtons = await screen.findAllByRole('button', { name: 'RSVP' });
    expect(rsvpButtons.length).toBeGreaterThan(0);

    // Click the first RSVP button
    fireEvent.click(rsvpButtons[0]);

    // Check if the Confirm RSVPs button appears with correct count
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Confirm RSVPs \(1\)/i })).toBeInTheDocument();
    });
  });
});
