import React from 'react';
import MiniDrawer from '../components/Sidebar/Drawer';
import { useRouter } from 'next/router';
import { SnackbarProvider } from 'notistack';

const urlToTitle = {
  '/': 'Dashboard',
};

interface Props {
  headerTitle: string;
  children: React.ReactNode;
}

const AdminLayout = (props: Props) => {
  const r = useRouter();
  return (
    <SnackbarProvider maxSnack={3}>
      <MiniDrawer
        title={urlToTitle[r.pathname]}
        headerTitle={props.headerTitle}
      >
        {props.children}
      </MiniDrawer>
    </SnackbarProvider>
  );
};

export default AdminLayout;
