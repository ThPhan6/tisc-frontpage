import { FC, useEffect, useState } from 'react';

import { message } from 'antd';

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
  setSubOptionSelected,
} from '../../reducers';
import { ProductAttributeFormInput } from '../../types';
import { AutoStepOnAttributeGroupResponse, LinkedOptionProps } from '../../types/autoStep';
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

  const slideBars = useAppSelector((state) => state.autoStep.slideBars);

  const step = useAppSelector((state) => state.autoStep.step);

  const subOptionSelected = useAppSelector((state) => state.autoStep.subOptionSelected);

  const activeAttrGroupId = useAppSelector((state) => state.product.curAttrGroupCollapseId);
  const currentActiveSpecAttributeGroupId = activeAttrGroupId?.['specification_attribute_groups'];

  const handleResetAutoStep = () => {
    store.dispatch(resetAutoStepState());
  };

  useEffect(() => {
    return () => {
      handleResetAutoStep();
    };
  }, []);

  useEffect(() => {
    const pickedData: LinkedOptionProps[] = [];

    attributes?.forEach((el) => {
      if (pickedData?.length) {
        return;
      }

      el.subs.forEach((sub) => {
        if (
          currentActiveSpecAttributeGroupId &&
          sub.id === subOptionSelected?.[currentActiveSpecAttributeGroupId] &&
          sub.basis.subs?.length
        ) {
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

    if (slideBars.includes('') || !optionSelected) {
      setDisabledCreateStep(true);
    } else {
      setDisabledCreateStep(false);
    }
  }, [slideBars, JSON.stringify(optionsSelected)]);

  const handleGoToNextStep = () => {
    store.dispatch(setStep(0));
  };

  const handleBackToSelectOption = () => {
    confirmModal({
      title: 'Are you sure go back to select option dataset?',
      content: 'You might lose all the relevant selections on each step.',
      onOk: () => {
        // clearSteps();
        store.dispatch(resetAutoStepState());

        if (currentActiveSpecAttributeGroupId) {
          setSubOptionSelected({ [currentActiveSpecAttributeGroupId]: '' });
        }

        /// go back to select option dataset
        store.dispatch(setStep('pre'));
      },
    });
  };

  const handleCreateStep = (type: 'save' | 'create') => () => {
    const allSteps = Object.values(optionsSelected);

    const steps: AutoStepOnAttributeGroupResponse[] = allSteps
      .map((el, index) => ({ ...el, name: slideBars[index] }))
      .filter((el) => el.options.length > 0);

    const newAttributeGroup: ProductAttributeFormInput[] = attributeGroup?.map((el) =>
      el.id === currentActiveSpecAttributeGroupId ? { ...el, steps: steps, attributes: [] } : el,
    );

    store.dispatch(
      setPartialProductDetail({
        specification_attribute_groups: newAttributeGroup,
      }),
    );

    if (type === 'save') {
      message.success('Save successfully');
      return;
    }

    if (type === 'create') {
      /// close popup
      setVisible(false);
    }
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
      afterClose={handleResetAutoStep}
      width={'80%'}
      closeIcon={<CloseIcon />}
      footer={
        step === 'pre' ? (
          <CustomButton
            buttonClass="action-left-icon"
            size="small"
            properties="rounded"
            disabled={
              (!linkedOptionData[0]?.pickedData.length &&
                !!currentActiveSpecAttributeGroupId &&
                !!subOptionSelected?.[currentActiveSpecAttributeGroupId]) ||
              (!!currentActiveSpecAttributeGroupId &&
                !subOptionSelected?.[currentActiveSpecAttributeGroupId])
            }
            icon={<ActionNextIcon />}
            onClick={handleGoToNextStep}
          />
        ) : (
          <div className="flex-end">
            <CustomButton
              buttonClass="action-left-icon"
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
              onClick={handleCreateStep('save')}
            >
              Save
            </CustomButton>
            <CustomButton
              size="small"
              properties="rounded"
              disabled={disabledCreateStep}
              style={{ marginLeft: 16 }}
              onClick={handleCreateStep('create')}
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
          selected={
            currentActiveSpecAttributeGroupId
              ? subOptionSelected?.[currentActiveSpecAttributeGroupId]
              : ''
          }
        />
      ) : (
        <NextStep />
      )}
    </CustomModal>
  );
};
