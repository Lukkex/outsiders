import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import AdminDashboard from './AdminDashboard';

jest.mock('../../../services/formsApi', () => ({
  getSubmittedFormsFromS3: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../../utils/SiteHeader', () => () => <header>Mock SiteHeader</header>);

describe('AdminDashboard', () => {
  test('renders dashboard title', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AdminDashboard />
        </MemoryRouter>
      );
    });

    expect(screen.getByText(/ADMIN DASHBOARD - VIEW SUBMITTED FORMS/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload New Form/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock SiteHeader/i)).toBeInTheDocument();
  });
});


//simply tests that the admin dashboard renders without problem for users
//no crashes, no ui bugs, and correct titles

//to test: npx jest 'filepath'
//need to install: npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event @babel/preset-env @babel/preset-react babel-jest identity-obj-proxy

//to run all use npm run test:log
//this one creates a txt log of the tests