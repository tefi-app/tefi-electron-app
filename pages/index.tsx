import React, {useState, useEffect} from 'react';
import {useRouter} from "next/router";
import Head from 'next/head';
import Header from '../components/Header';
import Landing from '../components/Landing';
import styled from "styled-components";
import { getBankBalance } from './api/terra-core/core';

const EmptyContainer = styled.div`
  height: 100vh;
  width: 100vh;
  background-color: ${props => props.theme.colors.primary};
`


const Home: React.FC = ({ theme, changeTheme }: any) => {

  const [isDisplay, setIsDisplay] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
  setIsDisplay(false);
   setTimeout(() => setIsDisplay(true), 1000);
  }, [router.pathname]);

  getBankBalance({args: {address: "terra1hyfgmh3f3jm9stq9q703nehawkpp4fu84xpyqe"}});
  return (
    <div>
      <Head>
        <title>Tefi app</title>
      </Head>
      {!isDisplay ? <EmptyContainer/> : 
      <>
        <div>
          <Header theme={theme} changeTheme={changeTheme} />
        </div>
        <Landing />
      </>
      }
    </div>
  );
};

export default Home;
