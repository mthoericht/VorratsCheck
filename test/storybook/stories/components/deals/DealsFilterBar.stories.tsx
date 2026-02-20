import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DealsFilterBar } from '@/app/components/deals/DealsFilterBar';
import type { DealsFilterType } from '@/app/hooks/useDealsPage';

const meta: Meta<typeof DealsFilterBar> = {
  component: DealsFilterBar,
  title: 'Components/Deals/DealsFilterBar',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof DealsFilterBar>;

function FilterBarWrapper() 
{
  const [filterType, setFilterType] = useState<DealsFilterType>('all');
  return (
    <DealsFilterBar
      filterType={filterType}
      setFilterType={setFilterType}
      mustHaveCount={2}
      wishListCount={3}
    />
  );
}

export const Default: Story = {
  render: () => <FilterBarWrapper />,
};

export const AlleAusgewaehlt: Story = {
  args: {
    filterType: 'all',
    setFilterType: () => {},
    mustHaveCount: 5,
    wishListCount: 4,
  },
};

export const MustHaveAusgewaehlt: Story = {
  args: {
    filterType: 'mustHave',
    setFilterType: () => {},
    mustHaveCount: 2,
    wishListCount: 3,
  },
};

export const WunschlisteAusgewaehlt: Story = {
  args: {
    filterType: 'wishList',
    setFilterType: () => {},
    mustHaveCount: 0,
    wishListCount: 1,
  },
};
