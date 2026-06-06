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

  test('strips scene tags and group but keeps the bare year', () => {
    expect(cleanTitle('Some.Movie.2019.1080p.BluRay.x264-GRP')).toBe('some movie 2019');
  });

  test('keeps a bare year that is the title (parenthesized year is dropped)', () => {
    expect(cleanTitle('2012 (2009) [BDRip 1080p x265][ES]')).toBe('2012');
  });

  test('keeps a year that is part of the title', () => {
    expect(cleanTitle('Blade Runner 2049 (2017) [1080p]')).toBe('blade runner 2049');
  });

  test('cuts at an episode/season marker', () => {
    expect(cleanTitle('Some.Show.S02E04.1080p.x264-GRP')).toBe('some show');
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
