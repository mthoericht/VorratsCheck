import { describe, expect, it } from 'vitest';
import { composeStories } from '@storybook/react';
import { configureAxe } from 'vitest-axe';

const axe = configureAxe({
  rules: {
    // jsdom limitation; avoid false positives from unsupported APIs.
    'color-contrast': { enabled: false },
  },
});

const axeAuthPage = configureAxe({
  rules: {
    'color-contrast': { enabled: false },
    // Login/Signup stories render a page-level <main> in the preview region wrapper.
    'landmark-main-is-top-level': { enabled: false },
  },
});

interface StoryWithRun {
  run: (context?: { args?: Record<string, unknown> }) => Promise<void>;
}

type ComposeStoriesArg = Parameters<typeof composeStories>[0];

const storyModules = import.meta.glob('./stories/**/*.stories.tsx', {
  eager: true,
});

const SKIPPED_STORIES = new Set([
  './stories/components/Layout.stories.tsx',
  './stories/components/RouteErrorBoundary.stories.tsx',
]);

describe('A11y audit across Storybook stories', () =>
{
  Object.entries(storyModules).forEach(([path, mod]) =>
  {
    if (SKIPPED_STORIES.has(path))
    {
      return;
    }

    const composed = composeStories(mod as ComposeStoriesArg);
    const entries = Object.entries(composed).filter(
      (entry): entry is [string, StoryWithRun] =>
        entry[0] !== 'default' && typeof (entry[1] as StoryWithRun).run === 'function'
    );

    entries.forEach(([storyName, Story]) =>
    {
      it(`${path} › ${storyName}`, async () =>
      {
        await Story.run();
        const isAuthPageStory =
          path === './stories/pages/Login.stories.tsx' ||
          path === './stories/pages/Signup.stories.tsx';
        const result = await (isAuthPageStory ? axeAuthPage : axe)(document.body);
        expect(result.violations, JSON.stringify(result.violations, null, 2)).toEqual([]);
      });
    });
  });
});
