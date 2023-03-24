import React from 'react';
import { NextPage } from 'next';
import AdminLayout from '../../layouts/Admin';

const Admin: NextPage = () => {
  return (
    <>
      <AdminLayout headerTitle={''}>
        <div>admin</div>
      </AdminLayout>
    </>
  );
};

export default Admin;
