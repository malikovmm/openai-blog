import React, { FC } from 'react';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next/types';
import ky from 'ky';
import AdminLayout from '../../../layouts/Admin';
import CreateCategory from '../../../components/Category/CreateCategory';

const CreateCategoryPage: FC<any> = (props) => {
  return (
    <>
      <AdminLayout headerTitle={'poltavsky-school > category > create'}>
        <CreateCategory />
      </AdminLayout>
    </>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> {
  const a = await ky.get('http://localhost:3005/article/test').text();
  return {
    props: {},
  };
  // const response = await fetch(apiRequestURL);
}

export default CreateCategoryPage;
