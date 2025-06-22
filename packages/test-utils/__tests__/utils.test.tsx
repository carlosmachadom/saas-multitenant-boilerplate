import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '../src/index.js';

describe('test-utils', () => {
  it('exporta correctamente las utilidades de testing', () => {
    // Verificamos que render y screen estén disponibles
    expect(render).toBeDefined();
    expect(screen).toBeDefined();
  });

  it('puede renderizar elementos DOM básicos', () => {
    // Ejemplo simple de renderizado usando createElement en lugar de JSX
    const testElement = React.createElement('div', { 'data-testid': 'test-element' }, 'Test Content');
    render(testElement);
    
    // Verificamos que se renderizó correctamente
    const element = screen.getByTestId('test-element');
    expect(element).toBeInTheDocument();
    expect(element.textContent).toBe('Test Content');
  });
});
