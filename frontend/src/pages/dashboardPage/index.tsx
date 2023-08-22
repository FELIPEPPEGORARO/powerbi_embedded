import dynamic from 'next/dynamic';
import React, { useState, useEffect, useContext } from 'react';
import { canSSRGuest } from '../../utils/canSSRGuest'; 
import { setupAPICliente } from '../../services/api';
import { AuthContext } from '../../../src/contexts/AuthContext';
import Head from 'next/head';
import styles from '../../../styles/powerbi.module.scss';
import { Button } from '../../components/ui/button';

type tokenProps = {
  accessToken: string;
  reportId: string;
  embedUrl: string;
  clientId: string;
  expiry: string;
};

interface HomeProps {
  tokenDataProps: tokenProps;
}

const DynamicPowerBIComponent = dynamic(
  () => import('./DynamicPowerBIComponent'), // Caminho para o componente Power BI
  { ssr: false }
);

export default function DynamicDashboard({ tokenDataProps }: HomeProps) {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { isAuthenticated } = useContext(AuthContext); // Acessando o contexto de autenticação
  
  useEffect(() => {
    if (tokenDataProps.accessToken) {
      setIsDataLoaded(true);
    }
  }, [tokenDataProps]);

  return (
    <>
      <Head>
        <title>Indicadores de Desempenho</title>
      </Head>

      {isAuthenticated ? (
        isDataLoaded ? (
          <DynamicPowerBIComponent tokenDataProps={tokenDataProps} />
        ) : (
          <p>Loading...</p>
        )
      ) : (
        <p>Você não tem permissão para acessar esta página.</p>
      )}
    </>
  );
}

export const getServerSideProps = canSSRGuest(async () => {
  const apiClient = setupAPICliente();
  const response = await apiClient.get('/pbiObject');


  return {
    props: {
      tokenDataProps: response.data,
    },
  };
});
