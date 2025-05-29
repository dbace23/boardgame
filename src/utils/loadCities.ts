import citiesRaw from './indonesia_cities.csv?raw';

export const INDONESIAN_CITIES: string[] = citiesRaw
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line.length > 0)
  .map((line, index) => {
    const parts = line.split(',');
    return index === 0 ? null : parts[1]?.trim(); // Skip header, return 2nd column
  })
  .filter((city): city is string => Boolean(city));
