import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Registration from './Registration'; // Update with your actual component path

jest.mock('../../../utils/SiteHeader', () => () => <header>Mock SiteHeader</header>);

beforeAll(() => {
    global.IntersectionObserver = class {
        constructor() {}
        observe() {}
        unobserve() {}
        disconnect() {}
    };

    global.URL.createObjectURL = jest.fn(() => 'mocked-object-url');
});

global.fetch = jest.fn();

beforeEach(() => {
    fetch.mockClear();
    fetch.mockImplementation(() =>
        Promise.resolve({
        blob: () => Promise.resolve(new Blob(['mock content'], { type: 'application/pdf' }))
        })
    );
});

//Mock any necessary dependencies
jest.mock('react-router-dom', () => ({
...jest.requireActual('react-router-dom'),
useNavigate: () => jest.fn(),
}));

jest.mock('../../../services/authConfig.js', () => ({
    getCurrentUserInfo: jest.fn().mockResolvedValue({
    email: 'OutsidersDevTeam@outlook.com',
    given_name: 'Outsider',
    family_name: 'Outsider'
    })
}));

//Mock your forms data if it's imported from elsewhere
const mockPrisons = ["Folsom State Prison", "San Quentin State Prison"];
const mockForms = [
    { id: 1, fileKey: "CDCR_2301_A.pdf", sigpage: 1, sigloc: {x: 60, y: 394, width: 57, height: 20}, name: "CDCR 2301 - Policy Information for Volunteers (Part A)", prisons: ["Folsom State Prison", "San Quentin State Prison"] },
    { id: 2, fileKey: "CDCR_2301_B.pdf", sigpage: 0, sigloc: {x: 25, y: 206, width: 68, height: 24}, name: "CDCR 2301 - Policy Information for Volunteers (Part B)", prisons: ["Folsom State Prison"] },
    { id: 3, fileKey: "CDCR_2311.pdf", sigpage: 0, sigloc: {x: 167, y: 69, width: 71, height: 25}, name: "CDCR 2311 - Background Security Clearance Application", prisons: ["Folsom State Prison", "San Quentin State Prison"] },
    { id: 4, fileKey: "CDCR_2311_A.pdf", sigpage: 0, sigloc: null, name: "CDCR 2311-A - Criminal History Security Screening Form", prisons: [] },
    { id: 5, fileKey: "CDCR_PREA.pdf", sigpage: 0, sigloc: {x: 75, y: 552, width: 71, height: 25}, name: "CDCR PREA - Acknowledgement Form", prisons: ["Folsom State Prison"] },
    { id: 6, fileKey: "CDCR_181.pdf", sigpage: 0, sigloc: {x: 220, y: 34, width: 77, height: 27}, name: "CDCR 181 - Laws, Rules and Regulations", prisons: ["San Quentin State Prison"] },
    { id: 7, fileKey: "CDCR_2189.pdf", sigpage: 0, sigloc: {x: 38, y: 378, width: 77, height: 27}, name: "CDCR 2189 - Incarcerated or Paroled Relative or Associate", prisons: ["Folsom State Prison"], requiresYes: true },
];

describe('Registration Form Prison Selection Tests', () => {

    test('renders registration UI elements', async () => {
            await act(async () => {
                render(
                    <MemoryRouter>
                        <Registration />
                    </MemoryRouter>
                );
            });
    
            expect(screen.getByText(/Mock SiteHeader/i)).toBeInTheDocument();
        });

//for Folsom State Prison selection
test('should display only Folsom State Prison forms when Folsom is selected', async () => {
    const logSpy = jest.spyOn(console, 'log');
    
    render(
        <MemoryRouter>
            <Registration />
        </MemoryRouter>
    );
    
    //Verify we're on step 1
    expect(screen.getByText('Select Prisons')).toBeInTheDocument();
    
    //Folsom State Prison
    const folsomCheckbox = screen.getByLabelText(/Folsom State Prison/i);
    fireEvent.click(folsomCheckbox);
    
    //next step
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    //If step 2 is the special question for Folsom, handle that
    if (screen.getByText(/Do you know anyone who has been incarcerated/i)) {
        const noRadio = screen.getByLabelText(/No/i);
        fireEvent.click(noRadio);
        fireEvent.click(nextButton);
    }
    
    //Now on the step with forms
    //Check that Folsom-specific forms are displayed
    await waitFor(() => {
        expect(logSpy).toHaveBeenCalled();

        const availableForms = logSpy.mock.calls[logSpy.mock.calls.length - 1][0]; //Last console call

        expect(availableForms).toEqual(expect.arrayContaining([
            expect.objectContaining({ name: "CDCR 2301 - Policy Information for Volunteers (Part A)" }),
            expect.objectContaining({ name: "CDCR 2301 - Policy Information for Volunteers (Part B)" }),
            expect.objectContaining({ name: "CDCR 2311 - Background Security Clearance Application" }),
            expect.objectContaining({ name: "CDCR PREA - Acknowledgement Form" })
        ]));

        //Check that forms that should not be included are not in the list
        expect(availableForms).not.toEqual(expect.arrayContaining([
            expect.objectContaining({ name: "CDCR 181 - Laws, Rules and Regulations" }),
            expect.objectContaining({ name: "CDCR 2189 - Incarcerated or Paroled Relative or Associate" })
        ]));

        logSpy.mockRestore();
    });
});

//for San Quentin State Prison selection
test('should display only San Quentin State Prison forms when San Quentin is selected', async () => {
    const logSpy = jest.spyOn(console, 'log');

    render(
        <MemoryRouter>
            <Registration />
        </MemoryRouter>
    );
    
    //Verify we're on step 1
    expect(screen.getByText('Select Prisons')).toBeInTheDocument();
    
    //San Quentin State Prison
    const sanQuentinCheckbox = screen.getByLabelText(/San Quentin State Prison/i);
    fireEvent.click(sanQuentinCheckbox);
    
    //next step
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    await waitFor(() => {
        expect(logSpy).toHaveBeenCalled();

        const availableForms = logSpy.mock.calls[logSpy.mock.calls.length - 1][0]; //Last console call

        expect(availableForms).toEqual(expect.arrayContaining([
            expect.objectContaining({ name: "CDCR 2301 - Policy Information for Volunteers (Part A)" }),
            expect.objectContaining({ name: "CDCR 2311 - Background Security Clearance Application" }),
            expect.objectContaining({ name: "CDCR 181 - Laws, Rules and Regulations" })
        ]));

        //Check that forms that should not be included are not in the list
        expect(availableForms).not.toEqual(expect.arrayContaining([
            expect.objectContaining({ name: "CDCR PREA - Acknowledgement Form" }),
            expect.objectContaining({ name: "CDCR 2189 - Incarcerated or Paroled Relative or Associate" }),
            expect.objectContaining({ name: "CDCR 2301 - Policy Information for Volunteers (Part B)" })
        ]));

        logSpy.mockRestore();
    });
});

//Test for both prisons selected
test('should display forms for both prisons when both are selected', async () => {
    const logSpy = jest.spyOn(console, 'log');

    render(
        <MemoryRouter>
            <Registration />
        </MemoryRouter>
    );
    
    //Verify we're on step 1
    expect(screen.getByText('Select Prisons')).toBeInTheDocument();
    
    //both prisons
    const folsomCheckbox = screen.getByLabelText(/Folsom State Prison/i);
    const sanQuentinCheckbox = screen.getByLabelText(/San Quentin State Prison/i);
    fireEvent.click(folsomCheckbox);
    fireEvent.click(sanQuentinCheckbox);
    
    //next step
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    //If step 2 is the special question for Folsom, handle that
    if (screen.getByText(/Do you know anyone who has been incarcerated/i)) {
    const noRadio = screen.getByLabelText(/No/i);
    fireEvent.click(noRadio);
    fireEvent.click(nextButton);
    }
    
    await waitFor(() => {
        expect(logSpy).toHaveBeenCalled();

        const availableForms = logSpy.mock.calls[logSpy.mock.calls.length - 1][0]; //Last console call

        expect(availableForms).toEqual(expect.arrayContaining([
            expect.objectContaining({ name: "CDCR 2301 - Policy Information for Volunteers (Part A)" }),
            expect.objectContaining({ name: "CDCR 2301 - Policy Information for Volunteers (Part B)" }),
            expect.objectContaining({ name: "CDCR 2311 - Background Security Clearance Application" }),
            expect.objectContaining({ name: "CDCR 181 - Laws, Rules and Regulations" }),
            expect.objectContaining({ name: "CDCR PREA - Acknowledgement Form" })

        ]));

        //Check that forms that should not be included are not in the list
        expect(availableForms).not.toEqual(expect.arrayContaining([
            expect.objectContaining({ name: "CDCR 2189 - Incarcerated or Paroled Relative or Associate" }),
        ]));

        logSpy.mockRestore();
    });
});

//for special form display when answering "Yes" to the incarceration question
test('should display incarceration special form when "Yes" is selected for incarceration question', async () => {
    const logSpy = jest.spyOn(console, 'log');

    render(
        <MemoryRouter>
            <Registration />
        </MemoryRouter>
    );

    //both prisons
    const folsomCheckbox = screen.getByLabelText(/Folsom State Prison/i);
    const sanQuentinCheckbox = screen.getByLabelText(/San Quentin State Prison/i);
    fireEvent.click(folsomCheckbox);
    fireEvent.click(sanQuentinCheckbox);

    //next step
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    //"Yes" to the special question
    const yesRadio = screen.getByLabelText(/Yes/i);
    fireEvent.click(yesRadio);
    fireEvent.click(nextButton);

    await waitFor(() => {
        expect(logSpy).toHaveBeenCalled();

        const availableForms = logSpy.mock.calls[logSpy.mock.calls.length - 1][0]; //Last console call

        expect(availableForms).toEqual(expect.arrayContaining([
            expect.objectContaining({ name: "CDCR 2189 - Incarcerated or Paroled Relative or Associate" })
        ]));

        logSpy.mockRestore();
    });
});
});