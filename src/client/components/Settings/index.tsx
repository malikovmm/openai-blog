import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, TextField } from '@mui/material';
import { SetSettingDto } from '../../../server/settings/dto/set-setting.dto';
import Card from '../Card';
import SliderNumber from '../SliderNumber';
import SelectField from '../Select';
import { Model } from 'openai';
import { DialogContext } from '../../hooks/useDialog';
import useResource from '../../hooks/useResource';
import NavTitle from '../NavTitle';
import { ButtonsContainer, CardContainer } from './style';

const validationSchema = Yup.object().shape({
  max_tokens: Yup.number()
    .min(1, 'Must be greater than or equal to 1')
    .max(4000, 'Must be less than or equal to 4000'),
  model: Yup.string().required('Model is required'),
  stop: Yup.array()
    .max(4, 'Max number of stop sequences is 4')
    .of(Yup.string()),
  suffix: Yup.string(),
  temperature: Yup.number()
    .min(0, 'Must be greater than or equal to 0')
    .max(2, 'Must be less than or equal to 2'),
});

interface OpenAIRequestFormProps {
  initialValues?: SetSettingDto;
  defaultValues?: SetSettingDto;
  availableModels?: Model[];
}

const OpenAIRequestForm: React.FC<OpenAIRequestFormProps> = ({
  initialValues,
  availableModels,
  defaultValues,
}) => {
  const { createResource: saveResource } =
    useResource<SetSettingDto>('settings');
  const formik = useFormik<SetSettingDto>({
    initialValues: {
      max_tokens: initialValues.max_tokens,
      model: initialValues.model,
      stop: initialValues.stop || [],
      suffix: initialValues.suffix,
      temperature: initialValues.temperature,
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      saveResource(values, 'Saved').finally(() => setSubmitting(false));
    },
  });

  function handleStopSequences(e: React.ChangeEvent<any>) {
    const strVal = e.target.value;
    const splited = strVal.split('\n');
    formik.setFieldValue('stop', splited);
  }

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
            <TextField
              fullWidth
              id="stop"
              name="stop"
              label="Stop words"
              multiline
              maxRows={4}
              placeholder={'Enter up to 4 stop sequences separated by lines'}
              value={formik.values.stop.join('\n')}
              onChange={handleStopSequences}
              error={formik.touched.stop && Boolean(formik.errors.stop)}
              helperText={formik.touched.stop && formik.errors.stop}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              id="suffix"
              name="suffix"
              label="Suffix"
              value={formik.values.suffix}
              onChange={formik.handleChange}
              error={formik.touched.suffix && Boolean(formik.errors.suffix)}
              helperText={formik.touched.suffix && formik.errors.suffix}
              sx={{ mb: 1 }}
            />
            <SliderNumber
              formik={formik}
              valueName={'max_tokens'}
              label={'Max tokens'}
              min={1}
              max={4000}
            />
            <SliderNumber
              formik={formik}
              valueName={'temperature'}
              label={'Temperature'}
              min={0}
              max={2}
            />
            <SelectField
              formik={formik}
              valueName={'model'}
              options={availableModels}
              optionLabelName={'id'}
              optionValueLName={'id'}
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
