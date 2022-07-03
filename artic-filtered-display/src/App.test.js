import { render, screen } from '@testing-library/react';
import App from './App';

test('renders submit button', () => {
  render(<App />);
  const formElementSubmit = screen.getByText(/Submit/i);
  expect(formElementSubmit).toBeInTheDocument();

});

test('renders textfield', () => {
  render(<App />);
  const textField = screen.getByLabelText(/Search Artic/i);
  expect(textField).toBeInTheDocument();
});


