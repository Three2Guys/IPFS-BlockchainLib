import { render, screen } from '@testing-library/react';
import App from './App';

test('renders IPFS Library title', () => {
    render(<App />);
    const titleElement = screen.getByText(/IPFS Library/i);
    expect(titleElement).toBeInTheDocument();
});
