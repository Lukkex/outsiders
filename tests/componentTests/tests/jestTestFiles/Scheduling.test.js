import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Scheduling from '../../../../src/components/Pages/User/Scheduling'; //might throw error

test('two plus two', () => {
    const value = 2 + 2;
    expect(value).toBeGreaterThan(3);
    expect(value).toBeGreaterThanOrEqual(3.5);
    expect(value).toBeLessThan(5);
    expect(value).toBeLessThanOrEqual(4.5);
});


/*
test('renders scheduling page with correct elements', () => {
    render(<Scheduling />);

    // Check if the heading is present
  expect(screen.getByText('Please Complete Registration to Continue.')).toBeInTheDocument();

  // Check for the debug toggle button
  expect(screen.getByText(/\[debug\] Toggle Registration/i)).toBeInTheDocument();
});

// Test: Show and Hide Scheduling Table
test('toggles scheduling form visibility', () => {
    render(<Scheduling />);
    
    // Before clicking, schedule table should NOT be visible
    expect(screen.queryByText('Select Available Dates')).not.toBeInTheDocument();
  
    // Click toggle button
    fireEvent.click(screen.getByText(/\[debug\] Toggle Registration/i));
  
    // After clicking, schedule table should be visible
    expect(screen.getByText('Select Available Dates')).toBeInTheDocument();
  });

  // Test: Selecting Meeting Dates
test('allows users to select and deselect meeting dates', () => {
  render(<Scheduling />);
  fireEvent.click(screen.getByText(/\[debug\] Toggle Registration/i)); // Show the table

  // Find the first checkbox and click it
  const checkboxes = screen.getAllByRole('checkbox');
  fireEvent.click(checkboxes[0]);

  // Check if the checkbox is selected
  expect(checkboxes[0]).toBeChecked();

  // Click it again to deselect
  fireEvent.click(checkboxes[0]);

  // Check if the checkbox is unchecked
  expect(checkboxes[0]).not.toBeChecked();
});

// Test: Show "Please select at least one date" when no selection is made
test('shows error message when trying to save with no selection', () => {
  render(<Scheduling />);
  fireEvent.click(screen.getByText(/\[debug\] Toggle Registration/i)); // Show the table

  // Click save without selecting anything
  fireEvent.click(screen.getByText('Confirm Selection'));

  // Check if error message appears
  expect(screen.getByText('Please select at least one date')).toBeInTheDocument();
});

// Test: Show "Dates saved!" when selection is made
test('shows success message when dates are selected and saved', () => {
  render(<Scheduling />);
  fireEvent.click(screen.getByText(/\[debug\] Toggle Registration/i)); // Show the table

  // Select first checkbox
  const checkboxes = screen.getAllByRole('checkbox');
  fireEvent.click(checkboxes[0]);

  // Click save button
  fireEvent.click(screen.getByText('Confirm Selection'));

  // Check if success message appears
  expect(screen.getByText('Dates saved!')).toBeInTheDocument();
});

*/