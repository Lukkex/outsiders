import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomLoginPage from '../src/components/Pages/CustomLoginPage';

describe('CustomLoginPage', () => {
  test('renders login form', () => {
    render(<CustomLoginPage onLogin={jest.fn()} />);

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('submits the form with email and password', () => {
    const mockOnLogin = jest.fn();
    render(<CustomLoginPage onLogin={mockOnLogin} />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(mockOnLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
