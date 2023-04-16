import React, { useContext } from 'react';
import { useFormik } from 'formik';
import Card from '../Card';
import useResource from '../../hooks/useResource';
import NavTitle from '../NavTitle';
import { ButtonsContainer, CardContainer } from './style';
import SettingsFormElements from './SettingsFormElements';
import { Button } from '@mui/material';
import { DialogContext } from '../../hooks/useDialog';
import { settingsValidationSchema } from '../../utils/validation';
import { Settings } from '../../../server/settings/entities/setting.entity';

interface OpenAIRequestFormProps {
  initialValues?: Settings;
  defaultValues?: Settings;
}

const OpenAIRequestForm: React.FC<OpenAIRequestFormProps> = ({
  initialValues,
  defaultValues,
}) => {
  const { createResource: saveResource } = useResource<Settings>('settings');
  const formik = useFormik<Omit<Settings, 'id'>>({
    initialValues: {
      max_tokens: initialValues.max_tokens,
      model: initialValues.model,
      stop: initialValues.stop || [],
      suffix: initialValues.suffix,
      temperature: initialValues.temperature,
    },
    validationSchema: settingsValidationSchema,
    onSubmit: (values, { setSubmitting }) => {
      saveResource(values, 'Saved').finally(() => setSubmitting(false));
    },
  });

  function setDefault() {
    formik.setValues(defaultValues);
    return formik.submitForm();
  }

  const { dialogData, setDialogData } = useContext(DialogContext);
  const openResetDialog = () => {
    setDialogData({
      ...dialogData,
      contentData: {
        title: 'Are you sure, you want to set default settings?',
        agreeButton: 'yes',
        disagreeButton: 'cancel',
        description: 'Press "yes", if you sure',
      },
      isDialogOpen: true,
      onConfirm: async () => {
        await setDefault();
      },
    });
  };
  return (
    <>
      <NavTitle prevLink="/admin">Settings</NavTitle>
      <CardContainer>
        <Card>
          <form onSubmit={formik.handleSubmit}>
            <SettingsFormElements
              formik={formik}
              defaultValues={defaultValues}
            />
            <ButtonsContainer>
              <Button
                disabled={formik.isSubmitting}
                type="button"
                variant="outlined"
                onClick={openResetDialog}
              >
                Set default
              </Button>
              <Button
                disabled={formik.isSubmitting}
                type="submit"
                variant="contained"
              >
                Submit settings
              </Button>
            </ButtonsContainer>
          </form>
        </Card>
      </CardContainer>
    </>
  );
};

export default OpenAIRequestForm;
