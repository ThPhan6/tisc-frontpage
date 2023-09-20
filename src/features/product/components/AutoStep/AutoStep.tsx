import { FC, useEffect, useState } from 'react';

// import { ReactComponent as LineRightStepIcon } from '@/assets/icons/line-right-blue-24.svg';
import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';
import { ReactComponent as ActionBackIcon } from '@/assets/icons/single-left.svg';
import { ReactComponent as ActionNextIcon } from '@/assets/icons/single-right.svg';

import { confirmModal } from '@/helper/common';

import {
  resetAutoStepState,
  setLinkedOptionData,
  setPartialProductDetail,
  setStep,
} from '../../reducers';
import { ProductAttributeFormInput, ProductAttributeFormInputWhenCreateStep } from '../../types';
import { AutoStepOnAttributeGroupResponse, LinkedOptionProps } from '../../types/autoStep';
import { RadioValue } from '@/components/CustomRadio/types';
import store, { useAppSelector } from '@/reducers';
import { ProductAttributes } from '@/types';

import CustomButton from '@/components/Button';
import { CustomModal } from '@/components/Modal';
import { MainTitle } from '@/components/Typography';

import styles from './AutoStep.less';
import { FirstStep } from './FirstStep';
import { NextStep } from './NextStep';

interface AutoStepProps {
  attributeGroup: ProductAttributeFormInput[];
  attributes: ProductAttributes[];
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const AutoStep: FC<AutoStepProps> = ({
  visible,
  setVisible,
  attributeGroup,
  attributes,
}) => {
  const [disabledCreateStep, setDisabledCreateStep] = useState<boolean>(false);

  const linkedOptionData = useAppSelector((state) => state.autoStep.linkedOptionData);

  const optionsSelected = useAppSelector((state) => state.autoStep.optionsSelected);

  const slideBar = useAppSelector((state) => state.autoStep.slideBar);

  const step = useAppSelector((state) => state.autoStep.step);

  const activeAttrGroupId = useAppSelector((state) => state.product.curAttrGroupCollapseId);

  const [subOptionSelected, setSubOptionSelected] = useState<RadioValue>({ value: '', label: '' });

  const handleClearAll = () => {
    store.dispatch(resetAutoStepState());
    setSubOptionSelected({ value: '', label: '' });
  };

  useEffect(() => {
    return () => {
      handleClearAll();
    };
  }, []);

  useEffect(() => {
    const pickedData: LinkedOptionProps[] = [];

    attributes?.forEach((el) => {
      if (pickedData?.length) {
        return;
      }

      el.subs.forEach((sub) => {
        if (sub.id === subOptionSelected.value && sub.basis.subs?.length) {
          pickedData.push({
            id: sub.basis.id,
            name: sub.basis.name,
            subs: sub.basis.subs.map((item: any) => ({
              ...item,
              sub_id: sub.id,
              sub_name: sub.name,
              pre_option: item.pre_option ?? undefined,
              replicate: item?.replicate ?? 1,
            })),
          });
        }
      });
    });

    store.dispatch(
      setLinkedOptionData({
        index: 0,
        pickedData: pickedData,
        linkedData: [],
      }),
    );
  }, [subOptionSelected]);

  useEffect(() => {
    const optionSelected = Object.keys(optionsSelected).length > 1;

    if (slideBar.includes('') || !optionSelected) {
      setDisabledCreateStep(true);
    } else {
      setDisabledCreateStep(false);
    }
  }, [slideBar, JSON.stringify(optionsSelected)]);

  const handleGoToNextStep = () => {
    store.dispatch(setStep(0));
  };

  const handleBackToSelectOption = () => {
    confirmModal({
      title: 'Are you sure go back to select option dataset?',
      content: 'You might lose all the relevant selections on each step.',
      onOk: () => {
        store.dispatch(resetAutoStepState());
        setSubOptionSelected({ label: '', value: '' });

        /// go back to select option dataset
        store.dispatch(setStep('pre'));
      },
    });
  };

  const handleCreateStep = () => {
    const allSteps = Object.values(optionsSelected);

    console.log('allSteps', allSteps);

    const steps: AutoStepOnAttributeGroupResponse[] = allSteps
      .map((el, index) => ({ ...el, name: slideBar[index] }))
      .filter((el) => el.options.length > 0);

    const newAttributeGroup: ProductAttributeFormInputWhenCreateStep[] = attributeGroup?.map((el) =>
      el.id === activeAttrGroupId?.['specification_attribute_groups']
        ? { ...el, steps: steps }
        : el,
    ) as any;

    store.dispatch(
      setPartialProductDetail({
        specification_attribute_groups: newAttributeGroup as any,
      }),
    );

    /// close popup
    setVisible(false);
  };

  return (
    <CustomModal
      title={
        <MainTitle level={3} style={{ textTransform: 'uppercase' }}>
          Auto-Steps
        </MainTitle>
      }
      secondaryModal
      visible={visible}
      onCancel={() => setVisible(false)}
      className={styles.modalContainer}
      maskClosable={false}
      afterClose={handleClearAll}
      width={'80%'}
      closeIcon={<CloseIcon />}
      footer={
        step === 'pre' ? (
          <CustomButton
            size="small"
            properties="rounded"
            disabled={
              (!linkedOptionData[0]?.pickedData.length && !!subOptionSelected.value) ||
              !subOptionSelected.value
            }
            icon={<ActionNextIcon />}
            onClick={handleGoToNextStep}
          />
        ) : (
          <div className="flex-end">
            <CustomButton
              size="small"
              properties="rounded"
              icon={<ActionBackIcon />}
              onClick={handleBackToSelectOption}
            />
            <CustomButton
              size="small"
              properties="rounded"
              disabled={disabledCreateStep}
              style={{ marginLeft: 16 }}
              onClick={handleCreateStep}
            >
              Create
            </CustomButton>
          </div>
        )
      }
    >
      {step === 'pre' ? (
        <FirstStep
          data={attributes}
          selected={subOptionSelected}
          setSelected={setSubOptionSelected}
        />
      ) : (
        <NextStep />
      )}
    </CustomModal>
  );
};
