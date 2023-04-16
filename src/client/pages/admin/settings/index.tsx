import React from 'react';
import AdminSettings from '../../../components/Settings';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next/types';
import { getResource } from '../../../http/client';
import AdminLayout from '../../../layouts/Admin';
import { Settings } from '../../../../server/settings/entities/setting.entity';

interface OpenAIRequestFormProps {
  initialValues?: Settings;
  defaultValues?: Settings;
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
  try {
    const initialValues = await getResource<Settings>('settings', context);
    const defaultValues = await getResource<Settings>(
      'settings/default',
      context,
    );
    return {
      props: {
        defaultValues,
        initialValues,
      },
    };
  } catch (e) {
    return {
      props: {
        errors: [e],
        defaultValues: null,
        initialValues: null,
      },
    };
  }
}

export default SettingsPage;
