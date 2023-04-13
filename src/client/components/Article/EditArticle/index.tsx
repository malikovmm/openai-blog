import React from 'react';
import { useFormik } from 'formik';
import { Grid } from '@mui/material';
import Card from '../../Card';
import useResource from '../../../hooks/useResource';
import 'easymde/dist/easymde.min.css';
import ArticleForm from '../Form';
import { EditArticleDto } from '../../../../server/article/dto/edit-article.dto';
import { articleValidationSchema } from '../../../utils/validation';

interface Props {
  article: EditArticleDto;
  id: string;
}

const EditArticle = (props: Props) => {
  const { updateResource } = useResource('article');
  const formik = useFormik<EditArticleDto>({
    initialValues: props.article,
    validationSchema: articleValidationSchema,
    onSubmit: async (values) => {
      const res = await updateResource(props.id, values);
      if (res instanceof Error) return;
    },
  });

  return (
    <>
      <Card>
        <Grid
          container
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <h3>Edit article</h3>
        </Grid>
        <form onSubmit={formik.handleSubmit}>
          <ArticleForm formik={formik} />
        </form>
      </Card>
    </>
  );
};

export default EditArticle;
