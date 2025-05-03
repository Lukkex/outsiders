import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AccountInfo from '../../../../src/components/Pages/User/AccountInfo';
import { useUser } from '../../../../src/context/UserContext';

jest.mock('../../../../src/context/UserContext', () => ({
  useUser: () => ({
    userInfo: {
      name: 'Team Outsider',
      role: 'admin',
    },
    loading: false,
    refreshUserData: jest.fn(),
  }),
}));

jest.mock('../../../../src/services/authConfig', () => ({
  getCurrentUserInfo: jest.fn(() =>
    Promise.resolve({
      given_name: 'Team',
      family_name: 'Outsiders',
      email: 'teamoutsiders@example.com',
      sub: 'user-123',
    })
  ),
  getUserRole: jest.fn(() => Promise.resolve(['basic_users'])),
}));

jest.mock('aws-amplify/auth', () => ({
  fetchMFAPreference: jest.fn(() =>
    Promise.resolve({
      enabled: ['TOTP'],
      preferred: 'TOTP',
    })
  ),
}));

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('userPrisons_user-123', JSON.stringify(['Prison A']));
});

describe('AccountInfo component', () => {
  test('renders user account information and MFA status', async () => {
    render(
      <MemoryRouter>
        <AccountInfo />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Account Information/i)).toBeInTheDocument();
      expect(screen.getByText(/Team Outsiders/)).toBeInTheDocument();
      expect(screen.getByText(/teamoutsiders@example.com/)).toBeInTheDocument();
      expect(screen.getByText(/User/)).toBeInTheDocument();
      expect(screen.getByText(/MFA Status:/)).toBeInTheDocument();
      expect(screen.getByText(/Enabled/)).toBeInTheDocument();
    });
  });
});