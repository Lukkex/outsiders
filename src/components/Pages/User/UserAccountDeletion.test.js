import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import UserAccountDeletion from './UserAccountDeletion';

jest.mock('../../../utils/SiteHeader', () => () => <header>Mock SiteHeader</header>);

beforeAll(() => {
    global.IntersectionObserver = class {
        constructor() {}
        observe() {}
        unobserve() {}
        disconnect() {}
    };
});

global.fetch = jest.fn();

beforeEach(() => {
    fetch.mockClear();
});

describe('UserAccountDeletion', () => {
    test('renders user deletion UI elements', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <UserAccountDeletion />
                </MemoryRouter>
            );
        });

        expect(screen.getByText(/Mock SiteHeader/i)).toBeInTheDocument();
    });

    test('test valid entry "I am sure"', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <UserAccountDeletion />
                </MemoryRouter>
            );
        });

        const input = screen.getByPlaceholderText("Type \"I am sure\" here");
        const confirmLink = screen.getByRole('link', { name: /confirm/i });

        window.alert = jest.fn();

        const invalidInputs = [
            '',
            'i am sure',
            'I am sure!',
            ' I am sure',
            'I am sure ',
            'I am', 
            'Sure I am',
            'I am Sure', 
        ];

        //Test invalid inputs
        for (const value of invalidInputs) {
            fireEvent.change(input, { target: { value } });
            expect(input.value).toBe(value);
            fireEvent.click(confirmLink);
            expect(window.alert).toHaveBeenCalledWith('Please type exactly "I am sure" to confirm.');
            global.alert.mockReset();
        }

        //Test valid input
        fireEvent.change(input, { target: { value: 'I am sure' } });
        expect(input.value).toBe('I am sure');
        fireEvent.click(confirmLink);
        expect(window.alert).not.toHaveBeenCalled();
    });
});