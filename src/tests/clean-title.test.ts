import { cleanTitle } from 'src/search-items/utils';


describe('cleanTitle', () => {
  test('strips bracketed release tags and group', () => {
    expect(cleanTitle('Alien vs Predator. Requiem [BDRip 1080p x264][GrupoHDS]'))
      .toBe('alien vs predator requiem');
  });

  test('strips parenthesized year and bracketed quality', () => {
    expect(cleanTitle('Title (2004) [1080p]')).toBe('title');
  });

  test('handles scene-style dash group and year cut', () => {
    expect(cleanTitle('Some.Movie.2019.1080p.BluRay.x264-GRP')).toBe('some movie');
  });

  test('collapses the double space left by a dotted separator', () => {
    expect(cleanTitle('Predator. Requiem')).toBe('predator requiem');
  });

  test('keeps a clean title untouched', () => {
    expect(cleanTitle('Ballerina')).toBe('ballerina');
  });
});
