import { Grid, Slider, TextField } from '@mui/material';
import React from 'react';
import { useFormik } from 'formik';

interface Props<T> {
  formik: ReturnType<typeof useFormik<T>>;
  valueName: string;
  min: number;
  max: number;
  label: string;
}

function SliderNumber<T>(props: Props<T>) {
  return (
    <Grid container spacing={2} justifyContent={'space-between'}>
      <Grid item xs={10}>
        <Slider
          value={props.formik.values[props.valueName]}
          onChange={(_e, value) => {
            props.formik.setFieldValue(props.valueName, value);
          }}
          valueLabelDisplay="auto"
          min={props.min}
          sx={{ mt: 1.5 }}
          max={props.max}
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          type={'number'}
          id={props.valueName}
          name={props.valueName}
          label={props.label}
          value={props.formik.values[props.valueName]}
          onChange={props.formik.handleChange}
          error={
            props.formik.touched[props.valueName] &&
            Boolean(props.formik.errors[props.valueName])
          }
          helperText={
            props.formik.touched[props.valueName] &&
            props.formik.errors[props.valueName]
          }
          sx={{ mb: 1 }}
        />
      </Grid>
    </Grid>
  );
}

export default SliderNumber;
