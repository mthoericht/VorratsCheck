export type WishlistPriority = 'low' | 'medium' | 'high';

export function getPriorityColor(priority: WishlistPriority): string 
{
  switch (priority) 
  {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
  }
}

export function getPriorityLabel(priority: WishlistPriority): string 
{
  switch (priority) 
  {
    case 'high':
      return 'Hoch';
    case 'medium':
      return 'Mittel';
    case 'low':
      return 'Niedrig';
  }
}
