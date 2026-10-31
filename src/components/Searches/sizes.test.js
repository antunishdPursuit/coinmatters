import { markSmallerSizes, parseSize } from './sizes';

test('reads the sizes the stores use', () => {
  expect(parseSize('1/2 Gallon')).toEqual({ kind: 'ounces', amount: 64 });
  expect(parseSize('64 Ounces')).toEqual({ kind: 'ounces', amount: 64 });
  expect(parseSize('48 fl Ounces')).toEqual({ kind: 'ounces', amount: 48 });
  expect(parseSize('12 x 8 Fluid Ounces')).toEqual({ kind: 'ounces', amount: 96 });
  expect(parseSize('1 Gallon')).toEqual({ kind: 'ounces', amount: 128 });
  expect(parseSize('1.25 Pounds')).toEqual({ kind: 'ounces', amount: 20 });
  expect(parseSize('3 Pounds')).toEqual({ kind: 'ounces', amount: 48 });
  expect(parseSize('35 x 16.9 Fluid Ounces').amount).toBeCloseTo(591.5);
  expect(parseSize('1/2 Dozen')).toEqual({ kind: 'count', amount: 6 });
  expect(parseSize('5.4 Ounces / 8 Count')).toEqual({ kind: 'ounces', amount: 5.4 });
  expect(parseSize('20 Slices')).toEqual({ kind: 'slices', amount: 20 });
  expect(parseSize('1 Pizza')).toEqual({ kind: 'pizzas', amount: 1 });
  expect(parseSize('Family size')).toBeNull();
  expect(parseSize(null)).toBeNull();
});

test('marks items smaller than the same item elsewhere', () => {
  const options = markSmallerSizes({
    1: [
      { name: 'eggs', size: '1/2 Dozen' },
      { name: 'milk', size: '1/2 Gallon' },
      { name: 'cheese', size: '20 Slices' },
    ],
    2: [
      { name: 'eggs', size: '1 Dozen' },
      { name: 'milk', size: '64 Ounces' },
      { name: 'cheese', size: '8 Ounces' },
    ],
    3: [
      { name: 'eggs', unavailable: true },
    ],
  });

  expect(options[1].map((option) => option.smaller)).toEqual([true, false, false]);
  expect(options[2].map((option) => option.smaller)).toEqual([false, false, false]);
  expect(options[3][0].smaller).toBeUndefined();
});
