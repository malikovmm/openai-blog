import { useRouter } from 'next/router';

interface InitData {
  pageQueryName: string;
  limitQueryName: string;
}

export default function usePagination(initData: InitData) {
  const router = useRouter();
  const onPageChange = (nextPage) => {
    if (!router.isReady) return;
    router.query[initData.pageQueryName] = nextPage + 1;
    router.push(
      {
        pathname: router.pathname,
        query: router.query,
      },
      null,
      {
        unstable_skipClientCache: true,
      },
    );
  };
  const onLimitChange = (nextLimit) => {
    if (!router.isReady) return;
    router.query[initData.limitQueryName] = nextLimit.toString();
    router.push(
      {
        pathname: router.pathname,
        query: router.query,
      },
      null,
      {
        unstable_skipClientCache: true,
      },
    );
  };
  return {
    onPageChange,
    onLimitChange,
    page: router.query[initData.pageQueryName],
    limit: router.query[initData.limitQueryName],
  };
}
