import React from 'react';

import AdminLayout from '../../../layouts/Admin';
import { getResourceById } from '../../../http/client';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next/types';
import EditArticle from '../../../components/Article/EditArticle';
import { EditArticleDto } from '../../../../server/article/dto/edit-article.dto';
import { Article } from '../../../../server/article/entities/article.entity';
import { convertArticleToEditDto } from '../../../utils/dto';

interface Props {
  article: EditArticleDto;
  id: string;
  error?: Error;
}

export default function EditArticlePage(props: Props) {
  return (
    <>
      <AdminLayout headerTitle={'poltavsky-school > category > edit'}>
        <EditArticle {...props} />
      </AdminLayout>
    </>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<Props>> {
  try {
    const article = await getResourceById<Article>('article', context);
    const articleDto = convertArticleToEditDto(article);
    return {
      props: { article: articleDto, id: context.params.id as string },
    };
  } catch (error) {
    return {
      props: {
        error,
        article: null,
        id: null,
      },
    };
  }
}
