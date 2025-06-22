import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('UI Package Test', () => {
  it('puede renderizar elementos básicos', () => {
    render(<div data-testid="test-element">Test UI</div>);
    expect(screen.getByTestId('test-element')).toBeInTheDocument();
    expect(screen.getByText('Test UI')).toBeInTheDocument();
  });
});
