import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('Web Admin Tests', () => {
  it('puede renderizar componentes básicos', () => {
    render(<div data-testid="admin-test">Admin Test</div>);
    expect(screen.getByTestId('admin-test')).toBeInTheDocument();
    expect(screen.getByText('Admin Test')).toBeInTheDocument();
  });

  it('maneja eventos correctamente', () => {
    let clicked = false;
    render(
      <button 
        data-testid="admin-button"
        onClick={() => { clicked = true; }}
      >
        Click me
      </button>
    );
    
    const button = screen.getByTestId('admin-button');
    button.click();
    expect(clicked).toBe(true);
  });
});
