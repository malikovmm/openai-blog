import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import styledd from 'styled-components';
import ConfirmationDialog from '../Dialog';
import { DialogContext } from '../../hooks/useDialog';
import Link from 'next/link';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Article, Settings, Category } from '@mui/icons-material';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));
const MainContainer = styledd.div(() => ({
  backgroundColor: '#f1f1f1',
  height: 'calc(100vh - 64px)',
  width: '100%',
  padding: '5px',
  marginTop: '64px',
}));

interface Props {
  headerTitle: string;
  title: string;
  children: React.ReactNode;
}

const links = [
  {
    href: '/admin/article',
    label: 'article',
    icon: <Article sx={{ color: 'grey' }} />,
  },
  {
    href: '/admin/settings',
    label: 'settings',
    icon: <Settings sx={{ color: 'grey' }} />,
  },
  {
    href: '/admin/category',
    label: 'category',
    icon: <Category sx={{ color: 'grey' }} />,
  },
];

export default function MiniDrawer(props: Props) {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [dialogData, setDialogData] = React.useState<DialogContext>({});
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <DialogContext.Provider value={{ dialogData, setDialogData }}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={drawerOpen} sx={{ zIndex: 3 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(drawerOpen && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {props.headerTitle}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={drawerOpen} sx={{ zIndex: 2 }}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {links.map((it, ix) => (
              <Link href={it.href} key={ix}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: drawerOpen ? 'initial' : 'center',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: drawerOpen ? 3 : 0,
                    }}
                  >
                    {it.icon}
                  </ListItemIcon>
                  {drawerOpen && <ListItemText primary={it.label} />}
                </ListItemButton>
              </Link>
            ))}
          </List>
          <Divider />
        </Drawer>
        <MainContainer>{props.children}</MainContainer>
        <ConfirmationDialog />
      </Box>
    </DialogContext.Provider>
  );
}
