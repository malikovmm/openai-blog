import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, TextField } from '@mui/material';
import SettingsFormElements from '../Settings/SettingsFormElements';
import { ButtonsContainer } from '../Settings/style';
import { settingsValidationSchema } from '../../utils/validation';
import { CreateArticleAiDto } from '../../../server/article/dto/create-article-ai.dto';
import UseAi from '../../hooks/useAi';
import { Article } from '../../../server/article/entities/article.entity';

interface Props {
  aiSettings: CreateArticleAiDto;
  onSuccess: (article: Article) => void;
}

const validationSchema = settingsValidationSchema.shape({
  prompt: yup.string().required('prompt is required'),
});

const AiConfigurator = (props: Props) => {
  const { retry, httpStatus, success, message, createArticle } = UseAi();
  const formik = useFormik<CreateArticleAiDto>({
    initialValues: {
      prompt: '',
      max_tokens: props.aiSettings.max_tokens,
      model: props.aiSettings.model,
      stop: props.aiSettings.stop || [],
      suffix: props.aiSettings.suffix || '',
      temperature: props.aiSettings.temperature,
      translateTo: props.aiSettings.translateTo || '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const article = await createArticle(values);
      if (article instanceof Error) return;
      props.onSuccess(article);
    },
  });
  return (
    <div>
      <h3>Request to openai</h3>
      <TextField
        fullWidth
        multiline
        rows={4}
        id="prompt"
        name="prompt"
        label="Prompt"
        value={formik.values.prompt}
        onChange={formik.handleChange}
        error={formik.touched.prompt && Boolean(formik.errors.prompt)}
        helperText={formik.touched.prompt && formik.errors.prompt}
        sx={{ mb: 1 }}
      />
      <SettingsFormElements formik={formik} defaultValues={props.aiSettings} />
      <ButtonsContainer>
        <Button
          type="button"
          variant={'outlined'}
          onClick={formik.submitForm}
          disabled={formik.isSubmitting}
        >
          Request
        </Button>
      </ButtonsContainer>
    </div>
  );
};

export default AiConfigurator;
