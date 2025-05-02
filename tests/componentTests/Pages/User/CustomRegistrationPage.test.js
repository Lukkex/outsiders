import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CustomRegistrationPage from '../../../../src/components/Pages/CustomRegistrationPage.js';

jest.mock('aws-amplify/auth', () => ({
    signUp: jest.fn(() =>
      Promise.resolve({
        isSignUpComplete: true,
        userId: 'mock-user-id',
        nextStep: { signUpStep: 'DONE' },
      })
    ),
  }));
  
  const mockNavigate = jest.fn();
  jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
      ...actual,
      useNavigate: () => mockNavigate,
      Link: ({ to, children }) => <a href={to}>{children}</a>,
    };
  });
  
  describe('CustomRegistrationPage', () => {
    test('submits the form successfully with matching passwords', async () => {
      render(
        <MemoryRouter>
          <CustomRegistrationPage />
        </MemoryRouter>
      );
  
      fireEvent.change(screen.getByPlaceholderText(/Enter your first name/i), {
        target: { value: 'Team' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Enter your last name/i), {
        target: { value: 'Outsiders' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
        target: { value: 'teamoutsiders@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
        target: { value: 'Password123!' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), {
        target: { value: 'Password123!' },
      });
  
      fireEvent.click(screen.getByRole('button', { name: /register/i }));
  
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/confirm-signup', {
          state: { username: 'teamoutsiders@example.com' },
        });
      });
    });
  
    test('shows error if passwords do not match', async () => {
      render(
        <MemoryRouter>
          <CustomRegistrationPage />
        </MemoryRouter>
      );
  
      fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
        target: { value: 'pass1' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), {
        target: { value: 'pass2' },
      });
  
      fireEvent.click(screen.getByRole('button', { name: /register/i }));
  
      expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });