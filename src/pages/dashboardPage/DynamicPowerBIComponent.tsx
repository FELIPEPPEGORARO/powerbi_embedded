import dynamic from 'next/dynamic';
import React from 'react';
import { models } from 'powerbi-client';
import { EmbedProps, PowerBIEmbed } from 'powerbi-client-react';
import styles from '../../../styles/powerbi.module.scss';




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
  return (
    <PowerBIEmbed
      embedConfig={{
        type: 'report',
        tokenType: models.TokenType.Embed,
        accessToken: tokenDataProps.accessToken,
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
          background: models.BackgroundType.Default,
        }
      }}
      cssClassName={styles.pbiContainer}
    />
  );
};

export default DynamicPowerBIComponent;
