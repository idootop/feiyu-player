import { store, useConsumer, useMemoFilter } from './useStore';

export const Consumer = (props: {
  id: string;
  filter?: (state: any) => any;
  children: (store: [any, (newData: any) => void, () => any]) => any;
}) => {
  const { id, filter, children } = props;
  const _store = useConsumer(id, filter);
  const memoFilterRef = useMemoFilter({
    filter,
    currentFilterData: () => store.get(id),
    currentData: () => children(_store),
    immediately: true,
  });
  return memoFilterRef.current.data;
};
