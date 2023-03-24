import { useEffect, useState } from 'react';
import useChainableRouter from './useChainableRouter';

export default function useQueryFilterFilter(queryName: string) {
  const [filter, setFilter] = useState(null);
  const cRouter = useChainableRouter();
  useEffect(() => {
    if (filter === null) return;
    cRouter
      .create()
      .addQuery({ [queryName]: filter })
      .push();
  }, [filter]);
  return [filter, setFilter];
}
