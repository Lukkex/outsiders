//npx jest src/components/Pages/User/UserAccountUpdateDelete.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChangePassword from '../../src/components/Pages/ChangePassword';
import UserAccountDeletion from '../../src/components/Pages/User/UserAccountDeletion';
import { BrowserRouter } from 'react-router-dom';

// Polyfill IntersectionObserver for FadeInSection
beforeAll(() => {
  global.IntersectionObserver = class {
    constructor(callback) { this.callback = callback; }
    observe() {}
    disconnect() {}
  };
});

// Mock SiteContainer to render only the inner content
jest.mock('../../src/utils/SiteContainer', () => ({
  __esModule: true,
  default: ({ content }) => <>{content}</>
}));

// Mock navigation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock Amplify Auth methods
jest.mock('@aws-amplify/auth', () => ({
  getCurrentUser: jest.fn(),
  updatePassword: jest.fn(),
  deleteUser: jest.fn(),
  signIn: jest.fn(),
}));

// Mock Amplify Storage methods
jest.mock('aws-amplify/storage', () => ({
  list: jest.fn(),
  remove: jest.fn(),
}));

// Mock service for fetching current user info
jest.mock('../../src/services/authConfig', () => ({
  getCurrentUserInfo: jest.fn(),
}));

// FE: Change Password validation
describe('FE - Change Password Sub-Page', () => {
  test('shows error when new and confirm passwords do not match', async () => {
    const { getCurrentUser, updatePassword } = require('@aws-amplify/auth');
    getCurrentUser.mockResolvedValue({});
    updatePassword.mockResolvedValue();

    await act(async () => {
      render(
        <BrowserRouter>
          <ChangePassword />
        </BrowserRouter>
      );
    });
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/enter your current password/i), { target: { value: 'oldpass' } });
      fireEvent.change(screen.getByPlaceholderText(/enter new password/i), { target: { value: 'newpass' } });
      fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), { target: { value: 'mismatch' } });
      fireEvent.click(screen.getByRole('button', { name: /change password/i }));
    });

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  test('shows error when current password is incorrect', async () => {
    const { getCurrentUser, updatePassword } = require('@aws-amplify/auth');
    const mockUser = { username: 'user-id' };
    getCurrentUser.mockResolvedValue(mockUser);
    updatePassword.mockRejectedValue(new Error('Incorrect current password'));

    await act(async () => {
      render(
        <BrowserRouter>
          <ChangePassword />
        </BrowserRouter>
      );
    });
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/enter your current password/i), { target: { value: 'wrongpass' } });
      fireEvent.change(screen.getByPlaceholderText(/enter new password/i), { target: { value: 'newpass123' } });
      fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), { target: { value: 'newpass123' } });
      fireEvent.click(screen.getByRole('button', { name: /change password/i }));
    });

    expect(await screen.findByText(/incorrect current password/i)).toBeInTheDocument();
  });
});

// BE: Password successfully updated
describe('BE - Password successfully updated', () => {
  test('calls getCurrentUser and updatePassword with correct arguments', async () => {
    const { getCurrentUser, updatePassword } = require('@aws-amplify/auth');
    const mockUser = { username: 'user-id' };
    getCurrentUser.mockResolvedValue(mockUser);
    updatePassword.mockResolvedValue();

    await act(async () => {
      render(
        <BrowserRouter>
          <ChangePassword />
        </BrowserRouter>
      );
    });
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/enter your current password/i), { target: { value: 'oldpass' } });
      fireEvent.change(screen.getByPlaceholderText(/enter new password/i), { target: { value: 'newpass123' } });
      fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), { target: { value: 'newpass123' } });
      fireEvent.click(screen.getByRole('button', { name: /change password/i }));
    });

    await waitFor(() => {
      expect(getCurrentUser).toHaveBeenCalled();
      expect(updatePassword).toHaveBeenCalledWith({ user: mockUser, oldPassword: 'oldpass', newPassword: 'newpass123' });
    });
  });

  test('cannot login with old password after change', async () => {
    const { getCurrentUser, updatePassword, signIn } = require('@aws-amplify/auth');
    const mockUser = { username: 'user-id' };
    getCurrentUser.mockResolvedValue(mockUser);
    updatePassword.mockResolvedValue();
    signIn.mockRejectedValue(new Error('Incorrect username or password'));

    await act(async () => {
      render(
        <BrowserRouter>
          <ChangePassword />
        </BrowserRouter>
      );
    });
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/enter your current password/i), { target: { value: 'oldpass' } });
      fireEvent.change(screen.getByPlaceholderText(/enter new password/i), { target: { value: 'newpass123' } });
      fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), { target: { value: 'newpass123' } });
      fireEvent.click(screen.getByRole('button', { name: /change password/i }));
    });
    await waitFor(() => expect(updatePassword).toHaveBeenCalled());

    // Attempt to sign in with the old password should fail
    await expect(signIn('user-id', 'oldpass')).rejects.toThrow(/incorrect username or password/i);
  });

  test('can login with updated password after change', async () => {
    const { getCurrentUser, updatePassword, signIn } = require('@aws-amplify/auth');
    const mockUser = { username: 'user-id' };
    getCurrentUser.mockResolvedValue(mockUser);
    updatePassword.mockResolvedValue();
    signIn.mockResolvedValue(mockUser);

    await act(async () => {
      render(
        <BrowserRouter>
          <ChangePassword />
        </BrowserRouter>
      );
    });
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/enter your current password/i), { target: { value: 'oldpass' } });
      fireEvent.change(screen.getByPlaceholderText(/enter new password/i), { target: { value: 'newpass123' } });
      fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), { target: { value: 'newpass123' } });
      fireEvent.click(screen.getByRole('button', { name: /change password/i }));
    });

    await waitFor(() => expect(updatePassword).toHaveBeenCalled());

    // Sign in with the new password should succeed
    await expect(signIn('user-id', 'newpass123')).resolves.toMatchObject(mockUser);
  });
});

// BE: Account properly deleted
describe('BE - Account properly deleted', () => {
  test('calls deleteUser and deletes S3 uploads when confirmed', async () => {
    const { deleteUser } = require('@aws-amplify/auth');
    const { getCurrentUserInfo } = require('../../src/services/authConfig');
    getCurrentUserInfo.mockResolvedValue({ email: 'test@example.com' });

    const { list, remove } = require('aws-amplify/storage');
    list.mockResolvedValue({ items: [
      { path: 'uploads/test@example.com/file1.txt' },
      { path: 'uploads/test@example.com/file2.txt' }
    ] });
    remove.mockResolvedValue();
    deleteUser.mockResolvedValue();

    await act(async () => {
      render(
        <BrowserRouter>
          <UserAccountDeletion />
        </BrowserRouter>
      );
    });
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/type "i am sure" here/i), { target: { value: 'I am sure' } });
      fireEvent.click(screen.getByText(/confirm/i));
    });

    await waitFor(() => {
      expect(list).toHaveBeenCalledWith({ path: 'uploads/test@example.com/' });
      expect(remove).toHaveBeenCalledTimes(2);
      expect(deleteUser).toHaveBeenCalled();
    });
  });

  test('cannot login with deleted account', async () => {
    const { signIn } = require('@aws-amplify/auth');
    signIn.mockRejectedValue(new Error('User does not exist'));

    await expect(signIn('test@example.com', 'anyPassword')).rejects.toThrow(/user does not exist/i);
  });

  test('storage no longer lists removed files after deletion', async () => {
    const { deleteUser } = require('@aws-amplify/auth');
    const { getCurrentUserInfo } = require('../../src/services/authConfig');
    getCurrentUserInfo.mockResolvedValue({ email: 'test@example.com' });

    const { list, remove } = require('aws-amplify/storage');
    list.mockResolvedValueOnce({ items: [
      { path: 'uploads/test@example.com/file1.txt' },
      { path: 'uploads/test@example.com/file2.txt' }
    ] });
    list.mockResolvedValueOnce({ items: [] });
    remove.mockResolvedValue();
    deleteUser.mockResolvedValue();

    await act(async () => {
      render(
        <BrowserRouter>
          <UserAccountDeletion />
        </BrowserRouter>
      );
    });
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/type "I am sure" here/i), { target: { value: 'I am sure' } });
      fireEvent.click(screen.getByText(/confirm/i));
    });

    await waitFor(() => expect(list).toHaveBeenCalledWith({ path: 'uploads/test@example.com/' }));
    await expect(list({ path: 'uploads/test@example.com/' })).resolves.toMatchObject({ items: [] });
  });

  test('does not delete account when confirmation text is incorrect', async () => {
    const { deleteUser } = require('@aws-amplify/auth');
    const { getCurrentUserInfo } = require('../../src/services/authConfig');
    getCurrentUserInfo.mockResolvedValue({ email: 'test@example.com' });

    const { list, remove } = require('aws-amplify/storage');
    list.mockResolvedValue({ items: [
      { path: 'uploads/test@example.com/file1.txt' },
      { path: 'uploads/test@example.com/file2.txt' }
    ] });
    remove.mockResolvedValue();
    deleteUser.mockResolvedValue();

    // initial render triggers list once
    await act(async () => {
      render(
        <BrowserRouter>
          <UserAccountDeletion />
        </BrowserRouter>
      );
    });

    // clear initial calls
    list.mockClear();
    remove.mockClear();
    deleteUser.mockClear();

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/type "i am sure" here/i), { target: { value: 'i am' } });
      fireEvent.click(screen.getByText(/confirm/i));
    });

    // Expect no deletion actions when confirmation is incorrect
    expect(list).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
    expect(deleteUser).not.toHaveBeenCalled();
  });
});
