import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Button, Grid } from '@mui/material';
import Card from '../../Card';
import useResource from '../../../hooks/useResource';
import 'easymde/dist/easymde.min.css';
import { CreateArticleDto } from '../../../../server/article/dto/create-article.dto';
import ArticleForm from '../Form';
import { articleValidationSchema } from '../../../utils/validation';
import {
  LocalizationProvider,
  StaticDateTimePicker,
} from '@mui/x-date-pickers';
import moment from 'moment';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const CreateArticle = () => {
  const [useAi, setUseAi] = useState(false);
  const [schedule, setSchedule] = useState(false);
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
      publishAt: moment().add(1, 'hour').startOf('hour').unix(),
    },
    validationSchema: articleValidationSchema,
    onSubmit: async (values) => {
      const reqValues = schedule ? values : { ...values, publishAt: null };
      const res = await createResource(reqValues);
      if (res instanceof Error) return;
    },
  });
  const toggleAiField = () => setUseAi(!useAi);
  const toggleSchedule = () => setSchedule(!schedule);
  return (
    <>
      <Card>
        <Grid
          container
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <h3>{useAi ? 'Создание статьи с помощью ИИ' : 'Создание статьи'}</h3>
          <div>
            <Button variant={'outlined'} onClick={toggleAiField}>
              {useAi ? 'Create article manual' : 'Use ai'}
            </Button>
            <Button
              variant={'outlined'}
              onClick={toggleSchedule}
              sx={{ ml: 1 }}
            >
              {schedule ? 'Опубликовать сразу' : 'Отложить публикацию'}
            </Button>
          </div>
        </Grid>

        {schedule && (
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <StaticDateTimePicker
              minutesStep={30}
              ampm={false}
              value={moment(formik.values.publishAt * 1000)}
              onChange={(value) =>
                formik.setFieldValue('publishAt', value.unix())
              }
              slots={{ actionBar: 'off' } as any}
            />
          </LocalizationProvider>
        )}
        <form onSubmit={formik.handleSubmit}>
          <ArticleForm formik={formik} simpleFields={useAi} />
        </form>
      </Card>
    </>
  );
};

export default CreateArticle;
