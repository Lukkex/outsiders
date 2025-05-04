import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CustomSignUpConfirmation from '../../../src/components/Pages/CustomSignUpConfirmation';
import { MemoryRouter } from 'react-router-dom';

jest.mock('aws-amplify/auth', () => ({
  confirmSignUp: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockLocation = {
  state: { username: 'testuser@example.com' }
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
  Link: ({ children, ...props }) => <a {...props}>{children}</a>
}));

describe('CustomSignUpConfirmation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  it('renders confirmation form', () => {
    render(
      <MemoryRouter>
        <CustomSignUpConfirmation />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/confirmation code/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm account/i })).toBeInTheDocument();
  });

  it('shows error if code is incorrect', async () => {
    const { confirmSignUp } = require('aws-amplify/auth');
    confirmSignUp.mockRejectedValueOnce(new Error('Invalid code'));

    render(
      <MemoryRouter>
        <CustomSignUpConfirmation />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/confirmation code/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /confirm account/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid code/i)).toBeInTheDocument();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('confirms account and navigates to login on correct code', async () => {
    const { confirmSignUp } = require('aws-amplify/auth');
    confirmSignUp.mockResolvedValueOnce({ isSignUpComplete: true, nextStep: 'DONE' });

    render(
      <MemoryRouter>
        <CustomSignUpConfirmation />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/confirmation code/i), { target: { value: '654321' } });
    fireEvent.click(screen.getByRole('button', { name: /confirm account/i }));

    await waitFor(() => {
      expect(screen.getByText(/account confirmed/i)).toBeInTheDocument();
    });

    // timeout simulation
    jest.advanceTimersByTime(2000);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
