
// Which part of a selected item to use as the search term when a file is selected
export type SearchSource = 'auto' | 'file' | 'directory';

export interface SearchItem {
  name: string;
  url: string;
  clean: boolean;
  source?: SearchSource;
  icon?: string;
}
