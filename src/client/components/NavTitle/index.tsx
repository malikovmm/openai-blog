import React from 'react';
import Card from '../Card';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Container } from './style';
import useChainableRouter from '../../hooks/useChainableRouter';

interface Props {
  prevLink?: string;
  children: React.ReactNode;
}

const NavTitle = (props: Props) => {
  const cRouter = useChainableRouter();
  const goToLink = () => {
    cRouter.create().setPath(props.prevLink).setQuery({}).push();
  };
  return (
    <Card>
      <Container>
        {props.prevLink && (
          <IconButton aria-label="delete" size="large" onClick={goToLink}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography variant="h6" noWrap component="div">
          {props.children}
        </Typography>
      </Container>
    </Card>
  );
};

export default NavTitle;
