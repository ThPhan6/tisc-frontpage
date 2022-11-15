import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';

import { ReactComponent as VendorManagementIcon } from '@/assets/icons/vendor-management-icon.svg';

import { getCustomResourceSummary } from '../../services';
import { pushTo } from '@/helper/history';

import { DataMenuSummaryProps } from '@/components/MenuSummary/types';

import { RobotoBodyText } from '@/components/Typography';
import { TopBarContainer, TopBarItem } from '@/features/product/components';

import styles from './index.less';

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
              <RobotoBodyText level={5} customClass={styles.fontBold}>
                Click to close
              </RobotoBodyText>
            }
            customClass="left-divider mr-12"
            bottomValue="Vendor Management"
            cursor="pointer"
            onClick={() => pushTo(PATH.designerOfficeLibrary)}
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
