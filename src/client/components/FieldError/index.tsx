import React from 'react';
import { ErrorContainer } from './styles';

interface Props {
  children: React.ReactNode;
}

export default function FieldError(props: Props) {
  return <ErrorContainer>{props.children}</ErrorContainer>;
}
