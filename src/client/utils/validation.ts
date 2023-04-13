import * as Yup from 'yup';

export const settingsValidationSchema = Yup.object().shape({
  max_tokens: Yup.number()
    .min(1, 'Must be greater than or equal to 1')
    .max(4000, 'Must be less than or equal to 4000'),
  model: Yup.string().required('Model is required'),
  stop: Yup.array()
    .max(4, 'Max number of stop sequences is 4')
    .of(Yup.string()),
  suffix: Yup.string(),
  temperature: Yup.number()
    .min(0, 'Must be greater than or equal to 0')
    .max(2, 'Must be less than or equal to 2'),
});

export const articleValidationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  blocks: Yup.array().of(
    Yup.object().shape({
      pictureLocation: Yup.number().notRequired(),
      picture: Yup.string().notRequired(),
      content: Yup.string().min(5).required('Required'),
      title: Yup.string().min(5).required('Required'),
    }),
  ),
});
