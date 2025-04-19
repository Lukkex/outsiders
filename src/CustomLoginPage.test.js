import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomLoginPage from './components/Pages/CustomLoginPage';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from '../src/context/UserContext';

describe('CustomLoginPage', () => {
  test('renders login form', () => {
    render(<MemoryRouter>
      <UserProvider>
      <CustomLoginPage onLogin={jest.fn()} />
      </UserProvider>
      </MemoryRouter>);

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    //expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('submits the form with email and password', () => {
    const mockOnLogin = jest.fn();
    render(<CustomLoginPage onLogin={mockOnLogin} />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'outsidersdevteam@outlook.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(mockOnLogin).toHaveBeenCalledWith({
      email: 'outsidersdevteam@outlook.com',
      password: 'password',
    });
  });
});
