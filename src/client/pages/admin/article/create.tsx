import React, { FC } from 'react';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next/types';
import CreateArticle from '../../../components/Article/CreateArticle';
import AdminLayout from '../../../layouts/Admin';
import { getResource } from '../../../http/client';
import { SetSettingDto } from '../../../../server/settings/dto/set-setting.dto';

interface Props {
  aiSettings?: SetSettingDto;
  error?: Error;
}

const CreateArticlePage: FC<Props> = (props) => {
  return (
    <>
      <AdminLayout headerTitle={'poltavsky-school > article > create'}>
        <CreateArticle {...props} />
      </AdminLayout>
    </>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<Props>> {
  const { error, response } = await getResource<SetSettingDto>(
    'settings',
    context,
  );
  if (error) {
    return {
      props: {
        error: null,
      },
    };
  }
  return {
    props: { aiSettings: response },
  };
}

export default CreateArticlePage;
