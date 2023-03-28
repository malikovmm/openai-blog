import React from 'react';

import AdminLayout from '../../../layouts/Admin';
import { getResourceById } from '../../../http/client';
import { Category } from '../../../../server/category/entities/category.entity';
import EditCategory from '../../../components/Category/EditCategory';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next/types';

interface Props {
  category?: Category;
  error?: Error;
  id?: string;
}

export default function EditCategoryPage(props: Props) {
  return (
    <>
      <AdminLayout headerTitle={'poltavsky-school > category > edit'}>
        <EditCategory {...props} />
      </AdminLayout>
    </>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<Props>> {
  const { error, response } = await getResourceById<Props>('category', context);
  if (error) {
    return {
      props: {
        error: null,
      },
    };
  }
  return {
    props: { category: response, id: context.params.id as string },
  };
}
