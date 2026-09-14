import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Recipes from '@/pages/recipes';
import apiClient from '@/api/client';

jest.mock('@/api/client', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

const mockRecipes = [
  { id: 1, title: 'Pasta', description: 'Delicious', image_url: '', prep_time: 10, cook_time: 20, servings: 4, category: 'Italian', created_at: '2025-01-01T00:00:00Z' },
  { id: 2, title: 'Salad', description: 'Fresh', image_url: '', prep_time: 5, cook_time: 0, servings: 2, category: 'Healthy', created_at: '2025-01-02T00:00:00Z' },
];

describe('Recipes page', () => {
  beforeEach(() => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockRecipes });
  });

  it('renders recipes after loading', async () => {
    render(<Recipes />);
    expect(screen.getByText('Loading recipes…')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Pasta')).toBeInTheDocument());
    expect(screen.getByText('Salad')).toBeInTheDocument();
  });

  it('shows empty state when no recipes', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });
    render(<Recipes />);
    await waitFor(() => expect(screen.getByText('No recipes found.')).toBeInTheDocument());
  });

  it('shows error state on fetch failure', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue(new Error('fail'));
    render(<Recipes />);
    await waitFor(() => expect(screen.getByText('Failed to load recipes.')).toBeInTheDocument());
  });

  it('filters by search input', async () => {
    render(<Recipes />);
    await waitFor(() => expect(screen.getByText('Pasta')).toBeInTheDocument());
    const input = screen.getByPlaceholderText('Search recipes…');
    fireEvent.change(input, { target: { value: 'test' } });
    await waitFor(() => expect(apiClient.get).toHaveBeenCalledWith('/api/recipes', { params: { search: 'test' } }));
  });

  it('renders category filter buttons', async () => {
    render(<Recipes />);
    await waitFor(() => expect(screen.getByText('Italian')).toBeInTheDocument());
    expect(screen.getByText('Healthy')).toBeInTheDocument();
  });
});