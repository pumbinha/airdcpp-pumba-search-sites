import { Context } from './context';
import { SearchSource } from './search-item';

export type ItemInfoGetter<IdT, EntityIdT> = (
  context: Context,
  selectedIds: IdT[],
  entityId: EntityIdT,
  source: SearchSource,
) => Promise<string[]>;
