import { useEffect } from 'react';

import { capitalize, map, startCase, upperCase } from 'lodash';

import { TopBarSummaryProps } from './types';

import { RobotoBodyText, Title } from '../Typography';
import styles from './index.less';

interface TopBarSummaryItemProps {
  label: string;
  value?: number;
  isBold?: boolean;
}

const TopBarSummaryItem = ({ label, value, isBold }: TopBarSummaryItemProps) => {
  return (
    <div className={styles.summaryItem}>
      {isBold ? (
        <Title level={8}>{value}</Title>
      ) : (
        <RobotoBodyText level={5}>{value}</RobotoBodyText>
      )}
      {isBold ? (
        <Title level={9}>{label}</Title>
      ) : (
        <RobotoBodyText level={6}>{label}</RobotoBodyText>
      )}
    </div>
  );
};

export const TopBarMenuSummary: React.FC<TopBarSummaryProps> = ({
  state,
  setState,
  summaryData,
  summaryType,
}) => {
  const data: TopBarSummaryItemProps[] = map(state, (value, label) => ({
    label: label === summaryType ? upperCase(label) : capitalize(startCase(label)),
    value: value ?? 0,
    isBold: label === summaryType,
  }));

  useEffect(() => {
    if (summaryData) {
      setState(summaryData);
    }
  }, [summaryData]);

  return (
    <div className={styles.projectSummaryWrapper}>
      {data.map((summaryItem, index) => (
        <TopBarSummaryItem key={index} {...summaryItem} />
      ))}
    </div>
  );
};
