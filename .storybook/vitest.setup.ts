/**
 * Vitest setup for Storybook portable stories.
 * Applies project annotations (decorators, parameters) from preview so that
 * composeStories/composeStory in tests use the same environment as Storybook.
 */
import { beforeAll, vi } from 'vitest';
import { setProjectAnnotations } from '@storybook/react';
import * as previewAnnotations from './preview';

// jsdom does not provide matchMedia (required by next-themes)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const annotations = setProjectAnnotations([previewAnnotations]);

if (annotations.beforeAll) 
{
  beforeAll(annotations.beforeAll);
}
