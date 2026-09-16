import { createMocks } from 'node-mocks-http';
import recipesHandler from '@/pages/api/recipes/index';
import recipeByIdHandler from '@/pages/api/recipes/[id]';
import statsHandler from '@/pages/api/stats';

// Force SQLite path
delete process.env.NEXT_PUBLIC_SUPABASE_URL;

describe('GET /api/recipes', () => {
  it('returns array of recipes', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    await recipesHandler(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty('title');
    expect(data[0]).toHaveProperty('category');
  });

  it('filters by category', async () => {
    const { req, res } = createMocks({ method: 'GET', query: { category: 'Italian' } });
    await recipesHandler(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    data.forEach((r: any) => expect(r.category).toBe('Italian'));
  });
});

describe('POST /api/recipes', () => {
  it('creates a recipe', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { title: 'Test Recipe', description: 'Test', category: 'Test', ingredients: [{ name: 'Salt', quantity: '1', unit: 'tsp' }], instructions: [{ step_number: 1, content: 'Do it' }] },
    });
    await recipesHandler(req as any, res as any);
    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.title).toBe('Test Recipe');
    expect(data.ingredients).toHaveLength(1);
    expect(data.instructions).toHaveLength(1);
  });

  it('returns 400 without title', async () => {
    const { req, res } = createMocks({ method: 'POST', body: {} });
    await recipesHandler(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });
});

describe('GET /api/recipes/[id]', () => {
  it('returns recipe with ingredients and instructions', async () => {
    const { req, res } = createMocks({ method: 'GET', query: { id: '1' } });
    await recipeByIdHandler(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('ingredients');
    expect(data).toHaveProperty('instructions');
  });

  it('returns 404 for missing recipe', async () => {
    const { req, res } = createMocks({ method: 'GET', query: { id: '99999' } });
    await recipeByIdHandler(req as any, res as any);
    expect(res._getStatusCode()).toBe(404);
  });
});

describe('PUT /api/recipes/[id]', () => {
  it('updates a recipe', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
      query: { id: '1' },
      body: { title: 'Updated', ingredients: [], instructions: [] },
    });
    await recipeByIdHandler(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.title).toBe('Updated');
  });

  it('returns 404 for missing recipe', async () => {
    const { req, res } = createMocks({ method: 'PUT', query: { id: '99999' }, body: { title: 'X' } });
    await recipeByIdHandler(req as any, res as any);
    expect(res._getStatusCode()).toBe(404);
  });
});

describe('DELETE /api/recipes/[id]', () => {
  it('deletes a recipe', async () => {
    // create one first
    const { req: cReq, res: cRes } = createMocks({ method: 'POST', body: { title: 'ToDelete' } });
    await recipesHandler(cReq as any, cRes as any);
    const created = JSON.parse(cRes._getData());

    const { req, res } = createMocks({ method: 'DELETE', query: { id: String(created.id) } });
    await recipeByIdHandler(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ success: true });
  });

  it('returns 404 for missing recipe', async () => {
    const { req, res } = createMocks({ method: 'DELETE', query: { id: '99999' } });
    await recipeByIdHandler(req as any, res as any);
    expect(res._getStatusCode()).toBe(404);
  });
});

describe('GET /api/stats', () => {
  it('returns stats object', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    await statsHandler(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('total_recipes');
    expect(data).toHaveProperty('recent_count');
    expect(data).toHaveProperty('categories');
    expect(Array.isArray(data.categories)).toBe(true);
  });

  it('rejects non-GET', async () => {
    const { req, res } = createMocks({ method: 'POST' });
    await statsHandler(req as any, res as any);
    expect(res._getStatusCode()).toBe(405);
  });
});