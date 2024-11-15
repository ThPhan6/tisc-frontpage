import React from 'react';

import { StepProps, Steps } from 'antd';

import { setStep } from '../reducers';
import { ImportStep } from '../types/import.type';
import store, { useAppSelector } from '@/reducers';

import { FileUpload } from './FileUpload';
import styles from './Import.less';

const steps: StepContentProps[] = [
  {
    title: 'File Upload',
    content: <FileUpload />,
    className: styles.stepHeader,
  },
  {
    title: 'Data Matching',
    content: 'Data Matching',
    className: styles.stepHeader,
  },
  {
    title: 'Verifying & Import',
    content: 'Verifying & Import',
    className: styles.stepHeader,
  },
];

interface StepContentProps extends StepProps {
  content: React.ReactNode;
}

export const Import = () => {
  const step = useAppSelector((s) => s.import.step);

  const handleChangeStep = (current: ImportStep) => {
    store.dispatch(setStep(current));
  };

  return (
    <div className={styles.container}>
      <Steps current={step} items={steps} onChange={handleChangeStep} className="mb-16" />
      <div className="step-content">{steps[step].content}</div>
    </div>
  );
};
