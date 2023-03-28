import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
// import { Article } from '../../../../server/article/entities/article.entity';
import usePagination from '../../../hooks/usePagination';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next/types';
import ky from 'ky';

const ContainerCharts = styled.div`
  display: flex;
  gap: 5px;
  width: 100%;
`;
const ContainerTable = styled.div`
  margin-top: 5px;
  display: flex;
  width: 100%;
`;

const Label = styled.div`
  display: flex;
  font-size: 18px;
  gap: 5px;
  padding-top: 15px;
  padding-left: 15px;
`;
const TitleLabel = styled.div`
  display: flex;
  gap: 5px;
`;
const Article: FC<any> = (props) => {
  const { onPageChange, onLimitChange } = usePagination({
    pageQueryName: 'articlePage',
    limitQueryName: 'articleLimit',
  });
  useEffect(() => {
    fetch('http://localhost:3000/auth', {
      credentials: 'include',
    })
      .then((res) => {
        console.log(res);
        return res.text();
      })
      .then((text) => {
        console.log(text);
      });
  }, []);
  return (
    <>
      <div>article index</div>
    </>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> {
  const a = await ky.get('http://localhost:3005/article/test').text();
  console.log(a);
  // const res = await axiosClient
  //   .getInstance()
  //   .post('http://localhost:3005/auth/login', {
  //     username: 'admin',
  //     password: '123',
  //   });
  // console.log('res', res.data);
  // Object.keys(res.headers).forEach((k) => {
  //   context.res.setHeader(k, res.headers[k]);
  // });
  // axiosClient.setAccessToken(res.headers['authorization']);
  // const { page, limit, apiRequestURL } = buildRequestData(
  //   context,
  //   'article',
  //   'articlePage',
  //   'articleLimit',
  // );
  return {
    props: {},
  };
  // const response = await fetch(apiRequestURL);
}

export default Article;
