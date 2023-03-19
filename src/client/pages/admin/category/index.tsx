import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import usePagination from '../../../hooks/usePagination';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next/types';
import ky, { KyResponse } from 'ky';
import StickyHeadTable from '../../../components/Table/Table';
import { Category } from '../../../../server/category/entities/category.entity';
import { getPaginatedResource } from '../../../http/client';
import AdminLayout from '../../../layouts/Admin';

const ContainerCharts = styled.div`
  display: flex;
  gap: 5px;
  width: 100%;
`;
const ContainerTable = styled.div`
  margin-top: 5px;
  display: flex;
  width: 100%;
`;

const Label = styled.div`
  display: flex;
  font-size: 18px;
  gap: 5px;
  padding-top: 15px;
  padding-left: 15px;
`;
const TitleLabel = styled.div`
  display: flex;
  gap: 5px;
`;

interface Props {
  categories?: Category[];
  total?: number;
  error?: any;
}

const Category: FC<Props> = (props) => {
  const { onPageChange, onLimitChange, page, limit } = usePagination({
    pageQueryName: 'page',
    limitQueryName: 'take',
  });
  return (
    <AdminLayout headerTitle={'poltavsky-school > category'}>
      <StickyHeadTable
        rows={props.categories}
        rowsTotal={props.total}
        onRowClick={(row: any) => {
          console.log(row);
        }}
        title={
          <TitleLabel>
            <span>Source data</span>{' '}
          </TitleLabel>
        }
        columns={[
          { id: 'id', label: 'Id', minWidth: 170 },
          { id: 'name', label: 'Name', minWidth: 170 },
          { id: 'created_at', label: 'Created at', minWidth: 170 },
          { id: 'updatedAt', label: 'Updated At', minWidth: 170 },
        ]}
        onPageChange={onPageChange}
        setLimit={onLimitChange}
        page={~~page}
        limit={~~limit}
      />
    </AdminLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<Props>> {
  const { error, response } = await getPaginatedResource<Props>(
    'category',
    context.query,
  );
  if (error) {
    return {
      props: {
        error: null,
      },
    };
  }
  return {
    props: response,
  };
}

export default Category;
