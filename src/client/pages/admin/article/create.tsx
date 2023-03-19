import React, { FC } from 'react';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next/types';
import ky from 'ky';
import CreateArticle from '../../../components/Article/CreateArticle';
import AdminLayout from '../../../layouts/Admin';

const CreateArticlePage: FC<any> = (props) => {
  return (
    <>
      <AdminLayout>
        <CreateArticle />
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

export default CreateArticlePage;
