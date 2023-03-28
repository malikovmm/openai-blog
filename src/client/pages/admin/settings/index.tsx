import React from 'react';
import AdminSettings from '../../../components/Settings';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next/types';
import { doGet, getResource } from '../../../http/client';
import { SetSettingDto } from '../../../../server/settings/dto/set-setting.dto';
import { Model } from 'openai';
import AdminLayout from '../../../layouts/Admin';

interface OpenAIRequestFormProps {
  initialValues?: SetSettingDto;
  availableModels?: Model[];
  defaultValues?: SetSettingDto;
  errors?: Error[];
}

const SettingsPage = (props: OpenAIRequestFormProps) => {
  return (
    <AdminLayout headerTitle="poltavsky-school > settings">
      <AdminSettings {...props} />
    </AdminLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<OpenAIRequestFormProps>> {
  const { error: userSettingsError, response: settingsResponse } =
    await getResource<OpenAIRequestFormProps>('settings', context);
  const { error: defaultError, response: defaultResponse } = await doGet(
    'settings/default',
    context,
  );
  if (userSettingsError || defaultError) {
    return {
      props: {
        errors: [userSettingsError, defaultError],
      },
    };
  }
  return {
    props: {
      initialValues: settingsResponse,
      defaultValues: defaultResponse,
    },
  };
}

export default SettingsPage;
