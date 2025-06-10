export const removeAccents = (str: string): string =>
  str.normalize('NFD').replace(/\p{Diacritic}/gu, '');

export const removeAccentsFromData = <T extends Record<string, unknown>>(data: T[]): T[] =>
  data.map(item => {
    const cleanItem: Record<string, unknown> = {};
    Object.keys(item).forEach(key => {
      const value = item[key];
      cleanItem[key] = typeof value === 'string' ? removeAccents(value) : value;
    });
    return cleanItem as T;
  });
