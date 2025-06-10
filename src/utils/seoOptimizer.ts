import { GMBData } from '../types';

export interface SeoOptions {
  template: string;
  includeCity: boolean;
  includePostalCode: boolean;
  includeStreet: boolean;
  removeSpecial: boolean;
  capitalize: boolean;
}

const replaceToken = (
  base: string,
  token: string,
  value: string,
  include: boolean
): string => {
  if (include) {
    if (base.includes(token)) {
      return base.split(token).join(value);
    }
    return `${base} ${value}`.trim();
  }
  return base.split(token).join('');
};

const removeSpecialChars = (str: string): string =>
  str.replace(/[^\w\sÀ-ÿ-]/g, '');

const capitalizeWords = (str: string): string =>
  str
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const optimizeSeo = (
  data: GMBData[],
  options: SeoOptions
): GMBData[] => {
  return data.map((item) => {
    if (!options.template.trim()) {
      return { ...item };
    }

    let name = options.template;

    name = replaceToken(name, '{Ville}', item['Localité'] || '', options.includeCity);
    name = replaceToken(name, '{CP}', item['Code postal'] || '', options.includePostalCode);
    name = replaceToken(
      name,
      '{Adresse}',
      item["Ligne d'adresse\u00a01"] || '',
      options.includeStreet
    );

    name = name.replace(/\s+/g, ' ').trim();

    if (options.removeSpecial) {
      name = removeSpecialChars(name);
    }
    if (options.capitalize) {
      name = capitalizeWords(name);
    }

    return { ...item, "Nom de l'entreprise": name };
  });
};
