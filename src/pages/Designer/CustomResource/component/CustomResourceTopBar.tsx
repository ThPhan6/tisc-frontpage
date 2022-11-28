import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';

import { ReactComponent as CloseIcon } from '@/assets/icons/action-close-icon.svg';
import { ReactComponent as VendorManagementIcon } from '@/assets/icons/vendor-management-icon.svg';

import { pushTo } from '@/helper/history';

import { DataMenuSummaryProps } from '@/components/MenuSummary/types';

import { RobotoBodyText, Title } from '@/components/Typography';
import { TopBarContainer, TopBarItem } from '@/features/product/components';

import styles from '../CustomResource.less';
import { getCustomResourceSummary } from '../api';

export const CustomResourceTopBar = () => {
  const [summaryData, setSummaryData] = useState<DataMenuSummaryProps[]>([]);

  useEffect(() => {
    getCustomResourceSummary().then((res) => {
      if (res) {
        setSummaryData(res);
      }
    });
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
            customClass="left-divider mr-12"
            bottomValue="Vendor Management"
            cursor="pointer"
            onClick={() => pushTo(PATH.designerCustomProduct)}
            icon={<VendorManagementIcon />}
          />
          {summaryData.map((summary) => (
            <TopBarItem
              topValue={
                <RobotoBodyText level={5} customClass={styles.fontBold}>
                  {summary.quantity}
                </RobotoBodyText>
              }
              bottomValue={summary.label}
            />
          ))}
        </>
      }
    />
  );
};
