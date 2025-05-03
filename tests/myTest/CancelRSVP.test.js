import React from 'react';
import {render, fireEvent, screen, waitFor} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Scheduling from "../../src/components/Pages/User/Scheduling";
import getAuthHeader from "../../src/components/Pages/User/Scheduling";
import { fetchAuthSession } from '@aws-amplify/auth';

jest.mock('../../src/utils/SiteHeader', () => () => <div>MockHeader</div>);
jest.mock('@aws-amplify/auth', () => ({
    fetchAuthSession: jest.fn().mockResolvedValue({
    tokens: {
        idToken: {
            payload: { sub: 'user-1' },
            toString: () => 'mock-id-token',
            },
        },
    }),
}));
////////////////////////////////////////////////
describe("Cancel RSVP Button", () => {
    beforeEach(() => {

        global.fetch = jest.fn()
        // First call for fetching all events
        .mockResolvedValueOnce({
            ok: true,
            json: async () => [
            {
                eventID: 'event-1',
                location: 'Library',
                date: '2099-06-01',
                time: '10:00',
            }
            ],
        })
        // Second call for fetching user-specific events
        .mockResolvedValueOnce({
            ok: true,
            json: async () => [
            { eventId: 'event-1' }, 
            ],
        })
        .mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
        }) //unenroll from event
        .mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        }); // fetchUserEvents (refresh after unenroll)
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders scheduling page', async () => {
        render(
            <MemoryRouter>
            <Scheduling />
            </MemoryRouter>
        );
        const button = await screen.findByText('Cancel RSVP');
        expect(button).toBeInTheDocument();

    })

    test('cancel RSVP on click', async () => {

        render(
            <MemoryRouter>
            <Scheduling />
            </MemoryRouter>
        );

        //  Wait for the event to appear
        const button = await screen.findByText('Cancel RSVP');
        expect(button).toBeInTheDocument();
        fireEvent.click(button);


        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            method: 'DELETE',
            body: JSON.stringify({
                userID: 'user-1',
                eventId: 'event-1',
            }),
            }));
        });

    });

})
