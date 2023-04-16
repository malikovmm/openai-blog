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
  try {
    const category = await getResourceById<Category>('category', context);
    return {
      props: { category: category, id: context.params.id as string },
    };
  } catch (error) {
    return {
      props: {
        error,
        category: null,
        id: null,
      },
    };
  }
}
