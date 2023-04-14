import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Button, Grid, TextField } from '@mui/material';
import FieldError from '../../FieldError';
import { useFormik } from 'formik';
import useImage from '../../../hooks/useImage';
import Loading from '../../Loading';
import { buildImageUrl } from '../../../utils/http';
import { ImgStyled } from './styles';
import { isImage } from '../../../utils/file';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { CreateArticleDto } from '../../../../server/article/dto/create-article.dto';
import { EditArticleDto } from '../../../../server/article/dto/edit-article.dto';

const SimpleMde = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
});

interface CreateArticleBlockProps {
  title: string;
  content: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContentChange: (val: string) => void;
  titleError?: boolean;
  contentError?: boolean;
  titleHelperText?: string;
  contentHelperText?: string;
  picture: string;
  onPictureChange: (fileName: string) => void;
  pictureLocation: number;
  onPictureLocationChange: (pictureLocation: number) => void;
  simpleFields: boolean;
}

function ImageContainer(props: { picture: string; isLoading: boolean }) {
  if (props.isLoading) return <Loading />;
  return props.picture ? (
    <ImgStyled src={buildImageUrl(props.picture)} alt="img" />
  ) : (
    <span>Your image here</span>
  );
}

interface RadioButtonsGroupProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  position: number; // 0 - full width; 1 - left; 2 - right
}

function RadioButtonsGroup(props: RadioButtonsGroupProps) {
  return (
    <FormControl>
      <FormLabel>Position</FormLabel>
      <RadioGroup
        name="radio-buttons-group"
        value={props.position}
        onChange={props.onChange}
      >
        <FormControlLabel value="0" control={<Radio />} label="full width" />
        <FormControlLabel value="1" control={<Radio />} label="left" />
        <FormControlLabel value="2" control={<Radio />} label="right" />
      </RadioGroup>
    </FormControl>
  );
}

interface PictureConfigProps {
  onPictureChange: (fileName: string) => void;
  picture: string;
  pictureLocation: number;
  onPictureLocationChange: (pictureLocation: number) => void;
  simple: boolean;
}

function PictureConfig(props: PictureConfigProps) {
  if (props.simple)
    return (
      <TextField
        fullWidth
        label="Prompt"
        value={props.picture}
        onChange={(e) => props.onPictureChange(e.target.value)}
        sx={{ mb: 1, mt: 1 }}
      />
    );

  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { saveImage, findImage } = useImage();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target?.value ?? '');
  };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;
      if (!files?.length) return;
      const fileToSave = files[0];
      if (!isImage(fileToSave)) return;
      setIsLoading(true);
      const imageName = await saveImage(fileToSave);
      if (imageName instanceof Error) return;
      props.onPictureChange(imageName);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };
  const handleFind = async () => {
    try {
      if (!prompt) return;
      setIsLoading(true);
      const imageName = await findImage(prompt);
      if (imageName instanceof Error) return;
      props.onPictureChange(imageName);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };
  const handlePositionChanging = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onPictureLocationChange(~~e.target?.value);
  };
  return (
    <Grid container justifyContent={'space-between'} wrap={'nowrap'}>
      <Grid xs={8} item>
        <Box>
          <TextField
            fullWidth
            label="Prompt"
            value={prompt}
            onChange={handleChange}
            sx={{ mb: 1, mt: 1 }}
          />
          <Button variant="contained" component="label" disabled={isLoading}>
            Upload File
            <input type="file" hidden onChange={handleFileUpload} />
          </Button>
          <Button
            variant="contained"
            sx={{ ml: 1 }}
            disabled={isLoading}
            onClick={handleFind}
          >
            Find by prompt
          </Button>
        </Box>
        <Box>
          <RadioButtonsGroup
            onChange={handlePositionChanging}
            position={props.pictureLocation}
          />
        </Box>
      </Grid>

      <Grid xs={4} item>
        <Box
          sx={{ border: 1, p: 2, height: '100%', ml: 1 }}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <ImageContainer picture={props.picture} isLoading={isLoading} />
        </Box>
      </Grid>
    </Grid>
  );
}

function ArticleBlock(props: CreateArticleBlockProps) {
  return (
    <>
      <PictureConfig
        onPictureChange={props.onPictureChange}
        picture={props.picture}
        pictureLocation={props.pictureLocation}
        onPictureLocationChange={props.onPictureLocationChange}
        simple={props.simpleFields}
      />
      <TextField
        fullWidth
        label="Title"
        value={props.title}
        onChange={props.onTitleChange}
        error={props.titleError}
        helperText={props.titleHelperText}
        sx={{ mb: 1, mt: 1 }}
      />
      {props.simpleFields ? (
        <TextField
          fullWidth
          label="Prompt"
          value={props.content}
          onChange={(e) => props.onContentChange(e.target?.value)}
          error={props.contentError}
          helperText={props.contentHelperText}
          sx={{ mb: 1, mt: 1 }}
        />
      ) : (
        <>
          <SimpleMde
            value={props.content}
            onChange={props.onContentChange}
            className={props.contentError ? 'mde-error' : ''}
          />
          {props.contentError && (
            <FieldError>{props.contentHelperText}</FieldError>
          )}
        </>
      )}
    </>
  );
}

interface ArticleBlocksFieldsProps<T> {
  formik: ReturnType<typeof useFormik<T>>;
  simpleFields: boolean;
}

export default function ArticleBlocksFields({
  formik,
  simpleFields,
}: ArticleBlocksFieldsProps<CreateArticleDto | EditArticleDto>) {
  const onTitleChange =
    (ix: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const nextBlock = formik.values.blocks[ix];
      nextBlock.title = e.target.value;
      formik.setFieldValue('blocks', formik.values.blocks);
    };
  const onContentChange = (ix: number) => (val: string) => {
    const nextBlock = formik.values.blocks[ix];
    nextBlock.content = val;
    formik.setFieldValue('blocks', formik.values.blocks);
  };
  const onPictureChange = (ix: number) => (val: string) => {
    const nextBlock = formik.values.blocks[ix];
    nextBlock.picture = val;
    formik.setFieldValue('blocks', formik.values.blocks);
  };
  const onPictureLocationChange = (ix: number) => (val: number) => {
    const nextBlock = formik.values.blocks[ix];
    nextBlock.pictureLocation = val;
    formik.setFieldValue('blocks', formik.values.blocks);
  };
  const addBlock = () => {
    formik.setFieldValue('blocks', [
      ...formik.values.blocks,
      {
        pictureLocation: 0,
        content: '',
        picture: '',
        title: '',
      },
    ]);
  };
  return (
    <>
      {formik.values.blocks.map((block, ix) => {
        if (!block) return null;
        return (
          <>
            <Grid container justifyContent={'end'}>
              <Button
                disabled={formik.values.blocks.length === 1}
                variant={'outlined'}
                onClick={() => {
                  formik.values.blocks.splice(ix, 1);
                  formik.setFieldValue('blocks', formik.values.blocks);
                }}
              >
                Delete
              </Button>
            </Grid>

            <ArticleBlock
              simpleFields={simpleFields}
              title={block.title}
              onTitleChange={onTitleChange(ix)}
              content={block.content}
              onContentChange={onContentChange(ix)}
              contentError={
                formik.touched?.blocks &&
                Boolean(
                  formik.errors?.blocks &&
                    formik.errors?.blocks[ix] &&
                    formik.errors?.blocks[ix]['content'],
                )
              }
              contentHelperText={
                formik.errors?.blocks &&
                formik.errors?.blocks[ix] &&
                formik.errors.blocks[ix]['content']
              }
              titleError={
                formik.touched?.blocks &&
                Boolean(
                  formik.errors?.blocks &&
                    formik.errors?.blocks[ix] &&
                    formik.errors?.blocks[ix]['title'],
                )
              }
              titleHelperText={
                formik.errors.blocks &&
                formik.errors.blocks[ix] &&
                formik.errors.blocks[ix]['title']
              }
              picture={block.picture}
              onPictureChange={onPictureChange(ix)}
              pictureLocation={block.pictureLocation}
              onPictureLocationChange={onPictureLocationChange(ix)}
            />
          </>
        );
      })}
      <Button fullWidth variant={'outlined'} onClick={addBlock}>
        Add block
      </Button>
    </>
  );
}
