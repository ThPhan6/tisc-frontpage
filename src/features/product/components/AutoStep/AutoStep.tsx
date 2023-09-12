import { FC, useEffect, useState } from 'react';

// import { ReactComponent as LineRightStepIcon } from '@/assets/icons/line-right-blue-24.svg';
import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';
import { ReactComponent as ActionBackIcon } from '@/assets/icons/single-left.svg';
import { ReactComponent as ActionNextIcon } from '@/assets/icons/single-right.svg';

import { confirmModal } from '@/helper/common';
import { flatMap } from 'lodash';

import { resetAutoStepState, setLinkedOptionData, setPartialProductDetail } from '../../reducers';
import { ProductAttributeFormInput } from '../../types';
import {
  AutoStepLinkedOptionResponse,
  AutoStepOnAttributeGroupBody,
  LinkedOptionProps,
  LinkedSubOptionProps,
  OptionReplicate,
} from '../../types/autoStep';
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
  step: number | 'pre';
}

export const AutoStep: FC<AutoStepProps> = ({
  visible,
  setVisible,
  step,
  attributeGroup,
  attributes,
}) => {
  const [curStep, setCurStep] = useState<number | 'pre'>('pre');
  const [disabledCreateStep, setDisabledCreateStep] = useState<boolean>(true);

  const linkedOptionData = useAppSelector((state) => state.autoStep.linkedOptionData);
  const pickedOptionIds = useAppSelector((state) => state.autoStep.pickedOptionIds);
  const slideBar = useAppSelector((state) => state.autoStep.slideBar);

  const activeAttrGroupId = useAppSelector((state) => state.product.curAttrGroupCollapseId);

  const [subOptionSelected, setSubOptionSelected] = useState<RadioValue>({ value: '', label: '' });

  useEffect(() => {
    setCurStep(step);
  }, [step]);

  const handleClearAll = () => {
    store.dispatch(resetAutoStepState());
    setSubOptionSelected({ value: '', label: '' });
    setCurStep(step);
  };

  useEffect(() => {
    return () => {
      handleClearAll();
    };
  }, []);

  useEffect(() => {
    const newPickedData: LinkedOptionProps[] = [];

    attributes?.forEach((el) => {
      if (newPickedData?.length) {
        return;
      }

      el.subs.forEach((sub) => {
        if (sub.id === subOptionSelected.value && sub.basis.subs?.length) {
          newPickedData.push({
            id: sub.id,
            name: sub.name,
            subs: sub.basis.subs.map((item: any) => ({ ...item, replicate: item?.replicate ?? 1 })),
          });
        }
      });
    });

    store.dispatch(
      setLinkedOptionData({
        index: 0,
        pickedData: newPickedData,
        linkedData: [],
      }),
    );
  }, [subOptionSelected]);

  useEffect(() => {
    if (slideBar.includes('') || !pickedOptionIds?.length) {
      setDisabledCreateStep(true);
      return;
    }

    let isDisabledCreateStep = false;

    pickedOptionIds.forEach((_, index) => {
      if (!isDisabledCreateStep) {
        const newLinkedIds: string[] = flatMap(
          Object.values(pickedOptionIds[index]?.linkedIds).filter(Boolean),
        );

        if (!pickedOptionIds[index]?.pickedIds.length || !newLinkedIds.length) {
          isDisabledCreateStep = true;
        }
      }
    });

    setDisabledCreateStep(isDisabledCreateStep);
  }, [slideBar, JSON.stringify(pickedOptionIds)]);

  const handleGoToNextStep = () => {
    setCurStep(0);
  };

  const handleBackToSelectOption = () => {
    confirmModal({
      title: 'Are you sure go back to select option dataset?',
      content: 'You might lose all the relevant selection on each step',
      onOk: () => {
        store.dispatch(resetAutoStepState());
        setSubOptionSelected({ label: '', value: '' });

        /// go back to select option dataset
        setCurStep('pre');
      },
    });
  };

  const handleCreateStep = () => {
    const data = flatMap(linkedOptionData.map((el) => Object.values(el)));

    const newData: LinkedSubOptionProps[][] = data.map((el, index) => {
      if (index % 2 === 0) {
        return flatMap((el as LinkedOptionProps[]).map((item) => item.subs));
      } else {
        return flatMap(
          (el as AutoStepLinkedOptionResponse[]).map((item) =>
            flatMap(item.subs.map((sub) => sub.subs)),
          ),
        );
      }
    });

    const newLinkedOptionData: AutoStepOnAttributeGroupBody[] = newData.map((el, index) => {
      let order = index;
      ++order;

      const curSlideBarIdx =
        order === 1
          ? 0
          : order % 2 === 0
          ? Number((order / 2).toFixed())
          : Number((order / 2).toFixed()) - 1;

      const description = slideBar[curSlideBarIdx];

      const options: OptionReplicate[] = flatMap(
        el.map((item) => ({
          id: item.id,
          replicate: item?.replicate ?? 1,
        })),
      );

      return { name: description, order: order, options: options };
    });

    /// filter to get option selected
    const steps = newLinkedOptionData.map((el, index) => {
      let options: OptionReplicate[] = [];

      const pickedOptionIndex = parseInt(String(index / 2), 10);

      if (el.order % 2 !== 0) {
        options = el.options.filter((opt) => {
          return pickedOptionIds[pickedOptionIndex].pickedIds.includes(opt.id);
        });
      } else {
        const newLinkedIds: string[] = flatMap(
          Object.values(pickedOptionIds[pickedOptionIndex].linkedIds).filter(Boolean),
        );

        const preOptionIds = flatMap(
          Object.keys(pickedOptionIds[pickedOptionIndex].linkedIds).filter(Boolean),
        );

        const newOpt = el.options.filter((opt) => newLinkedIds.includes(opt.id));

        const newOptions: OptionReplicate[] = [];

        preOptionIds.forEach((item) => {
          newOpt.forEach((opt) => {
            if (pickedOptionIds[pickedOptionIndex].linkedIds[item]?.includes(opt.id)) {
              newOptions.push({ ...opt, pre_option: item });
            }
          });
        });

        options = newOptions;
      }

      return { ...el, options: options };
    });

    const newAttributeGroup = attributeGroup?.map((el) =>
      el.id === activeAttrGroupId?.['specification_attribute_groups']
        ? { ...el, steps: steps }
        : el,
    );

    console.log('newAttributeGroup', newAttributeGroup);

    store.dispatch(
      setPartialProductDetail({
        specification_attribute_groups: newAttributeGroup,
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
        curStep === 'pre' ? (
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
      {curStep === 'pre' ? (
        <FirstStep
          data={attributes}
          selected={subOptionSelected}
          setSelected={setSubOptionSelected}
        />
      ) : (
        <NextStep step={curStep} />
      )}
    </CustomModal>
  );
};
