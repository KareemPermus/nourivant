import React, { useState } from 'react';
import { useRouter } from 'next/router';
import apiClient from '@/api/client';
import { Plus, Trash2, ChefHat, Clock, Users, Tag, FileText, ListOrdered } from 'lucide-react';
import styles from '@/styles/addrecipe.module.css';

interface IngredientInput {
  name: string;
  quantity: string;
  unit: string;
}

interface InstructionInput {
  step_number: number;
  content: string;
}

export default function AddRecipe() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image_url, setImageUrl] = useState('');
  const [prep_time, setPrepTime] = useState<number | ''>('');
  const [cook_time, setCookTime] = useState<number | ''>('');
  const [servings, setServings] = useState<number | ''>('');
  const [category, setCategory] = useState('');

  const [ingredients, setIngredients] = useState<IngredientInput[]>([
    { name: '', quantity: '', unit: '' },
  ]);
  const [instructions, setInstructions] = useState<InstructionInput[]>([
    { step_number: 1, content: '' },
  ]);

  const addIngredient = () => setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  const removeIngredient = (i: number) => setIngredients(ingredients.filter((_, idx) => idx !== i));
  const updateIngredient = (i: number, field: keyof IngredientInput, value: string) => {
    const copy = [...ingredients];
    copy[i] = { ...copy[i], [field]: value };
    setIngredients(copy);
  };

  const addInstruction = () =>
    setInstructions([...instructions, { step_number: instructions.length + 1, content: '' }]);
  const removeInstruction = (i: number) => {
    const filtered = instructions.filter((_, idx) => idx !== i);
    setInstructions(filtered.map((inst, idx) => ({ ...inst, step_number: idx + 1 })));
  };
  const updateInstruction = (i: number, value: string) => {
    const copy = [...instructions];
    copy[i] = { ...copy[i], content: value };
    setInstructions(copy);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Recipe title is required.');
      return;
    }
    const validIngredients = ingredients.filter((ig) => ig.name.trim());
    const validInstructions = instructions.filter((inst) => inst.content.trim());
    if (validIngredients.length === 0) {
      setError('Add at least one ingredient.');
      return;
    }
    if (validInstructions.length === 0) {
      setError('Add at least one instruction step.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await apiClient.post('/api/recipes', {
        title: title.trim(),
        description: description.trim() || undefined,
        image_url: image_url.trim() || undefined,
        prep_time: prep_time || undefined,
        cook_time: cook_time || undefined,
        servings: servings || undefined,
        category: category.trim() || undefined,
        ingredients: validIngredients,
        instructions: validInstructions.map((inst, idx) => ({ ...inst, step_number: idx + 1 })),
      });
      router.push('/recipes');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to create recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Vegan', 'Vegetarian'];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Add New Recipe</h1>
          <p className={styles.subtitle}>Create a delicious recipe to your collection</p>
        </div>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Basic Info Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <ChefHat size={18} /> Basic Information
          </h2>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Recipe Title *</label>
            <input
              className={styles.input}
              placeholder="e.g. Lemon Herb Salmon"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              rows={3}
              placeholder="A brief description of your recipe..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Image URL</label>
            <input
              className={styles.input}
              placeholder="https://example.com/photo.jpg"
              value={image_url}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <div className={styles.row3}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}><Clock size={14} /> Prep Time (min)</label>
              <input
                type="number"
                className={styles.input}
                placeholder="15"
                value={prep_time}
                onChange={(e) => setPrepTime(e.target.value ? parseInt(e.target.value) : '')}
                min={0}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}><Clock size={14} /> Cook Time (min)</label>
              <input
                type="number"
                className={styles.input}
                placeholder="30"
                value={cook_time}
                onChange={(e) => setCookTime(e.target.value ? parseInt(e.target.value) : '')}
                min={0}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}><Users size={14} /> Servings</label>
              <input
                type="number"
                className={styles.input}
                placeholder="4"
                value={servings}
                onChange={(e) => setServings(e.target.value ? parseInt(e.target.value) : '')}
                min={1}
              />
            </div>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}><Tag size={14} /> Category</label>
            <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Ingredients Card */}
        <div className={styles.card}>
          <div className={styles.cardHeaderRow}>
            <h2 className={styles.cardTitle}>
              <FileText size={18} /> Ingredients
            </h2>
            <button type="button" className={styles.addBtn} onClick={addIngredient}>
              <Plus size={16} /> Add
            </button>
          </div>
          {ingredients.map((ig, i) => (
            <div key={i} className={styles.ingredientRow}>
              <input
                className={styles.input}
                placeholder="Ingredient name *"
                value={ig.name}
                onChange={(e) => updateIngredient(i, 'name', e.target.value)}
              />
              <input
                className={styles.inputSmall}
                placeholder="Qty"
                value={ig.quantity}
                onChange={(e) => updateIngredient(i, 'quantity', e.target.value)}
              />
              <input
                className={styles.inputSmall}
                placeholder="Unit"
                value={ig.unit}
                onChange={(e) => updateIngredient(i, 'unit', e.target.value)}
              />
              {ingredients.length > 1 && (
                <button type="button" className={styles.removeBtn} onClick={() => removeIngredient(i)}>
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Instructions Card */}
        <div className={styles.card}>
          <div className={styles.cardHeaderRow}>
            <h2 className={styles.cardTitle}>
              <ListOrdered size={18} /> Instructions
            </h2>
            <button type="button" className={styles.addBtn} onClick={addInstruction}>
              <Plus size={16} /> Add Step
            </button>
          </div>
          {instructions.map((inst, i) => (
            <div key={i} className={styles.instructionRow}>
              <span className={styles.stepBadge}>{inst.step_number}</span>
              <textarea
                className={styles.textarea}
                rows={2}
                placeholder={`Step ${inst.step_number} instructions...`}
                value={inst.content}
                onChange={(e) => updateInstruction(i, e.target.value)}
              />
              {instructions.length > 1 && (
                <button type="button" className={styles.removeBtn} onClick={() => removeInstruction(i)}>
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={() => router.push('/recipes')}>
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating...' : 'Create Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
}