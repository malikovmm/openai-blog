import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, TextField } from '@mui/material';
import client from '../../../http/client';
import Card from '../../Card';
import { useSnackbar } from 'notistack';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  password: yup.string(),
});

interface CategoryInput {
  name: string;
  description?: string;
}

const CreateCategory = () => {
  const { enqueueSnackbar } = useSnackbar();
  const createCategory = (values: CategoryInput) => {
    client
      .post('category', {
        json: values,
      })
      .then(
        () => {
          enqueueSnackbar('Created', { variant: 'success' });
        },
        (e) => {
          enqueueSnackbar(e.message, { variant: 'error' });
          console.log(e);
        },
      );
  };
  const formik = useFormik<CategoryInput>({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      createCategory(values);
    },
  });

  return (
    <Card>
      <h3>Create category</h3>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="name"
          name="name"
          label="Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          fullWidth
          multiline
          rows={4}
          id="description"
          name="description"
          label="Description"
          value={formik.values.description}
          onChange={formik.handleChange}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
          sx={{ marginTop: 1 }}
        />

        <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          sx={{ marginTop: 1 }}
        >
          Create
        </Button>
      </form>
    </Card>
  );
};

export default CreateCategory;
