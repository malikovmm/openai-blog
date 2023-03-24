import React, { ReactNode } from 'react';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import Card from '../Card';
import styled from 'styled-components';

const IconContainer = styled.div``;
const Label = styled.div`
  display: flex;
  font-size: 18px;
  gap: 5px;
`;

const SBContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 80%;
  gap: 10px;
  text-align: center;
`;

const SBItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
`;

const CountNum = styled.span<{ color?: string }>`
  font-size: 36px;
  text-align: center;
  font-weight: bold;
  color: ${(p) => p.color || 'black'};
`;

const CountDes = styled.div`
  font-size: 24px;
  color: #666;
  min-width: max-content;
`;

interface Props {
  title: string | ReactNode;
  items: {
    color: string;
    value: string | number | ReactNode;
    description: string | ReactNode;
  }[];
}

export default function CountCard(props: Props) {
  return (
    <Card>
      <Label>
        <IconContainer>
          <AutoAwesomeMosaicIcon />
        </IconContainer>
        {props.title}
      </Label>
      <SBContainer>
        {props.items.map((it, ix) => (
          <SBItem key={ix}>
            <CountNum color={it.color}>{it.value}</CountNum>
            <CountDes>{it.description}</CountDes>
          </SBItem>
        ))}
      </SBContainer>
    </Card>
  );
}
