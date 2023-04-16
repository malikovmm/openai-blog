import React from 'react';
import CreateArticle from '../../../components/Article/CreateArticle';
import AdminLayout from '../../../layouts/Admin';

const CreateArticlePage = () => {
  return (
    <>
      <AdminLayout headerTitle={'poltavsky-school > article > create'}>
        <CreateArticle />
      </AdminLayout>
    </>
  );
};
export default CreateArticlePage;
