import React from 'react';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next/types';
import { getResource } from '../../../http/client';
import AdminLayout from '../../../layouts/Admin';
import ArticleView from '../../../components/Article/ArticleView';
import { Article } from '../../../../server/article/entities/article.entity';

interface Props {
  articles?: Article[];
  total?: number;
  error?: any;
}

const ArticlePage = (props: Props) => {
  return (
    <AdminLayout headerTitle={'poltavsky-school > article'}>
      <ArticleView {...props} />
    </AdminLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<Props>> {
  try {
    const props = await getResource<Props>('article', context);
    return {
      props,
    };
  } catch (e) {
    return { props: { error: e } };
  }
}

export default ArticlePage;
