import useChainableRouter from './useChainableRouter';

interface InitData {
  pageQueryName: string;
  limitQueryName: string;
}

export default function usePagination(initData: InitData) {
  const cRouter = useChainableRouter();
  const onPageChange = (nextPage) => {
    cRouter
      .create()
      .addQuery({ [initData.pageQueryName]: nextPage + 1 })
      .push();
  };
  const onLimitChange = (nextLimit) => {
    cRouter
      .create()
      .addQuery({ [initData.limitQueryName]: nextLimit })
      .push();
  };
  const page =
    ~~cRouter.originalRouter.query[initData.pageQueryName] > 0
      ? ~~cRouter.originalRouter.query[initData.pageQueryName] - 1
      : 0;
  const limit =
    ~~cRouter.originalRouter.query[initData.limitQueryName] > 0
      ? ~~cRouter.originalRouter.query[initData.limitQueryName]
      : 10;
  return {
    onPageChange,
    onLimitChange,
    page,
    limit,
  };
}
