import React from 'react';
import { act, render, fireEvent, screen, waitFor } from '@testing-library/react';
import Registration from '../../../../src/components/Pages/User/Registration';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import 'aws-amplify/storage';
import { getUrl, list, uploadData } from 'aws-amplify/storage';
import SignaturePad from 'react-signature-canvas';

jest.mock('aws-amplify/storage', () => ({
    getUrl: jest.fn(),
    list: jest.fn(),
    uploadData: jest.fn(),
  }));

getUrl.mockResolvedValue({
  url: 'https://mock-s3-url.com/fake.pdf',
  expiresAt: new Date(Date.now() + 30000)
});

uploadData.mockResolvedValue({
    path: "dummy successful upload path",
    eTag: "\"dummy etag\"",
    contentType: "application/pdf",
    size: 709737
})

jest.mock('react-signature-canvas', () => {
    const React = require('react');
  
    const mockToDataURL = jest.fn(() => 'data:image/png;base64,fakeSignature');
    const mockIsEmpty = jest.fn(() => false); // simulate that signature exists
  
    const mockSigCanvas = {
      isEmpty: mockIsEmpty,
      getCanvas: () => ({
        toDataURL: mockToDataURL
      }),
      clear: jest.fn()
    };
  
    return React.forwardRef((props, ref) => {
      if (ref) ref.current = mockSigCanvas;
      return <canvas data-testid="mock-signature-pad" {...props.canvasProps} />;
    });
});

list.mockResolvedValue({ items: [
    { path: 'uploads/OutsidersDevTeam@outlook.com/CDCR_2301_A.pdf' },
    { path: 'uploads/OutsidersDevTeam@outlook.com/CDCR_2311.pdf' },
    { path: 'uploads/OutsidersDevTeam@outlook.com/CDCR_181.pdf' }
] });

jest.mock('../../../../src/utils/SiteHeader', () => () => <div>MockHeader</div>);

jest.mock('../../../../src/services/authConfig.js', () => ({
    getCurrentUserInfo: jest.fn().mockResolvedValue({
      email: 'OutsidersDevTeam@outlook.com',
      given_name: 'Outsider',
      family_name: 'Outsider'
    })
}));

global.scrollTo = jest.fn();
global.fetch = jest.fn().mockResolvedValue({
    blob: jest.fn().mockResolvedValue(new Blob(['fake pdf content'], { type: 'application/pdf' })),
    arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(10)), // mock ArrayBuffer
});

beforeEach(() => {
  fetch.mockClear();
  let blobCounter = 0;
  global.URL.createObjectURL = jest.fn(() => `blob:http://localhost/fake-pdf-url-${blobCounter++}`);
});

describe('Registration - Attaching Files', () => {
  it('Saves attached files and displays them on screen', async () => {
    await act(async () => {
    render(
        <MemoryRouter>
            <Registration />
        </MemoryRouter>
    );
    });

    const selectSanQuentin = screen.getByDisplayValue('San Quentin State Prison');
    const next = screen.getByRole('button', { name: /Next/i });
    await act(async () => {
        fireEvent.click(selectSanQuentin);
    });
    await act(async () => {
        fireEvent.click(next);
    });

    const attachButton = screen.getByRole('button', { name: /Attach Form/i });
    const file = new File(['dummy pdf content'], 'test.pdf', { type: 'application/pdf' });

    fireEvent.click(attachButton);

    const fileInput = document.querySelector('input[type="file"]');

    await act(async () => {
        fireEvent.change(fileInput, {
            target: { files: [file] },
        });
    });

    expect(screen.getByRole('button', { name: /Remove Attachment/i })).toBeInTheDocument();
    
    await waitFor(() => {
        const iframe = document.querySelector('iframe');
        expect(iframe.src).toMatch(/^blob:http:\/\/localhost\/fake-pdf-url-\d+$/);
    });
  });
});

describe('Registration - Can revert to default form', () => {
    it('Reverts to default form after a previous, filled out form is initially displayed', async () => {
      await act(async () => {
      render(
          <MemoryRouter>
              <Registration />
          </MemoryRouter>
      );
      });
  
      const selectSanQuentin = screen.getByDisplayValue('San Quentin State Prison');
      const next = screen.getByRole('button', { name: /Next/i });
      await act(async () => {
          fireEvent.click(selectSanQuentin);
      });
      await act(async () => {
          fireEvent.click(next);
      });
  
      const revertButton = screen.getByRole('button', { name: /Revert to Default Form/i });
  
      await act(async () => {
        fireEvent.click(revertButton);
      });
      
      await waitFor(() => {
          const iframe = document.querySelector('iframe');
          expect(iframe.src).toBe('https://mock-s3-url.com/fake.pdf');
      });
    });
});

describe('Registration - Saves PDF successfully', () => {
    it('Makes sure PDFs are uploaded to the S3 database correctly', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <Registration />
                </MemoryRouter>
            );
            });
        
            const selectSanQuentin = screen.getByDisplayValue('San Quentin State Prison');
            const next = screen.getByRole('button', { name: /Next/i });

            await act(async () => {
                fireEvent.click(selectSanQuentin);
            });
            await act(async () => {
                fireEvent.click(next);
            });

            const minimalPdfBinary = new Uint8Array([
                0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34, // %PDF-1.4
                0x0A, 0x25, 0xE2, 0xE3, 0xCF, 0xD3, 0x0A,       // binary comment
                0x31, 0x20, 0x30, 0x20, 0x6F, 0x62, 0x6A, 0x0A, // 1 0 obj
                0x3C, 0x3C, 0x3E, 0x3E, 0x0A,                   // <<>>
                0x65, 0x6E, 0x64, 0x6F, 0x62, 0x6A, 0x0A,       // endobj
                0x74, 0x72, 0x61, 0x69, 0x6C, 0x65, 0x72, 0x0A, // trailer
                0x3C, 0x3C, 0x3E, 0x3E, 0x0A,                   // <<>>
                0x25, 0x25, 0x45, 0x4F, 0x46                    // %%EOF
            ]);
        
            const attachButton = screen.getByRole('button', { name: /Attach Form/i });
            const file = new File([minimalPdfBinary], 'test.pdf', { type: 'application/pdf' });
            Object.defineProperty(file, 'arrayBuffer', {
                value: () => Promise.resolve(minimalPdfBinary.buffer),
            });
            const nextForm = screen.getByRole('button', { name: /→/i });
        
            fireEvent.click(attachButton);
        
            const fileInput = document.querySelector('input[type="file"]');
        
            await act(async () => {
                fireEvent.change(fileInput, {
                    target: { files: [file] },
                });
            });

            await act(async () => {
                fireEvent.click(nextForm);
            });
        
            const file2 = new File([minimalPdfBinary], 'test2.pdf', { type: 'application/pdf' });
            Object.defineProperty(file2, 'arrayBuffer', {
                value: () => Promise.resolve(minimalPdfBinary.buffer),
            });
        
            fireEvent.click(attachButton);
        
            await act(async () => {
                fireEvent.change(fileInput, {
                    target: { files: [file2] },
                });
            });

            await act(async () => {
                fireEvent.click(nextForm);
            });
        
            const file3 = new File([minimalPdfBinary], 'test3.pdf', { type: 'application/pdf' });
            Object.defineProperty(file3, 'arrayBuffer', {
                value: () => Promise.resolve(minimalPdfBinary.buffer),
            });
        
            fireEvent.click(attachButton);

            await act(async () => {
                fireEvent.change(fileInput, {
                    target: { files: [file3] },
                });
            });

            const submitButton = screen.getByRole('button', { name: /Submit and Upload Forms/i });

            await act(async () => {
                fireEvent.click(submitButton);
            });

            await waitFor(() => {
                expect(screen.getByText('Submitted').toBeInTheDocument());
            });
});
});

describe('Registration - Saves PDF successfully', () => {
    it('Makes sure PDFs are uploaded to the S3 database correctly', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <Registration />
                </MemoryRouter>
            );
            });
        
            const selectSanQuentin = screen.getByDisplayValue('San Quentin State Prison');
            const next = screen.getByRole('button', { name: /Next/i });

            await act(async () => {
                fireEvent.click(selectSanQuentin);
            });
            await act(async () => {
                fireEvent.click(next);
            });

            const minimalPdfBinary = new Uint8Array([
                0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34, // %PDF-1.4
                0x0A, 0x25, 0xE2, 0xE3, 0xCF, 0xD3, 0x0A,       // binary comment
                0x31, 0x20, 0x30, 0x20, 0x6F, 0x62, 0x6A, 0x0A, // 1 0 obj
                0x3C, 0x3C, 0x3E, 0x3E, 0x0A,                   // <<>>
                0x65, 0x6E, 0x64, 0x6F, 0x62, 0x6A, 0x0A,       // endobj
                0x74, 0x72, 0x61, 0x69, 0x6C, 0x65, 0x72, 0x0A, // trailer
                0x3C, 0x3C, 0x3E, 0x3E, 0x0A,                   // <<>>
                0x25, 0x25, 0x45, 0x4F, 0x46                    // %%EOF
            ]);
        
            const attachButton = screen.getByRole('button', { name: /Attach Form/i });
            const file = new File([minimalPdfBinary], 'test.pdf', { type: 'application/pdf' });
            Object.defineProperty(file, 'arrayBuffer', {
                value: () => Promise.resolve(minimalPdfBinary.buffer),
            });
            const nextForm = screen.getByRole('button', { name: /→/i });
        
            fireEvent.click(attachButton);
        
            const fileInput = document.querySelector('input[type="file"]');
        
            await act(async () => {
                fireEvent.change(fileInput, {
                    target: { files: [file] },
                });
            });

            await act(async () => {
                fireEvent.click(nextForm);
            });
        
            const file2 = new File([minimalPdfBinary], 'test2.pdf', { type: 'application/pdf' });
            Object.defineProperty(file2, 'arrayBuffer', {
                value: () => Promise.resolve(minimalPdfBinary.buffer),
            });
        
            fireEvent.click(attachButton);
        
            await act(async () => {
                fireEvent.change(fileInput, {
                    target: { files: [file2] },
                });
            });

            await act(async () => {
                fireEvent.click(nextForm);
            });
        
            const file3 = new File([minimalPdfBinary], 'test3.pdf', { type: 'application/pdf' });
            Object.defineProperty(file3, 'arrayBuffer', {
                value: () => Promise.resolve(minimalPdfBinary.buffer),
            });
        
            fireEvent.click(attachButton);

            await act(async () => {
                fireEvent.change(fileInput, {
                    target: { files: [file3] },
                });
            });

            const signaturePad = screen.getByLabelText('Signature');

            await waitFor(() => {
                const iframe = document.querySelector('iframe');
                expect(iframe.src).toBe('https://mock-s3-url.com/fake.pdf');
            });
    });
});

