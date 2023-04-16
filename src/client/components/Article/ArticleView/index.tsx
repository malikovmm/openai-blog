import { Button } from '@mui/material';
import StickyHeadTable from '../../Table/Table';
import React from 'react';
import usePagination from '../../../hooks/usePagination';
import { TableTitle } from '../../Table/styles';
import useChainableRouter from '../../../hooks/useChainableRouter';
import NavTitle from '../../NavTitle';
import { Article } from '../../../../server/article/entities/article.entity';

interface Props {
  articles?: Article[];
  total?: number;
}

export default function ArticleView(props: Props) {
  const { onPageChange, onLimitChange, page, limit } = usePagination({
    pageQueryName: 'page',
    limitQueryName: 'take',
  });
  const cRouter = useChainableRouter();
  const goToArticle = (row: Article) => {
    cRouter
      .create()
      .setPath(`article/${row.id.toString()}`)
      .setQuery({})
      .push();
  };
  const goToArticleCreate = () => {
    cRouter.create().setPath('article/create').setQuery({}).push();
  };
  return (
    <>
      <NavTitle prevLink="/admin">Articles</NavTitle>

      <StickyHeadTable
        rows={props.articles}
        rowsTotal={props.total}
        onRowClick={goToArticle}
        title={
          <TableTitle>
            <span>Articles table</span>{' '}
            <Button variant="outlined" onClick={goToArticleCreate}>
              Create
            </Button>
          </TableTitle>
        }
        columns={[
          { id: 'id', label: 'Id', minWidth: 170 },
          { id: 'title', label: 'title', minWidth: 170 },
          { id: 'created_at', label: 'Created at', minWidth: 170 },
          { id: 'updated_at', label: 'Updated At', minWidth: 170 },
        ]}
        onPageChange={onPageChange}
        setLimit={onLimitChange}
        page={~~page}
        limit={~~limit}
      />
    </>
  );
}
