import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, Grid, TextField } from '@mui/material';
import Card from '../../Card';
import useResource from '../../../hooks/useResource';
import 'easymde/dist/easymde.min.css';
import ReactMarkdown from 'react-markdown';
import useChainableRouter from '../../../hooks/useChainableRouter';
import dynamic from 'next/dynamic';
import AiConfigurator from '../../AiConfigurator';
import { CreateArticleAiDto } from '../../../../server/article/dto/create-article-ai.dto';

const SimpleMde = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
});

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  content: yup.string().min(20).required('Content is required'),
});

interface ArticleInput {
  title: string;
  content?: string;
}

interface Props {
  aiSettings?: CreateArticleAiDto;
}

const CreateArticle = (props: Props) => {
  const cRouter = useChainableRouter();
  const [useAi, setUseAi] = useState(true);
  const { createResource } = useResource('article');
  const formik = useFormik<ArticleInput>({
    initialValues: {
      title: '',
      content: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const res = await createResource(values);
      if (res instanceof Error) return;
      cRouter.create().setPath('admin/article').setQuery({}).push();
    },
  });
  const toggleAiField = () => setUseAi(!useAi);

  function onAiSuccess(article) {
    formik.setFieldValue('content', article.content.text);
  }

  return (
    <>
      <Card>
        <Grid
          container
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <h3>Create article</h3>
          <Button variant={'outlined'} onClick={toggleAiField}>
            Use ai
          </Button>
        </Grid>
        <form onSubmit={formik.handleSubmit}>
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
          {useAi && (
            <AiConfigurator
              aiSettings={props.aiSettings}
              onSuccess={onAiSuccess}
            />
          )}
          <SimpleMde
            value={formik.values.content}
            onChange={(value: string) => {
              formik.setFieldValue('content', value);
            }}
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
      {formik.values.content && (
        <Card>
          <h3>Preview</h3>
          <hr />
          <ReactMarkdown>{formik.values.content}</ReactMarkdown>
        </Card>
      )}
    </>
  );
};

export default CreateArticle;
