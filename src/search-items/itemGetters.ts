import { parseMagnetLink } from './magnet';
import { FileItemType, ItemInfoGetter, MessageHighlight, MessageHighlightType, SearchSource } from '../types';
import { ADC_PATH_SEPARATOR, getDirectoryPathName, getFilePath, getFileName, getLastDirectory, isJunkName } from './utils';


const parseHighlightText = (highlight: MessageHighlight) => {
  switch (highlight.type) {
    case MessageHighlightType.LINK_TEXT: {
      return highlight.text;
    }
    case MessageHighlightType.LINK_URL: {
      if (highlight.text.startsWith('magnet:?')) {
        const magnet = parseMagnetLink(highlight.text);
        if (magnet?.name) {
          return magnet.name;
        }
      }
    }
  }

  return highlight.text;
};

// For files: prefer the file name, but fall back to the parent directory when
// the file (or the subfolder it sits in) carries no meaningful title.
// This keeps scene releases (e.g. <release>/Sample/sample.mkv) searchable by
// the release directory while still using the file name for loose files.
const parseAutoFileName = (path: string, separator: string) => {
  const fileName = getFileName(path);
  const directoryPath = getFilePath(path);
  if (isJunkName(getLastDirectory(directoryPath)) || isJunkName(fileName)) {
    return getDirectoryPathName(directoryPath, separator);
  }

  return fileName;
};

// Parse the search term from an item path according to the configured source
const parseItemName = (path: string, type: FileItemType, source: SearchSource, separator = ADC_PATH_SEPARATOR) => {
  // Directories never carry a file name to use
  if (type.id === 'directory') {
    return getDirectoryPathName(path, separator);
  }

  switch (source) {
    case 'file':
      return getFileName(path);
    case 'directory':
      return getDirectoryPathName(getFilePath(path), separator);
    case 'auto':
    default:
      return parseAutoFileName(path, separator);
  }
};

export const HubMessageHighlightItemGetter: ItemInfoGetter<number, number> = async ({ api }, selectedIds, entityId) => {
  const results = await Promise.all(selectedIds.map(id => api.getHubMessageHighlights(id, entityId)));
  return results.map(parseHighlightText);
};

export const PrivateChatMessageHighlightItemGetter: ItemInfoGetter<number, string> = async ({ api }, selectedIds, entityId) => {
  const results = await Promise.all(selectedIds.map(id => api.getPrivateChatMessageHighlights(id, entityId)));
  return results.map(parseHighlightText);
};

export const QueueBundleItemGetter: ItemInfoGetter<number, string> = async ({ api, sessionInfo }, selectedIds, entityId, source) => {
  const results = await Promise.all(selectedIds.map(id => api.getBundle(id)));
  return results.map(result => parseItemName(result.target, result.type, source, sessionInfo.system_info.path_separator));
};

export const FilelistItemGetter: ItemInfoGetter<number, string> = async ({ api }, selectedIds, entityId, source) => {
  const results = await Promise.all(selectedIds.map(id => api.getFilelistItem(id, entityId)));
  return results.map(result => parseItemName(result.path, result.type, source, ADC_PATH_SEPARATOR));
};

export const SearchItemGetter: ItemInfoGetter<string, number> = async ({ api }, selectedIds, entityId, source) => {
  const results = await Promise.all(selectedIds.map(id => api.getGroupedSearchResult(id, entityId)));
  return results.map(result => parseItemName(result.path, result.type, source, ADC_PATH_SEPARATOR));
};
