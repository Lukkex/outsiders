import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MFASetup from '../../../../src/components/Pages/User/MFASetup';
import { MemoryRouter } from 'react-router-dom';

jest.mock('aws-amplify/auth', () => ({
  setUpTOTP: jest.fn(),
  verifyTOTPSetup: jest.fn(),
  updateMFAPreference: jest.fn(),
  fetchMFAPreference: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('qrcode.react', () => ({
  QRCodeCanvas: () => <div data-testid="qrcode" />
}));

jest.mock('../../../../src/utils/SiteHeader', () => () => <div data-testid="site-header" />);

describe('MFASetup', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    // By default, MFA is not enabled
    require('aws-amplify/auth').fetchMFAPreference.mockResolvedValue({ enabled: [] });
  });

  it('renders setup instructions and starts MFA setup', async () => {
    render(
      <MemoryRouter>
        <MFASetup />
      </MemoryRouter>
    );
    expect(screen.getByText(/multi-factor authentication adds an extra layer/i)).toBeInTheDocument();

    // Simulate clicking "Start MFA Setup"
    const { setUpTOTP } = require('aws-amplify/auth');
    setUpTOTP.mockResolvedValue({
      getSetupUri: () => ({
        toString: () => 'otpauth://totp/outsiders?secret=ABC123'
      })
    });

    fireEvent.click(screen.getByRole('button', { name: /start mfa setup/i }));

    await waitFor(() => {
      expect(setUpTOTP).toHaveBeenCalled();
      expect(screen.getByText(/scan this qr code/i)).toBeInTheDocument();
      expect(screen.getByText(/otpauth:\/\/totp\/outsiders\?secret=ABC123/)).toBeInTheDocument();
    });
  });

  it('verifies TOTP code and navigates to account info on success', async () => {
    // Setup QR code state
    const { setUpTOTP, verifyTOTPSetup, updateMFAPreference } = require('aws-amplify/auth');
    setUpTOTP.mockResolvedValue({
      getSetupUri: () => ({
        toString: () => 'otpauth://totp/outsiders?secret=ABC123'
      })
    });
    verifyTOTPSetup.mockResolvedValue({});
    updateMFAPreference.mockResolvedValue({});

    render(
      <MemoryRouter>
        <MFASetup />
      </MemoryRouter>
    );

    // Start setup
    fireEvent.click(screen.getByRole('button', { name: /start mfa setup/i }));
    await waitFor(() => screen.getByText(/scan this qr code/i));

    // Enter TOTP code and submit
    fireEvent.change(screen.getByLabelText(/enter the verification code/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /verify code/i }));

    await waitFor(() => {
      expect(verifyTOTPSetup).toHaveBeenCalledWith({ code: '123456' });
      expect(updateMFAPreference).toHaveBeenCalledWith({ totp: 'PREFERRED' });
      expect(screen.getByText(/mfa preferences updated successfully/i)).toBeInTheDocument();
    });

    // Simulate navigation after timeout
    jest.advanceTimersByTime(2000);
    expect(mockNavigate).toHaveBeenCalledWith('/accountinfo');
  });

  it('shows error if TOTP verification fails', async () => {
    const { setUpTOTP, verifyTOTPSetup } = require('aws-amplify/auth');
    setUpTOTP.mockResolvedValue({
      getSetupUri: () => ({
        toString: () => 'otpauth://totp/outsiders?secret=ABC123'
      })
    });
    verifyTOTPSetup.mockRejectedValue(new Error('Invalid code'));

    render(
      <MemoryRouter>
        <MFASetup />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /start mfa setup/i }));
    await waitFor(() => screen.getByText(/scan this qr code/i));

    fireEvent.change(screen.getByLabelText(/enter the verification code/i), { target: { value: '000000' } });
    fireEvent.click(screen.getByRole('button', { name: /verify code/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to verify totp setup/i)).toBeInTheDocument();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('disables MFA and navigates to account info', async () => {
    // Simulate MFA already enabled
    require('aws-amplify/auth').fetchMFAPreference.mockResolvedValue({ enabled: ['TOTP'] });
    const { updateMFAPreference } = require('aws-amplify/auth');
    updateMFAPreference.mockResolvedValue({});

    render(
      <MemoryRouter>
        <MFASetup />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText(/multi-factor authentication is currently enabled/i));
    fireEvent.click(screen.getByRole('button', { name: /disable mfa/i }));

    // Confirm disable
    fireEvent.click(screen.getByRole('button', { name: /yes, disable mfa/i }));

    await waitFor(() => {
      expect(updateMFAPreference).toHaveBeenCalledWith({ totp: 'DISABLED' });
      expect(screen.getByText(/mfa has been disabled successfully/i)).toBeInTheDocument();
    });

    jest.advanceTimersByTime(2000);
    expect(mockNavigate).toHaveBeenCalledWith('/accountinfo');
  });
});
