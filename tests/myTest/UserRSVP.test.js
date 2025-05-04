import React from 'react';
import {render, fireEvent, screen, waitFor} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EventCreation from "../../src/components/Pages/Admin/EventCreation.js";

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

describe("Fetch event and User", () => {
    
    test("get event infomation", async () => {
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
    })

    test("fetch userid", async () =>  {
        global.fetch = jest.fn()
        .mockResolvedValueOnce({
            ok: true,
            json: async () => [
            { userIDs: 'user-1' }, 
            ],
        })
        
    })

    test("fetch username", async () => {
        global.fetch = jest.fn()
        .mockResolvedValueOnce({
            ok: true,
            json: async () => [
            { userIDs: 'user-1', name:'Bob' }, 
            ],
        })
    })

})

describe("User RSVP save and display", () =>{
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
        // Second call for userid
        .mockResolvedValueOnce({
            ok: true,
            json: async () => [
            { userIDs: 'user-1' }, 
            ],
        })
        //Third call for fetch user name
        .mockResolvedValueOnce({
            ok: true,
            json: async () => [
            { userIDs: 'user-1', name:'Bob' }, 
            ],
        })
    });
    test('renders the view rsvp list', async () => {

        render(
            <MemoryRouter>
                <EventCreation />    
            </MemoryRouter>
            
        );
        const button = await screen.findByText('View RSVP List (1)');
        expect(button).toBeInTheDocument();
    });

    test('displays rsvp users', async () => {

        render(
            <MemoryRouter>
                <EventCreation />    
            </MemoryRouter>
            
        );
        const button = await screen.findByText('View RSVP List (1)');
        //const button = await screen.findByText((text) => text.startsWith('View RSVP List'));
        //const button = await screen.findByRole('button', {name: /View RSVP List/i,});
        //const button = await screen.findByText(/view rsvp list/i, { exact: false });

        expect(button).toBeInTheDocument();
        fireEvent.click(button);
        expect(screen.getByText('Bob'));
    });
    
})