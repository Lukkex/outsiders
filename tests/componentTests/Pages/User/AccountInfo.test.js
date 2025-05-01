import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AccountInfo from '../../../../src/components/Pages/User/AccountInfo';

// 🧪 Mock authConfig services
jest.mock('../../../../src/services/authConfig', () => ({
  getCurrentUserInfo: jest.fn(() => Promise.resolve({
    given_name: 'Jane',
    family_name: 'Doe',
    email: 'jane.doe@example.com',
    sub: 'user-sub-id'
  })),
  getUserRole: jest.fn(() => Promise.resolve(['basic_users'])),
}));

// 🧪 Mock MFA status
jest.mock('aws-amplify/auth', () => ({
  fetchMFAPreference: jest.fn(() => Promise.resolve({
    enabled: [],
    preferred: null,
  })),
}));

// 🧪 Mock SiteContainer to simplify test DOM
jest.mock('../../../../src/utils/SiteContainer', () => ({
  __esModule: true,
  default: ({ content }) => <div>{content}</div>,
}));

describe('AccountInfo component', () => {
  test('renders "Account Information" heading and user name', async () => {
    render(
      <MemoryRouter>
        <AccountInfo />
      </MemoryRouter>
    );

    // ✅ Use `findByText` to await async render
    expect(await screen.findByText(/Account Information/i)).toBeInTheDocument();
    expect(await screen.findByText(/Jane Doe/i)).toBeInTheDocument();
    expect(await screen.findByText(/jane.doe@example.com/i)).toBeInTheDocument();
  });
});