import { cleanTitle } from 'src/search-items/utils';


describe('cleanTitle', () => {
  test('strips bracketed release tags and group', () => {
    expect(cleanTitle('Alien vs Predator. Requiem [BDRip 1080p x264][GrupoHDS]'))
      .toBe('alien vs predator requiem');
  });

  test('strips parenthesized year and bracketed quality', () => {
    expect(cleanTitle('Title (2004) [1080p]')).toBe('title');
  });

  test('drops trailing "by GROUP" after the last closing bracket', () => {
    expect(cleanTitle('Ice Age. La Edad de Hielo (2002) [1080p Blu-Ray x264] by CtrlHD'))
      .toBe('ice age la edad de hielo');
  });

  test('handles scene-style dash group and year cut', () => {
    expect(cleanTitle('Some.Movie.2019.1080p.BluRay.x264-GRP')).toBe('some movie');
  });

  test('keeps the title when a spaced dash is a separator', () => {
    expect(cleanTitle('007 - El mundo nunca es suficiente (1999) [BDrip 1080p x264][DUAL esp.dts eng.dts-ma]'))
      .toBe('007 el mundo nunca es suficiente');
  });

  test('keeps an internal word dash (Spider-Man) instead of treating it as a group', () => {
    expect(cleanTitle('Spider-Man (2002) [1080p x264]')).toBe('spider-man');
  });

  test('collapses the double space left by a dotted separator', () => {
    expect(cleanTitle('Predator. Requiem')).toBe('predator requiem');
  });

  test('keeps a clean title untouched', () => {
    expect(cleanTitle('Ballerina')).toBe('ballerina');
  });
});
