import { render, screen, waitFor } from '@testing-library/react';
import Home from '@/pages/home';
import apiClient from '@/api/client';

jest.mock('@/api/client', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

const mockStats = { total_recipes: 5, recent_count: 2, categories: ['Italian', 'Asian'] };
const mockRecipes = [
  { id: 1, title: 'Pasta', description: 'Tasty', image_url: '', prep_time: 10, cook_time: 20, servings: 4, category: 'Italian', created_at: '2025-01-01' },
  { id: 2, title: 'Sushi', description: 'Fresh', image_url: '', prep_time: 30, cook_time: 0, servings: 2, category: 'Asian', created_at: '2025-01-02' },
];

beforeEach(() => {
  (apiClient.get as jest.Mock).mockImplementation((url: string) => {
    if (url === '/api/stats') return Promise.resolve({ data: mockStats });
    if (url === '/api/recipes') return Promise.resolve({ data: mockRecipes });
    return Promise.reject();
  });
});

test('renders stats and recipes', async () => {
  render(<Home />);
  await waitFor(() => expect(screen.getByText('5')).toBeInTheDocument());
  expect(screen.getByText('Pasta')).toBeInTheDocument();
  expect(screen.getByText('Italian')).toBeInTheDocument();
});

test('shows error on failure', async () => {
  (apiClient.get as jest.Mock).mockRejectedValue(new Error('fail'));
  render(<Home />);
  await waitFor(() => expect(screen.getByText('Failed to load data.')).toBeInTheDocument());
});