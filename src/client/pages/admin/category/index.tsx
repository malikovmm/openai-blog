import React, { FC } from 'react';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next/types';
import { Category } from '../../../../server/category/entities/category.entity';
import { getPaginatedResource } from '../../../http/client';
import AdminLayout from '../../../layouts/Admin';
import CategoryView from '../../../components/Category/CategoryView';

interface Props {
  categories?: Category[];
  total?: number;
  error?: any;
}

const CategoryPage: FC<Props> = (props) => {
  return (
    <AdminLayout headerTitle={'poltavsky-school > category'}>
      <CategoryView {...props} />
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

export default CategoryPage;
