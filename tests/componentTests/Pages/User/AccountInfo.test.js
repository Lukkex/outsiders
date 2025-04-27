import React from 'react'
//import { Test } from 'aws-cdk-lib/aws-synthetics';
import { describe, test, it, expect} from "jest";
import AccountInfo from '../../../../src/components/Pages/User/AccountInfo';
import {render, fireEvent, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom';

/*
Test("AccountInfo displays correct details", () => {
    
});
*/

/*
Test('Loads and displays title', async () => {
    render(<AccountInfo />)
})
*/

describe (AccountInfo, () => {
    it("Test that 'Account Information' displays at the top", () => {
        const { getByTestId } = render(
        <MemoryRouter>
            <AccountInfo />
        </MemoryRouter>
        );
        const titleValue = getByTestId("title").textContent;
        expect(titleValue).toBe("Account Information");
    });
});

