import { FC, useEffect, useRef, useState } from 'react';

import { message } from 'antd';

// import { ReactComponent as LineRightStepIcon } from '@/assets/icons/line-right-blue-24.svg';
import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';
import { ReactComponent as ActionBackIcon } from '@/assets/icons/single-left.svg';
import { ReactComponent as ActionNextIcon } from '@/assets/icons/single-right.svg';

import { confirmModal } from '@/helper/common';
import { useBoolean } from '@/helper/hook';
import { sortObjectArray } from '@/helper/utils';

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
import { NextStep, SlideActions } from './NextStep';

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
  const brandName = (useAppSelector((state) => state.product.brand?.name) || '').toLowerCase();
  const foundGroup = attributes.find((item) => item.name.toLowerCase().includes(brandName));
  const defaultSelected = foundGroup?.subs[0];
  const activeAttrGroupId = useAppSelector((state) => state.product.curAttrGroupCollapseId);
  const slideActionRef = useRef<SlideActions>(null);
  const currentActiveSpecAttributeGroupId = activeAttrGroupId?.['specification_attribute_groups'];
  const disablePreButton = useBoolean<Boolean>(false);
  const handleResetAutoStep = () => {
    store.dispatch(resetAutoStepState());
  };
  const handlePrevious = () => {
    if (slideActionRef.current) {
      slideActionRef.current.handleBackToPrevSlide();
    }
  };
  const handleNext = () => {
    if (slideActionRef.current) {
      slideActionRef.current.handleGoToNextSlide();
    }
  };
  const onDisablePreButton = (value: boolean) => {
    disablePreButton.setValue(value);
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
        if (!sub?.basis) {
          console.log(sub);
          return;
        }

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
              replicate: 0,
            })),
          });
        }
      });
    });

    store.dispatch(
      setLinkedOptionData({
        index: 0,
        pickedData: pickedData.map((el) => ({
          ...el,
          subs: sortObjectArray(
            el.subs.map((item) => ({
              ...item,
              sortField: `${item.value_1}${item.unit_1}${item.value_2}${item.unit_2}`,
            })),
            'sortField',
          ).map((item) => {
            const { sortField, ...temp } = item;
            return temp;
          }),
        })),
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
          store.dispatch(
            setSubOptionSelected({
              [currentActiveSpecAttributeGroupId]: defaultSelected?.id as string,
            }),
          );
        }

        /// go back to select option dataset
        store.dispatch(setStep('pre'));
      },
    });
  };

  const handleCreateStep = (type: 'preserve' | 'create') => () => {
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

    if (type === 'preserve') {
      message.success('Preserved successfully');
      return;
    }

    if (type === 'create') {
      /// close popup
      setVisible(false);
    }
  };
  useEffect(() => {
    if (currentActiveSpecAttributeGroupId) {
      store.dispatch(
        setSubOptionSelected({
          [currentActiveSpecAttributeGroupId]: defaultSelected?.id as string,
        }),
      );
    }
  }, [defaultSelected]);
  return (
    <CustomModal
      title={
        <MainTitle level={3} style={{ textTransform: 'uppercase' }}>
          Create Steps
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
                !!subOptionSelected?.[currentActiveSpecAttributeGroupId] &&
                !defaultSelected) ||
              (!!currentActiveSpecAttributeGroupId &&
                !subOptionSelected?.[currentActiveSpecAttributeGroupId] &&
                !defaultSelected)
            }
            icon={<ActionNextIcon />}
            onClick={handleGoToNextStep}
          />
        ) : (
          <div className="flex-end">
            <CustomButton
              size="small"
              properties="rounded"
              variant={'secondary'}
              disabled={disablePreButton.value}
              onClick={handlePrevious}
            >
              Previous
            </CustomButton>
            <CustomButton
              size="small"
              properties="rounded"
              variant={'secondary'}
              disabled={false}
              style={{ marginLeft: 16 }}
              onClick={handleNext}
            >
              Next
            </CustomButton>
            <CustomButton
              buttonClass="action-left-icon"
              size="small"
              properties="rounded"
              style={{ marginLeft: 16 }}
              icon={<ActionBackIcon />}
              onClick={handleBackToSelectOption}
            />
            {/* <CustomButton
              size="small"
              properties="rounded"
              disabled={disabledCreateStep}
              style={{ marginLeft: 16 }}
              onClick={handleCreateStep('preserve')}
            >
              Preserve
            </CustomButton> */}
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
          attributeGroup={attributeGroup}
          selected={
            subOptionSelected?.[currentActiveSpecAttributeGroupId || ''] ||
            defaultSelected?.id ||
            ''
          }
        />
      ) : (
        <NextStep onDisablePreButton={onDisablePreButton} ref={slideActionRef} />
      )}
    </CustomModal>
  );
};
