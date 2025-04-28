import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import { uploadData } from '@aws-amplify/storage';

jest.mock('@aws-amplify/storage', () => ({
  uploadData: jest.fn(),
}));

jest.mock('../../../services/formsApi', () => ({
  getSubmittedFormsFromS3: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../../utils/SiteHeader', () => () => <header>Mock SiteHeader</header>);

describe('AdminDashboard', () => {
  test('selects a PDF file and simulates upload success', async () => {
    uploadData.mockResolvedValue({ key: 'formtemplates/test.pdf' });

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    const fileInput = screen.getByTestId('file-input');
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const uploadButton = screen.getByRole('button', { name: /upload/i });
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(uploadData).toHaveBeenCalled();
    });

    expect(await screen.findByText(/successfully uploaded/i)).toBeInTheDocument();
  });
});

//renders the Upload New Form button and allows clicking it
//selects a PDF file and simulates upload success
//simulates upload failure and handles error
//calls getSubmittedFormsFromS3 after upload