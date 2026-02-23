import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { getErrorMessage } from '../lib/api';

export interface ResourceState<T>
{
  items: T[];
  loaded: boolean;
  error: string | null;
  fetch: () => Promise<void>;
}

export interface CrudState<T, CreateInput, UpdateInput> extends ResourceState<T>
{
  add: (input: CreateInput) => Promise<void>;
  update: (id: string, input: UpdateInput) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

// Overload: read-only store (e.g. deals)
export function createResourceStore<T>(config: {
  fetchFn: () => Promise<T[]>;
}): UseBoundStore<StoreApi<ResourceState<T>>>;

// Overload: full CRUD store
export function createResourceStore<
  T extends { id: string },
  CreateInput = Record<string, unknown>,
  UpdateInput = Record<string, unknown>,
>(config: {
  fetchFn: () => Promise<T[]>;
  createFn: (input: CreateInput) => Promise<T>;
  updateFn?: (id: string, input: UpdateInput) => Promise<T>;
  deleteFn: (id: string) => Promise<void>;
  insertAt?: 'start' | 'end';
  sort?: (a: T, b: T) => number;
}): UseBoundStore<StoreApi<CrudState<T, CreateInput, UpdateInput>>>;

// Implementation
export function createResourceStore<T extends { id: string }, CreateInput, UpdateInput>(config: {
  fetchFn: () => Promise<T[]>;
  createFn?: (input: CreateInput) => Promise<T>;
  updateFn?: (id: string, input: UpdateInput) => Promise<T>;
  deleteFn?: (id: string) => Promise<void>;
  insertAt?: 'start' | 'end';
  sort?: (a: T, b: T) => number;
})
{
  return create<CrudState<T, CreateInput, UpdateInput>>((set, get) => ({
    items: [],
    loaded: false,
    error: null,

    fetch: async () =>
    {
      try
      {
        const items = await config.fetchFn();
        set({ items, loaded: true, error: null });
      }
      catch (e)
      {
        set({ loaded: true, error: getErrorMessage(e) });
      }
    },

    add: async (input: CreateInput) =>
    {
      const created = await config.createFn!(input);
      let items = config.insertAt === 'start'
        ? [created, ...get().items]
        : [...get().items, created];
      if (config.sort)
      {
        items = items.sort(config.sort);
      }
      set({ items });
    },

    update: async (id: string, input: UpdateInput) =>
    {
      const updated = await config.updateFn!(id, input);
      set({ items: get().items.map((i) => (i.id === id ? updated : i)) });
    },

    remove: async (id: string) =>
    {
      await config.deleteFn!(id);
      set({ items: get().items.filter((i) => i.id !== id) });
    },
  }));
}
