import React from 'react';

import { StepProps, Steps } from 'antd';

import { ReactComponent as RightIcon } from '@/assets/icons/line-right-blue-24.svg';

import { useImport } from '../hooks/useImport';

import { ImportStep } from '../types/import.type';

import { BodyText } from '@/components/Typography';

import { DataMatching } from './DataMatching';
import { FileUpload } from './FileUpload';
import styles from './Step.less';

const steps: StepContentProps[] = [
  {
    title: (
      <div className="d-flex align-center" style={{ gap: 8 }}>
        <BodyText fontFamily="Roboto" level={5} customClass="step-label">
          File Upload
        </BodyText>
        <div style={{ width: 24, height: 24 }}>
          <RightIcon className="right-icon" />
        </div>
      </div>
    ),
    content: <FileUpload />,
    className: styles.stepHeader,
  },
  {
    title: (
      <div className="d-flex align-center" style={{ gap: 8 }}>
        <BodyText fontFamily="Roboto" level={5} customClass="step-label">
          Data Matching
        </BodyText>
        <div style={{ width: 24, height: 24 }}>
          <RightIcon className="right-icon" />
        </div>
      </div>
    ),
    content: <DataMatching />,
    className: styles.stepHeader,
  },
  {
    title: (
      <div className="d-flex align-center" style={{ gap: 8 }}>
        <BodyText fontFamily="Roboto" level={5} customClass="step-label">
          Verifying & Import
        </BodyText>
      </div>
    ),
    content: <DataMatching />,
    className: styles.stepHeader,
  },
];

interface StepContentProps extends StepProps {
  content: React.ReactNode;
}

export const Step = () => {
  const { step, handleChangeStep } = useImport();

  return (
    <div className={styles.container}>
      <Steps current={step} onChange={handleChangeStep}>
        <Steps.Step title={steps[ImportStep.STEP_1].title} />
        <Steps.Step title={steps[ImportStep.STEP_2].title} />
        <Steps.Step title={steps[ImportStep.STEP_3].title} />
      </Steps>

      <div className="step-content">{steps[step].content}</div>
    </div>
  );
};
