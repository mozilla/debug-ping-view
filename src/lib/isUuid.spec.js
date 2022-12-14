import { isUuid } from './isUuid';

test('isUuid - proper UUID is recognized', () => {
  const input = '092cc1c0-7e3c-4483-8a91-d96601acdc30';
  const actual = isUuid(input);

  const expected = true;

  expect(actual).toEqual(expected);
});

test('isUuid - non UUID string is recognized', () => {
  const input = 'asdlkfj23-23235--234234-22';
  const actual = isUuid(input);

  const expected = false;

  expect(actual).toEqual(expected);
});
