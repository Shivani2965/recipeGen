import React from 'react';
import { RecipeCard } from './RecipeCard.tsx';
import { RecipeCardSkeleton } from './LoadingSpinner.tsx';
import { EmptyState } from './EmptyState.tsx';

interface RecipeGridProps {
  recipes: any[];
  loading?: boolean;
  skeletonCount?: number;
  emptyType?: 'search' | 'favorites' | 'saved' | 'history' | 'generic';
  emptyTitle?: string;
  emptyDescription?: string;
  onEmptyAction?: () => void;
  emptyActionText?: string;
}

export const RecipeGrid: React.FC<RecipeGridProps> = ({
  recipes,
  loading = false,
  skeletonCount = 8,
  emptyType = 'search',
  emptyTitle,
  emptyDescription,
  onEmptyAction,
  emptyActionText,
}) => {
  if (loading) {
    return (
      <div
        id="recipes-grid-loading"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <RecipeCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <EmptyState
        type={emptyType}
        title={emptyTitle}
        description={emptyDescription}
        onAction={onEmptyAction}
        actionText={emptyActionText}
      />
    );
  }

  return (
    <div
      id="recipes-grid-container"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
    >
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id || recipe.recipeId} recipe={recipe} />
      ))}
    </div>
  );
};
