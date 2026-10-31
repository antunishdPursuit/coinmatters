import images, { findItemImage } from './listImages';
import navLogo from '../../Images/navLogo.png';

const photo = (name) => images.find((image) => image.name === name).image;

test('finds the photo for a list item', () => {
  expect(findItemImage('cheese')).toBe(photo('cheese'));
  expect(findItemImage('Mac & Cheese')).toBe(photo('mac & cheese'));
  expect(findItemImage('whole milk')).toBe(photo('milk'));
  expect(findItemImage('egg')).toBe(photo('eggs'));
  expect(findItemImage('straw')).toBe(photo('strawberries'));
});

test('uses the logo for items without a photo', () => {
  expect(findItemImage('a')).toBe(navLogo);
  expect(findItemImage('kale')).toBe(navLogo);
});
