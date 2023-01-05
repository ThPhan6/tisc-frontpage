import { useEffect } from 'react';

import { PATH } from '@/constants/path';

import { ReactComponent as CloseIcon } from '@/assets/icons/action-close-icon.svg';
import { ReactComponent as VendorManagementIcon } from '@/assets/icons/vendor-management-icon.svg';

import { useScreen } from '@/helper/common';
import { pushTo } from '@/helper/history';

import { useAppSelector } from '@/reducers';

import { RobotoBodyText, Title } from '@/components/Typography';
import { TopBarContainer, TopBarItem } from '@/features/product/components';

import styles from '../CustomResource.less';
import { getCustomResourceSummary } from '../api';

export const CustomResourceTopBar = () => {
  const summaryData = useAppSelector((state) => state.customResource.summaryCustomResoure);
  const { isMobile } = useScreen();
  useEffect(() => {
    getCustomResourceSummary();
  }, []);

  return (
    <TopBarContainer
      RightSideContent={
        <>
          <TopBarItem
            topValue={
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <Title level={8} style={{ marginRight: '8px' }}>
                  CLOSE
                </Title>
                <CloseIcon />
              </div>
            }
            customClass={`${styles.topBar}`}
            bottomValue="Vendor Management"
            cursor="pointer"
            style={{ whiteSpace: 'nowrap' }}
            onClick={() => pushTo(PATH.designerCustomProduct)}
            icon={<VendorManagementIcon />}
          />
          {!isMobile &&
            summaryData.map((summary) => (
              <TopBarItem
                topValue={
                  <RobotoBodyText level={5} customClass={styles.fontBold}>
                    {summary.quantity}
                  </RobotoBodyText>
                }
                bottomValue={summary.label}
                customClass={styles.summary}
              />
            ))}
        </>
      }
      customClass={isMobile ? styles.customTopBar : ''}
    />
  );
};
