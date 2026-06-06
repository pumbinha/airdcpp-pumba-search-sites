import { SearchItemGetter } from 'src/search-items';
import { APIType } from 'src/api';
import { SearchItem, SearchSource } from 'src/types';

import { getUrls, itemUrlParser } from './helpers';


// Single search site configured with the given source strategy (no cleaning)
const siteWithSource = (source: SearchSource): SearchItem[] => [
  {
    name: `site-${source}`,
    url: 'http://site/',
    clean: false,
    source,
  },
];

// Override the grouped search result with a file at the given path
const fileResultApi = (path: string): Partial<APIType> => ({
  getGroupedSearchResult: () => Promise.resolve({
    id: 'mock-result-id',
    path,
    type: { id: 'file' as const },
  }),
});

const getFileResultUrl = async (path: string, source: SearchSource) => {
  const urls = await getUrls(
    SearchItemGetter,
    itemUrlParser(['mock-id'], 1),
    {
      api: fileResultApi(path),
      searchItems: siteWithSource(source),
    },
  );

  // One site, one selected id
  return urls[0]![0]!;
};

const LOOSE_FILE = '/movies/Ballerina [2025].mkv';
const RELEASE_SAMPLE_FILE = '/dl/Ballerina.2025.1080p.x264-GRP/Sample/grp-sample.mkv';

describe('Search term source', () => {
  describe('loose file in a generic folder', () => {
    test("'file' uses the file name without extension", async () => {
      expect(await getFileResultUrl(LOOSE_FILE, 'file'))
        .toBe(`http://site/${encodeURIComponent('Ballerina [2025]')}`);
    });

    test("'directory' uses the parent directory name", async () => {
      expect(await getFileResultUrl(LOOSE_FILE, 'directory'))
        .toBe('http://site/movies');
    });

    test("'auto' uses the file name when the folder is meaningless", async () => {
      expect(await getFileResultUrl(LOOSE_FILE, 'auto'))
        .toBe(`http://site/${encodeURIComponent('Ballerina [2025]')}`);
    });
  });

  describe('file inside a release sample subfolder', () => {
    test("'file' still uses the (junk) file name", async () => {
      expect(await getFileResultUrl(RELEASE_SAMPLE_FILE, 'file'))
        .toBe('http://site/grp-sample');
    });

    test("'auto' falls back to the release directory", async () => {
      expect(await getFileResultUrl(RELEASE_SAMPLE_FILE, 'auto'))
        .toBe('http://site/Ballerina.2025.1080p.x264-GRP');
    });
  });
});
