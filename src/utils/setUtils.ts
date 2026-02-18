import { type CollectionEntry } from 'astro:content';

type LegoTheme = CollectionEntry<'themes'>;
type LegoSetData = CollectionEntry<'sets' | 'minifigs'>['data'];

function getSetNumberAndVariant(legoSetData: LegoSetData) {
  const [setNumber, variant] = legoSetData.setNumber.split('-');
  return { setNumber, variant };
}

function getTaxonomy(themes: LegoTheme[]) {
  return function (legoSetData: LegoSetData) {
    return legoSetData.themes
      .map((theme) => themes.find((t) => t.id === theme.id)?.data.name)
      .join(' - ');
  };
}

function stringifyBuildTime(set: LegoSetData): string {
  const totalTimeSpent = set.totalTimeSpent;
  if (!totalTimeSpent) {
    return '';
  }
  let buildTime = `${totalTimeSpent.minutes}m`;
  if (totalTimeSpent.hours) {
    buildTime = `${totalTimeSpent.hours}h ${buildTime}`;
  }
  return buildTime;
}

function isPromotionalSet(legoSetData: LegoSetData) {
  return legoSetData.themes.some((theme) => theme.id === '598');
}

export const setUtils = {
  getSetNumberAndVariant,
  getTaxonomy,
  stringifyBuildTime,
  isPromotionalSet,
};
