import React from 'react';
import { useFormik } from 'formik';
import { CreateArticleDto } from '../../../../server/article/dto/create-article.dto';
import { Button, TextField } from '@mui/material';
import ArticleBlocksFields from '../CreateArticleBlock';
import { EditArticleDto } from '../../../../server/article/dto/edit-article.dto';

interface ArticleFormProps {
  formik: ReturnType<typeof useFormik<EditArticleDto | CreateArticleDto>>;
  simpleFields?: boolean;
}

const ArticleForm = ({ formik, simpleFields = false }: ArticleFormProps) => {
  return (
    <>
      <TextField
        fullWidth
        id="title"
        name="title"
        label="Title"
        value={formik.values.title}
        onChange={formik.handleChange}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
        sx={{ mb: 1 }}
      />
      <ArticleBlocksFields formik={formik} simpleFields={simpleFields} />
      <Button
        color="primary"
        variant="contained"
        fullWidth
        type="submit"
        sx={{ marginTop: 1 }}
      >
        Create
      </Button>
    </>
  );
};

export default ArticleForm;
