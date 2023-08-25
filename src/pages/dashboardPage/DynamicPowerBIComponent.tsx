import dynamic from 'next/dynamic';
import React from 'react';
import styles from '../../../styles/powerbi.module.scss';

const PowerBIEmbed = dynamic(() => import('powerbi-client-react').then((m) => m.PowerBIEmbed), { ssr: false });

interface DynamicPowerBIProps {
  tokenDataProps: {
    accessToken: string;
    reportId: string;
    embedUrl: string;
  };
}

const DynamicPowerBIComponent: React.FC<DynamicPowerBIProps> = ({
  tokenDataProps,
}) => {
  if (typeof window === 'undefined') {
    return <p>Carregando...</p>; // Avoid running Power BI code on the server
  }

  return (
    <PowerBIEmbed
      embedConfig={{
        type: 'report',
        accessToken: tokenDataProps.accessToken,
        tokenType: 1,
        embedUrl: tokenDataProps.embedUrl,
        id: tokenDataProps.reportId,
        settings: {
          panes: {
            filters: {
              expanded: true,
              visible: false
            },
            pageNavigation: {
              visible: false,
            }
          },
          background: 0,
        }
      }}
      cssClassName={styles.pbiContainer}
    />
  );
};

export default DynamicPowerBIComponent;