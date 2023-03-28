import { useFormik } from 'formik';
import { SetSettingDto } from '../../../../server/settings/dto/set-setting.dto';
import React from 'react';
import { TextField } from '@mui/material';
import SliderNumber from '../../SliderNumber';
import SelectField from '../../Select';

interface Props<T> {
  formik: ReturnType<typeof useFormik<T>>;
  defaultValues: T;
}

export default function SettingsFormElements(props: Props<SetSettingDto>) {
  function handleStopSequences(e: React.ChangeEvent<any>) {
    const strVal = e.target.value;
    const splited = strVal.split('\n');
    props.formik.setFieldValue('stop', splited);
  }

  return (
    <>
      <TextField
        fullWidth
        id="stop"
        name="stop"
        label="Stop words"
        multiline
        maxRows={4}
        placeholder={'Enter up to 4 stop sequences separated by lines'}
        value={props.formik.values.stop.join('\n')}
        onChange={handleStopSequences}
        error={props.formik.touched.stop && Boolean(props.formik.errors.stop)}
        helperText={props.formik.touched.stop && props.formik.errors.stop}
        sx={{ mb: 1 }}
      />
      <TextField
        fullWidth
        id="suffix"
        name="suffix"
        label="Suffix"
        value={props.formik.values.suffix}
        onChange={props.formik.handleChange}
        error={
          props.formik.touched.suffix && Boolean(props.formik.errors.suffix)
        }
        helperText={props.formik.touched.suffix && props.formik.errors.suffix}
        sx={{ mb: 1 }}
      />
      <SliderNumber
        formik={props.formik}
        valueName={'max_tokens'}
        label={'Max tokens'}
        min={1}
        max={4000}
      />
      <SliderNumber
        formik={props.formik}
        valueName={'temperature'}
        label={'Temperature'}
        min={0}
        max={2}
      />
      <SelectField
        disabled
        formik={props.formik}
        valueName={'model'}
        options={[{ id: props.defaultValues.model }]}
        optionLabelName={'id'}
        optionValueLName={'id'}
      />

      <SelectField
        formik={props.formik}
        valueName={'translateTo'}
        options={[
          { value: 'null', label: 'None' },
          { value: 'ru', label: 'Ru' },
        ]}
        optionLabelName={'label'}
        optionValueLName={'value'}
      />
    </>
  );
}
