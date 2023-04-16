import React, { FC } from 'react';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next/types';
import { Category } from '../../../../server/category/entities/category.entity';
import { getResource } from '../../../http/client';
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
  try {
    const props = await getResource<Props>('category', context);
    return {
      props,
    };
  } catch (e) {
    return { props: { error: e } };
  }
}

export default CategoryPage;
