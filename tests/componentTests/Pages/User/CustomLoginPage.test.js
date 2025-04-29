import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CustomLoginPage from '../../../src/components/Pages/CustomLoginPage';
import { MemoryRouter } from 'react-router-dom';
import { useUser } from '../../../../src/context/UserContext';

// Mock AWS Amplify Auth
jest.mock('@aws-amplify/auth', () => ({
  signIn: jest.fn(),
  confirmSignIn: jest.fn(),
  signOut: jest.fn(),
  resetPassword: jest.fn(),
  confirmResetPassword: jest.fn()
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock useUser
jest.mock('../../../../src/context/UserContext', () => ({
  useUser: jest.fn()
}));


describe('CustomLoginPage', () => {
  beforeEach(() => {
    useUser.mockReturnValue({ refreshUserData: jest.fn() });
  });

  it('renders login form fields', () => {
    render(
      <MemoryRouter>
        <CustomLoginPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('submits the login form successfully', async () => {
    const mockSignInOutput = {
      nextStep: { signInStep: 'DONE' }
    };

    const { signIn } = require('@aws-amplify/auth');
    const { signOut } = require('@aws-amplify/auth');
    signIn.mockResolvedValue(mockSignInOutput);
    signOut.mockResolvedValue({});

    const mockRefresh = jest.fn();
    useUser.mockReturnValue({ refreshUserData: mockRefresh });

    render(
      <MemoryRouter>
        <CustomLoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith({
        username: 'test@example.com',
        password: 'password123'
      });
      expect(mockRefresh).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('displays error message on failed login', async () => {
    const { signIn } = require('@aws-amplify/auth');
    signIn.mockRejectedValue(new Error('Login failed'));

    render(
      <MemoryRouter>
        <CustomLoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpass' }
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/login failed/i)).toBeInTheDocument();
    });
  });
});
