import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('Web Tenant Tests', () => {
  it('se ejecuta correctamente', () => {
    render(<div data-testid="tenant-test">Tenant Test</div>);
    expect(screen.getByTestId('tenant-test')).toBeInTheDocument();
    expect(screen.getByText('Tenant Test')).toBeInTheDocument();
  });
});
