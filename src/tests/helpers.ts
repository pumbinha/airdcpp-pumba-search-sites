import { ItemInfoGetter } from 'src/types';


import {
  getMenuItems,
} from 'src/search-items';

import { getMockContext, MockContextOptions } from './mock-context';
import { ContextMenuItem } from 'airdcpp-apisocket';


export const MockLogger = {
  verbose: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};

export const itemUrlParser = <IdT, EntityIdT>(
  selectedIds: IdT[],
  entityId: EntityIdT
) => {
  const parseUrls = (item: ContextMenuItem<IdT, EntityIdT>) => {
    const { urls } = item;
    if (Array.isArray(urls)) {
      return urls;
    }

    return urls!({
      selectedIds, 
      entityId, 
      permissions: ['admin'], 
      supports: ['urls']
    });
  };

  return parseUrls;
};

export const getUrls = async <IdT, EntityIdT>(
  infoGetter: ItemInfoGetter<IdT, EntityIdT>,
  itemParser: ReturnType<typeof itemUrlParser>,
  options: Partial<MockContextOptions> = {}
) => {
  const context = getMockContext(options);
  const items = getMenuItems(context, infoGetter);

  const urls = await Promise.all(items.map(itemParser));
  return urls;
};
