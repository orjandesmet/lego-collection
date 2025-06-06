import type { CollectionEntry } from 'astro:content';

type LegoSet = CollectionEntry<'sets' | 'minifigures'>;

function scoreThemes(baseSet: LegoSet, themeIds: string[]) {
  return baseSet.data.themes
    .map((theme) => themeIds.indexOf(theme.id))
    .filter((themeScore) => themeScore !== -1)
    .reduce((total, current) => total + Math.pow(2, -current), 0);
}

export const legoSetUtil = {
  populateOtherSets: (
    baseSet: LegoSet,
    array: LegoSet[],
    max = Number.MAX_SAFE_INTEGER
  ) => {
    const baseSetThemes = baseSet.data.themes.map(({ id }) => id);
    const sets = array
      .map((set) => ({
        set,
        score: scoreThemes(set, baseSetThemes),
        wishlistScore: set.data.wishlist ? 10 : 0,
      }))
      .filter(({ set, score }) => score !== 0 && set.id !== baseSet.id)
      .sort((a, b) => {
        const variantA = Number(a.set.id.split('-')[1] || '');
        const variantB = Number(b.set.id.split('-')[1] || '');
        return (
          b.score -
          a.score +
          (b.wishlistScore - a.wishlistScore) +
          (variantA - variantB) * 0.01
        );
      })
      .map(({ set }) => set);
    if (sets.length) {
      return sets.slice(0, max);
    }
    return [];
  },
};
