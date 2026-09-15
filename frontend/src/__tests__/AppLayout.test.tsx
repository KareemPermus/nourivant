import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: () => ({ pathname: '/', push: jest.fn() }),
}));

jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>;
});

import AppLayout from '@/components/layout/AppLayout';

describe('AppLayout', () => {
  it('renders brand name and nav links', () => {
    render(<AppLayout><div>Test Content</div></AppLayout>);
    expect(screen.getAllByText('Nourivant').length).toBeGreaterThan(0);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Recipes')).toBeInTheDocument();
    expect(screen.getByText('Add Recipe')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders user info in sidebar', () => {
    render(<AppLayout><div /></AppLayout>);
    expect(screen.getAllByText('Nadia Farrell').length).toBeGreaterThan(0);
  });
});