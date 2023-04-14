import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Button, Grid } from '@mui/material';
import Card from '../../Card';
import useResource from '../../../hooks/useResource';
import 'easymde/dist/easymde.min.css';
import { CreateArticleDto } from '../../../../server/article/dto/create-article.dto';
import ArticleForm from '../Form';
import { articleValidationSchema } from '../../../utils/validation';

const CreateArticle = () => {
  const [useAi, setUseAi] = useState(false);
  const { createResource } = useResource(useAi ? 'article/ai' : 'article');
  const formik = useFormik<CreateArticleDto>({
    initialValues: {
      title: '',
      blocks: [
        {
          pictureLocation: 0,
          picture: '',
          content: '',
          title: '',
        },
      ],
    },
    validationSchema: articleValidationSchema,
    onSubmit: async (values) => {
      const res = await createResource(values);
      if (res instanceof Error) return;
    },
  });
  const toggleAiField = () => setUseAi(!useAi);

  return (
    <>
      <Card>
        <Grid
          container
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <h3>{useAi ? 'Schedule article ai creation' : 'Create article'}</h3>
          <Button variant={'outlined'} onClick={toggleAiField}>
            {useAi ? 'Create article manual' : 'Use ai'}
          </Button>
        </Grid>
        <form onSubmit={formik.handleSubmit}>
          <ArticleForm formik={formik} simpleFields={useAi} />
        </form>
      </Card>
    </>
  );
};

export default CreateArticle;
