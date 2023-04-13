import React from 'react';
import { useFormik } from 'formik';
import { CreateArticleDto } from '../../../../server/article/dto/create-article.dto';
import { Button, TextField } from '@mui/material';
import ArticleBlocksFields from '../CreateArticleBlock';
import { EditArticleDto } from '../../../../server/article/dto/edit-article.dto';

interface ArticleFormProps {
  formik: ReturnType<typeof useFormik<EditArticleDto | CreateArticleDto>>;
}

const ArticleForm = (props: ArticleFormProps) => {
  return (
    <>
      <TextField
        fullWidth
        id="title"
        name="title"
        label="Title"
        value={props.formik.values.title}
        onChange={props.formik.handleChange}
        error={props.formik.touched.title && Boolean(props.formik.errors.title)}
        helperText={props.formik.touched.title && props.formik.errors.title}
        sx={{ mb: 1 }}
      />
      <ArticleBlocksFields formik={props.formik} />
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
