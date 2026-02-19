/**
 * Storybook stories run as Vitest tests via the portable stories API.
 * Each story is rendered (and optional play function executed) to catch regressions.
 * Output: one describe block per component, one it() per story (visible in test reporter).
 */
import { describe, it } from 'vitest';
import { composeStories } from '@storybook/react';

// UI
import * as buttonStories from './stories/components/ui/button.stories';
import * as cardStories from './stories/components/ui/card.stories';
import * as inputStories from './stories/components/ui/input.stories';
import * as badgeStories from './stories/components/ui/badge.stories';
import * as labelStories from './stories/components/ui/label.stories';
import * as alertStories from './stories/components/ui/alert.stories';
import * as statCardStories from './stories/components/ui/stat-card.stories';

// Dashboard
import * as expiredItemsCardStories from './stories/components/dashboard/ExpiredItemsCard.stories';
import * as expiringSoonCardStories from './stories/components/dashboard/ExpiringSoonCard.stories';
import * as lowStockCardStories from './stories/components/dashboard/LowStockCard.stories';
import * as quickActionsCardStories from './stories/components/dashboard/QuickActionsCard.stories';

// Inventory
import * as inventoryEmptyStateStories from './stories/components/inventory/InventoryEmptyState.stories';
import * as inventoryFilterBarStories from './stories/components/inventory/InventoryFilterBar.stories';
import * as inventoryFilterStories from './stories/components/inventory/InventoryFilter.stories';
import * as inventoryItemCardStories from './stories/components/inventory/InventoryItemCard.stories';

// Wishlist
import * as wishlistStatsStories from './stories/components/wishlist/WishlistStats.stories';
import * as wishlistEmptyStateStories from './stories/components/wishlist/WishlistEmptyState.stories';
import * as wishlistPrioritySectionStories from './stories/components/wishlist/WishlistPrioritySection.stories';
import * as wishlistItemCardStories from './stories/components/wishlist/WishlistItemCard.stories';

// Must-Have
import * as mustHaveCardStories from './stories/components/mustHave/MustHaveCard.stories';
import * as mustHaveEmptyStateStories from './stories/components/mustHave/MustHaveEmptyState.stories';
import * as mustHaveStatsStories from './stories/components/mustHave/MustHaveStats.stories';

// Recipe
import * as recipeCardStories from './stories/components/recipe/RecipeCard.stories';
import * as recipeListSectionStories from './stories/components/recipe/RecipeListSection.stories';

// Settings
import * as settingsAppearanceStories from './stories/components/settings/SettingsAppearance.stories';
import * as settingsCategoriesStories from './stories/components/settings/SettingsCategories.stories';

// Other components
import * as quantityStories from './stories/components/Quantity.stories';
import * as barcodeScannerStories from './stories/components/BarcodeScanner.stories';

const storyModules = [
  { name: 'Button', stories: buttonStories },
  { name: 'Card', stories: cardStories },
  { name: 'Input', stories: inputStories },
  { name: 'Badge', stories: badgeStories },
  { name: 'Label', stories: labelStories },
  { name: 'Alert', stories: alertStories },
  { name: 'StatCard', stories: statCardStories },
  { name: 'ExpiredItemsCard', stories: expiredItemsCardStories },
  { name: 'ExpiringSoonCard', stories: expiringSoonCardStories },
  { name: 'LowStockCard', stories: lowStockCardStories },
  { name: 'QuickActionsCard', stories: quickActionsCardStories },
  { name: 'InventoryEmptyState', stories: inventoryEmptyStateStories },
  { name: 'InventoryFilterBar', stories: inventoryFilterBarStories },
  { name: 'InventoryFilter', stories: inventoryFilterStories },
  { name: 'InventoryItemCard', stories: inventoryItemCardStories },
  { name: 'WishlistStats', stories: wishlistStatsStories },
  { name: 'WishlistEmptyState', stories: wishlistEmptyStateStories },
  { name: 'WishlistPrioritySection', stories: wishlistPrioritySectionStories },
  { name: 'WishlistItemCard', stories: wishlistItemCardStories },
  { name: 'MustHaveCard', stories: mustHaveCardStories },
  { name: 'MustHaveEmptyState', stories: mustHaveEmptyStateStories },
  { name: 'MustHaveStats', stories: mustHaveStatsStories },
  { name: 'RecipeCard', stories: recipeCardStories },
  { name: 'RecipeListSection', stories: recipeListSectionStories },
  { name: 'SettingsAppearance', stories: settingsAppearanceStories },
  { name: 'SettingsCategories', stories: settingsCategoriesStories },
  { name: 'Quantity', stories: quantityStories },
  { name: 'BarcodeScanner', stories: barcodeScannerStories },
  // Layout and RouteErrorBoundary add their own Router (Router inside preview’s MemoryRouter) → skip.
  // Page stories (Dashboard, Inventory, Login, …) are covered via test/integration.
] as const;

/** Composed story with run() per Storybook portable stories API. */
interface StoryWithRun {
  run: (context?: { args?: Record<string, unknown> }) => Promise<void>;
}

storyModules.forEach(({ name, stories }) =>
{
  const composed = composeStories(stories);
  const storyEntries = Object.entries(composed).filter(
    (entry): entry is [string, StoryWithRun] =>
      entry[0] !== 'default' && typeof (entry[1] as StoryWithRun).run === 'function'
  );

  describe(`Stories: ${name}`, () =>
  {
    storyEntries.forEach(([storyName, Story]) =>
    {
      it(`${name} › ${storyName}`, async () =>
      {
        await Story.run();
      });
    });
  });
});
