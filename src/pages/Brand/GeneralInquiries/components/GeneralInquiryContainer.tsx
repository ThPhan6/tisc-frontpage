import { FC, useEffect, useState } from 'react';

import { GeneralInquiryFilters, GlobalFilter } from '../constants/filters';
import { PageContainer } from '@ant-design/pro-layout';

// import { getGeneralInquirySummary } from '../services';
import { getProjectSummary } from '@/features/project/services';

import { GeneralInquirySummaryData } from '../types';
import { DropDownFilterProps, DropDownFilterValueProps } from '@/components/TopBar/types';

import TopBarSummaryHasFilter from '@/components/TopBar';
import TopBarDropDownFilter from '@/components/TopBar/TopBarDropDownFilter';
import { TopBarMenuSummary } from '@/components/TopBar/TopBarMenuSummary';

interface GeneralInquirySummaryProps {
  summaryData?: GeneralInquirySummaryData;
}

const GeneralInquirySummary: React.FC<GeneralInquirySummaryProps> = ({ summaryData }) => {
  const [state, setState] = useState<GeneralInquirySummaryData>({
    inquiries: 0,
    pending: 0,
    responded: 0,
  });

  return (
    <TopBarMenuSummary
      state={state}
      setState={setState}
      summaryData={summaryData}
      summaryType="inquiries"
    />
  );
};

interface GeneralInquiryContainerProps extends Partial<DropDownFilterProps> {
  isShowFilter?: boolean;
}

export const GeneralInquiryContainer: FC<GeneralInquiryContainerProps> = ({
  selectedFilter,
  setSelectedFilter,
  isShowFilter,
  children,
}) => {
  const [summaryData, setSummaryData] = useState<GeneralInquirySummaryData>();

  useEffect(() => {
    /* getGeneralInquirySummary */ getProjectSummary().then((res) => {
      if (res) {
        setSummaryData(res);
      }
    });
  }, [selectedFilter]);

  return (
    <PageContainer
      pageHeaderRender={() => (
        <TopBarSummaryHasFilter>
          <GeneralInquirySummary summaryData={summaryData} />
          <TopBarDropDownFilter
            selectedFilter={selectedFilter ?? ({} as DropDownFilterValueProps)}
            setSelectedFilter={setSelectedFilter}
            filterLabel="Inquiry Status"
            globalFilter={GlobalFilter}
            dynamicFilter={GeneralInquiryFilters}
            isShowFilter={isShowFilter}
          />
        </TopBarSummaryHasFilter>
      )}>
      {children}
    </PageContainer>
  );
};
