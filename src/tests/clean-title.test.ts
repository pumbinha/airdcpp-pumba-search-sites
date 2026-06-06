import { cleanTitle } from 'src/search-items/utils';


describe('cleanTitle', () => {
  test('strips bracketed release tags and group', () => {
    expect(cleanTitle('Movie Alpha [BDRip 1080p x264][GroupXXXX]'))
      .toBe('movie alpha');
  });

  test('strips parenthesized year and bracketed quality', () => {
    expect(cleanTitle('Movie Beta (2004) [1080p]')).toBe('movie beta');
  });

  test('drops trailing "by GROUP" after the last closing bracket', () => {
    expect(cleanTitle('Movie. Gamma Title (2002) [1080p Blu-Ray x264] by GroupXXXX'))
      .toBe('movie gamma title');
  });

  test('strips scene tags and group but keeps the bare year', () => {
    expect(cleanTitle('Some.Movie.2019.1080p.BluRay.x264-GRP')).toBe('some movie 2019');
  });

  test('keeps a bare number that is the title (parenthesized year is dropped)', () => {
    expect(cleanTitle('2099 (2009) [BDRip 1080p x265][ES]')).toBe('2099');
  });

  test('keeps a number that is part of the title', () => {
    expect(cleanTitle('Movie Title 2049 (2017) [1080p]')).toBe('movie title 2049');
  });

  test('keeps a leading number that contains a year-like substring (20000)', () => {
    expect(cleanTitle('20000.Some.Words.Title.(1954).(Spanish.English.Subs).HD.1080p.x264-AC3.by.GroupXXXX'))
      .toBe('20000 some words title');
  });

  test('collapses the double space left by a dotted separator', () => {
    expect(cleanTitle('Foo. Bar')).toBe('foo bar');
  });

  test('keeps the title when a spaced dash is a separator', () => {
    expect(cleanTitle('123 - Some Placeholder Title (1999) [BDrip 1080p x264][DUAL esp.dts eng.dts-ma]'))
      .toBe('123 some placeholder title');
  });

  test('keeps an internal word dash instead of treating it as a group', () => {
    expect(cleanTitle('Foo-Bar (2002) [1080p x264]')).toBe('foo-bar');
  });

  test('cuts at an episode/season marker', () => {
    expect(cleanTitle('Some.Show.S02E04.1080p.x264-GRP')).toBe('some show');
  });

  test('keeps a clean title untouched', () => {
    expect(cleanTitle('Placeholder')).toBe('placeholder');
  });
});
