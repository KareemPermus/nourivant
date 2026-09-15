import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddRecipe from '@/pages/addrecipe';
import apiClient from '@/api/client';

jest.mock('@/api/client', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

const pushMock = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe('AddRecipe page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form fields', () => {
    render(<AddRecipe />);
    expect(screen.getByText('Add New Recipe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Lemon Herb Salmon')).toBeInTheDocument();
    expect(screen.getByText('Create Recipe')).toBeInTheDocument();
  });

  it('shows error when title is empty on submit', async () => {
    render(<AddRecipe />);
    fireEvent.click(screen.getByText('Create Recipe'));
    expect(screen.getByText('Recipe title is required.')).toBeInTheDocument();
  });

  it('shows error when no ingredients have names', async () => {
    render(<AddRecipe />);
    fireEvent.change(screen.getByPlaceholderText('e.g. Lemon Herb Salmon'), { target: { value: 'Test' } });
    fireEvent.click(screen.getByText('Create Recipe'));
    expect(screen.getByText('Add at least one ingredient.')).toBeInTheDocument();
  });

  it('submits successfully and navigates to /recipes', async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      data: {
        id: 1, title: 'Test', description: '', image_url: '', prep_time: 10,
        cook_time: 20, servings: 4, category: 'Dinner', created_at: '2025-01-01',
        ingredients: [{ id: 1, name: 'Salt', quantity: '1', unit: 'tsp' }],
        instructions: [{ id: 1, step_number: 1, content: 'Cook it' }],
      },
    });
    render(<AddRecipe />);
    fireEvent.change(screen.getByPlaceholderText('e.g. Lemon Herb Salmon'), { target: { value: 'Test Recipe' } });
    fireEvent.change(screen.getByPlaceholderText('Ingredient name *'), { target: { value: 'Salt' } });
    fireEvent.change(screen.getByPlaceholderText('Step 1 instructions...'), { target: { value: 'Cook it' } });
    fireEvent.click(screen.getByText('Create Recipe'));
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/api/recipes', expect.objectContaining({ title: 'Test Recipe' }));
      expect(pushMock).toHaveBeenCalledWith('/recipes');
    });
  });

  it('navigates to /recipes on cancel', () => {
    render(<AddRecipe />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(pushMock).toHaveBeenCalledWith('/recipes');
  });
});