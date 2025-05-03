import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import SignOutButton from '../../src/components/SignOutButton.js';
import { signOut } from '@aws-amplify/auth';
import { MemoryRouter } from 'react-router-dom';

jest.mock('@aws-amplify/auth', () => ({
    signOut: jest.fn(),
}));

jest.mock('../../src/context/UserContext', () => ({
    
    useUser: () => ({
        refreshUserData: jest.fn(),
    })
}));



describe("Sign-out Button", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        delete window.location;
        window.location = { assign: jest.fn(), href:''}; 
    });

    test('renders the sign-out button', async () => {

    render(
        <MemoryRouter>
            <SignOutButton />    
        </MemoryRouter>
        
    );
    const button = await screen.findByText('Sign Out');
    expect(button).toBeInTheDocument();

    });

    test('Sign-out on click', async () => {
    
        render(
            <MemoryRouter>
                <SignOutButton />    
            </MemoryRouter>
            
        );
        const button = await screen.findByText('Sign Out');
        expect(button).toBeInTheDocument();
        fireEvent.click(button);

        await waitFor(()=> {
        expect(window.location.href).toBe('/login');
      });
        // signOut should be called
        expect(signOut).toHaveBeenCalledWith({ global: true });
    });

});

    
