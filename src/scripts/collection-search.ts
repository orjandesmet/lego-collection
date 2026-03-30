function filterItems(query: string): void {
  const normalizedQuery = query.toLowerCase().trim();

  document
    .querySelectorAll<HTMLElement>('[data-search-grid]')
    .forEach((grid) => {
      let visibleCount = 0;

      grid
        .querySelectorAll<HTMLElement>('article[data-search-text]')
        .forEach((article) => {
          const text = article.dataset.searchText ?? '';
          const matches = !normalizedQuery || text.includes(normalizedQuery);
          const li = article.closest<HTMLLIElement>(
            'li:not([data-search-empty])'
          );
          if (li) {
            li.hidden = !matches;
            if (matches) visibleCount++;
          }
        });

      const emptyState = grid.querySelector<HTMLElement>('[data-search-empty]');
      if (emptyState) emptyState.hidden = visibleCount > 0;

      const section = grid.closest<HTMLElement>('[data-search-section]');
      if (section) section.hidden = visibleCount === 0;
    });
}

export function initCollectionSearch(inputSelector: string): void {
  const input = document.querySelector<HTMLInputElement>(inputSelector);
  if (!input) return;

  // Initial filter to set the correct state on page load
  filterItems(input.value);

  input.addEventListener('input', () => {
    filterItems(input.value);
  });
}
