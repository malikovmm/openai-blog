import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import * as React from 'react';
import { FC, ReactNode } from 'react';

interface Props {
  text: string;
  icon?: ReactNode;
  isOpen: boolean;
}

const SidebarItem: FC<Props> = (props) => {
  return (
    <ListItem key={props.text} disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: props.isOpen ? 'initial' : 'center',
          px: 2.5,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: props.isOpen ? 3 : 'auto',
            justifyContent: 'center',
          }}
        >
          {props.icon}
        </ListItemIcon>
        <ListItemText
          primary={props.text}
          sx={{ opacity: props.isOpen ? 1 : 0 }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default SidebarItem;
