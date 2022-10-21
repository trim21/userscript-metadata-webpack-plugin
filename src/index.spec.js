const { generateMetadataBlock } = require('./index');
const { describe, test, expect } = require('@jest/globals');

describe('generate metadata block', function () {
  test('string value', function () {
    expect(generateMetadataBlock({ name: 's' })).toBe(
      ['// ==UserScript==', '// @name   s', '// ==/UserScript=='].join('\n'),
    );
  });

  test('array value', function () {
    expect(
      generateMetadataBlock({
        require: ['1', '2'],
      }),
    ).toBe(['// ==UserScript==', '// @require   1', '// @require   2', '// ==/UserScript=='].join('\n'));
  });

  test('object value', function () {
    expect(
      generateMetadataBlock({
        resource: {
          A: 'https://resource.a',
          BB: 'https://resource.b',
        },
      }),
    ).toBe(
      [
        '// ==UserScript==',
        '// @resource   A  https://resource.a',
        '// @resource   BB https://resource.b',
        '// ==/UserScript==',
      ].join('\n'),
    );
  });

  test('auth only name', function () {
    expect(generateMetadataBlock({ author: { name: 'trim21' } })).toBe(
      ['// ==UserScript==', '// @author   trim21', '// ==/UserScript=='].join('\n'),
    );
  });

  test('auth with email', function () {
    expect(
      generateMetadataBlock({
        author: { name: 'trim21', email: 'trim21.me@gmail.com' },
      }),
    ).toBe(['// ==UserScript==', '// @author   trim21 <trim21.me@gmail.com>', '// ==/UserScript=='].join('\n'));
  });

  test('auth undefined', function () {
    expect(generateMetadataBlock({ author: undefined })).toBe(['// ==UserScript==', '// ==/UserScript=='].join('\n'));
  });
});
