import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import CatGame from './CatGame';

jest.mock('lottie-react', () => () => <div>LottieMock</div>);

jest.mock('canvas-confetti', () => ({
  __esModule: true,
  default: jest.fn(),  // ✅ Fix here
}));

it('renders the game title', () => {
  render(
    <MemoryRouter>
      <CatGame />
    </MemoryRouter>
  );
  expect(screen.getByText(/Catch the paw!/i)).toBeInTheDocument();
});

it('increments score when paw is clicked', () => {
  render(
    <MemoryRouter>
      <CatGame />
    </MemoryRouter>
  );
  const paw = screen.getByAltText('paw');
  fireEvent.click(paw);
  for (let i = 0; i < 4; i++) fireEvent.click(screen.getByAltText('paw'));
  expect(screen.getByText(/Okay okay, back/i)).toBeInTheDocument();
});

it('renders cat face bubbles', () => {
  render(
    <MemoryRouter>
      <CatGame />
    </MemoryRouter>
  );
  const bubbles = screen.getAllByAltText('cat-bubble');
  expect(bubbles.length).toBeGreaterThan(0);
});
