import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, TextField } from '@mui/material';
import Card from '../../Card';
import { Category } from '../../../../server/category/entities/category.entity';
import useResource from '../../../hooks/useResource';
import { DialogContext } from '../../../hooks/useDialog';
import useChainableRouter from '../../../hooks/useChainableRouter';
import NavTitle from '../../NavTitle';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
});

interface Props {
  category?: Category;
  error?: Error;
  id?: string;
}

const EditCategory = (props: Props) => {
  const cRouter = useChainableRouter();
  const [category, setCategory] = useState(props.category);
  const { updateResource, deleteResource } = useResource<Category>('category');
  const formik = useFormik<Category>({
    initialValues: {
      id: category.id,
      name: category.name,
      description: category.description,
      created_at: category.created_at,
      updated_at: category.updated_at,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const updated = await updateResource(props.id, values);
      if (updated) setCategory(updated);
    },
  });
  const { dialogData, setDialogData } = useContext(DialogContext);
  const openDeleteDialog = () => {
    setDialogData({
      ...dialogData,
      contentData: {
        title: 'Are you sure, you want to delete this category?',
        agreeButton: 'yes',
        disagreeButton: 'cancel',
        description: 'Press "yes", if you sure',
      },
      isDialogOpen: true,
      onConfirm: async () => {
        await deleteResource(String(category.id));
        await cRouter
          .create()
          .setPath('/admin/category')
          .setQuery({ asd: 'dsa' })
          .push();
      },
    });
  };
  return (
    <>
      <NavTitle prevLink="/admin/category">Edit category</NavTitle>
      <Card>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            disabled
            id="id"
            name="Id"
            label="Id"
            value={formik.values.id}
            onChange={formik.handleChange}
            sx={{ marginTop: 1 }}
          />
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            sx={{ marginTop: 1 }}
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
          <TextField
            fullWidth
            disabled
            id="createdAt"
            name="createdAt"
            label="createdAt"
            value={formik.values.created_at}
            onChange={formik.handleChange}
            sx={{ marginTop: 1 }}
          />
          <TextField
            fullWidth
            disabled
            id="updatedAt"
            name="updatedAt"
            label="updatedAt"
            value={formik.values.updated_at}
            onChange={formik.handleChange}
            sx={{ marginTop: 1 }}
          />
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            sx={{ marginTop: 1 }}
          >
            Update
          </Button>
        </form>

        <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          onClick={openDeleteDialog}
          sx={{ marginTop: 1 }}
        >
          Delete
        </Button>
      </Card>
    </>
  );
};

export default EditCategory;
