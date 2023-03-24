import Card from '../../Card';
import { Button, TextField } from '@mui/material';
import StickyHeadTable from '../../Table/Table';
import React from 'react';
import usePagination from '../../../hooks/usePagination';
import { Category } from '../../../../server/category/entities/category.entity';
import useQueryFilterFilter from '../../../hooks/useQueryFilterFilter';
import { TableTitle } from '../../Table/styles';
import useChainableRouter from '../../../hooks/useChainableRouter';
import NavTitle from '../../NavTitle';

interface Props {
  categories?: Category[];
  total?: number;
  error?: any;
}

export default function CategoryView(props: Props) {
  const { onPageChange, onLimitChange, page, limit } = usePagination({
    pageQueryName: 'page',
    limitQueryName: 'take',
  });
  const cRouter = useChainableRouter();
  const goToCategory = (row: Category) => {
    cRouter
      .create()
      .setPath(`category/${row.id.toString()}`)
      .setQuery({})
      .push();
  };
  const goToCategoryCreate = () => {
    cRouter.create().setPath('category/create').setQuery({}).push();
  };
  const [nameFilter, setNameFilter] = useQueryFilterFilter('nameFilter');
  return (
    <>
      <NavTitle prevLink="/admin">Categories</NavTitle>

      <Card>
        <TextField
          type={'text'}
          value={nameFilter ?? ''}
          onChange={(event) => setNameFilter(event?.target?.value)}
          placeholder={'Search by name field'}
          fullWidth
        />
      </Card>
      <StickyHeadTable
        rows={props.categories}
        rowsTotal={props.total}
        onRowClick={goToCategory}
        title={
          <TableTitle>
            <span>Available categories</span>{' '}
            <Button variant="outlined" onClick={goToCategoryCreate}>
              Create
            </Button>
          </TableTitle>
        }
        columns={[
          { id: 'id', label: 'Id', minWidth: 170 },
          { id: 'name', label: 'Name', minWidth: 170 },
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
