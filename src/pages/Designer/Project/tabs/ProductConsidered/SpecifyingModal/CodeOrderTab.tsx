import { FC, useEffect, useState } from 'react';

import { Col, Row, message } from 'antd';

import { ReactComponent as SingleRightFormIcon } from '@/assets/icons/single-right-form-icon.svg';

import {
  getInstructionTypeList,
  getRequirementTypeList,
  getUnitTypeList,
} from '@/features/project/services';
import { getAllMaterialCode } from '@/features/user-group/services';
import { useBoolean } from '@/helper/hook';
import { getSelectedOptions, validateFloatNumber } from '@/helper/utils';
import { forEach, isEmpty, lowerCase, startCase } from 'lodash';

import { FinishScheduleResponse } from './types';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { CustomRadioValue, RadioValue } from '@/components/CustomRadio/types';
import { FormGroupProps } from '@/components/Form/types';
import { setPartialProductSpecifiedData } from '@/features/product/reducers';
import { SpecifiedDetail } from '@/features/product/types';
import { OrderMethod } from '@/features/project/types';
import store, { useAppSelector } from '@/reducers';

import { CustomCheckbox } from '@/components/CustomCheckbox';
import { CustomRadio } from '@/components/CustomRadio';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { DropdownSelectInput } from '@/components/Form/DropdownSelectInput';
import { DualLabel } from '@/components/RenderHeaderLabel';
import { RobotoBodyText } from '@/components/Typography';
import { updateCustomProductSpecifiedDetail } from '@/pages/Designer/Products/CustomLibrary/slice';

import { ScheduleModal } from './ScheduleModal';
import styles from './styles/code-order.less';

const ORDER_METHODS: RadioValue[] = [
  {
    label: 'Direct Purchase',
    value: OrderMethod['Direct Purchase'],
  },
  {
    label: 'Custom Order',
    value: OrderMethod['Custom Order'],
  },
];

export interface CodeOrderTabProps {
  projectProductId: string;
  roomIds: string[];
  customProduct?: boolean;
}

export const getSelectedFinishSchedule = (finish_schedules: FinishScheduleResponse[]) => {
  const finishSchedulesData = finish_schedules?.map((el) => ({
    roomId: el.room_id_text,
    floor: el.floor,
    base: {
      ceiling: el.base.ceiling,
      floor: el.base.floor,
    },
    front_wall: el.front_wall,
    left_wall: el.left_wall,
    back_wall: el.back_wall,
    right_wall: el.right_wall,
    ceiling: el.ceiling,
    door: {
      frame: el.door.frame,
      panel: el.door.panel,
    },
    cabinet: {
      carcass: el.cabinet.carcass,
      door: el.cabinet.door,
    },
  }));

  /// get room's info chosen
  /* expected result(string): 

  roomId-1: Floor; roomId-2: Base ceiling + floor; roomId-3: Front Wall, Door frame + panel;

  */
  const finishScheduleLabels: string[] = [];

  finishSchedulesData.forEach((el) => {
    const finishScheduleTexts: any[] = [];
    const finishSchedulesChosen: string[] = [];

    /// Eg: floor, ceiling
    const mainRoomInfo: string[] = [];
    let mainRoomInfoLabel: string = '';

    /// Eg: { base: [ceiling, floor] }
    const dynamicRoomInfo: string[] = [];
    let dynamicRoomInfoLabel: string = '';

    forEach(el, (roomInfo, key) => {
      if (typeof roomInfo === 'boolean' && roomInfo === true) {
        finishScheduleTexts.push(startCase(key));
      }

      if (typeof roomInfo === 'object') {
        const roomItemInfo: string[] = [];
        forEach(roomInfo, (infoValue, infoKey) => {
          if (infoValue === true) {
            roomItemInfo.push(lowerCase(infoKey));
          }
        });

        if (!isEmpty(roomItemInfo)) {
          finishScheduleTexts.push({ [startCase(key)]: roomItemInfo });
        }
      }
    });

    if (!isEmpty(finishScheduleTexts)) {
      finishScheduleTexts.forEach((item) => {
        if (typeof item === 'string') {
          mainRoomInfo.push(item);
        }

        /// Eg: Base ceiling + floor
        if (typeof item === 'object') {
          forEach(item, (itemValues: string[], itemKey) => {
            dynamicRoomInfo.push(`${itemKey} ${itemValues.join(' + ')}`);
          });
        }
      });

      if (!isEmpty(mainRoomInfo)) {
        mainRoomInfoLabel = mainRoomInfo.join(', ');
        finishSchedulesChosen.push(mainRoomInfoLabel);
      }
      if (!isEmpty(dynamicRoomInfo)) {
        dynamicRoomInfoLabel = dynamicRoomInfo.join(', ');
        finishSchedulesChosen.push(dynamicRoomInfoLabel);
      }

      const finishSchedulesLabel = `${el.roomId}: ${finishSchedulesChosen.join(', ')};`;

      finishScheduleLabels.push(finishSchedulesLabel);
    }
  });

  return finishScheduleLabels;
};

const CodeOrderTab: FC<CodeOrderTabProps> = ({ projectProductId, roomIds, customProduct }) => {
  const scheduleModal = useBoolean(false);

  const [materialCodeOpts, setMaterialCodeOtps] = useState<CustomRadioValue[]>([]);
  const [unitTypeOtps, setUnitTypeOtps] = useState<CheckboxValue[]>([]);
  const [requirements, setRequirements] = useState<CheckboxValue[]>([]);
  const [instructions, setInstructions] = useState<CheckboxValue[]>([]);

  const [selectedUnit, setSelectedUnit] = useState<RadioValue | null>(null);

  const specifiedDetail = useAppSelector((state) =>
    customProduct
      ? state.customProduct.details.specifiedDetail || ({} as SpecifiedDetail)
      : state.product.details.specifiedDetail || ({} as SpecifiedDetail),
  );

  const {
    description,
    material_code_id,
    order_method,
    quantity,
    suffix_code,
    unit_type_id,
    special_instructions = [],
    instruction_type_ids = [],
    requirement_type_ids = [],
    finish_schedules = [],
  } = specifiedDetail;

  const finishScheduleLabel = getSelectedFinishSchedule(finish_schedules);

  useEffect(() => {
    getAllMaterialCode().then((res) => {
      setMaterialCodeOtps(
        res.map((el) => ({
          label: <DualLabel firstTxt={el.code} secTxt={el.description} />,

          value: el.id,
          labelText: `${el.code}`,
        })),
      );
    });

    getUnitTypeList().then((res) => {
      setUnitTypeOtps(
        res.map((el) => ({
          label: el.name,
          value: el.id,
        })),
      );
    });

    getInstructionTypeList().then((res) => {
      setInstructions(
        res.map((el) => ({
          label: el.name,
          value: el.id,
        })),
      );
    });

    getRequirementTypeList().then((res) => {
      setRequirements(
        res.map((el) => ({
          label: el.name,
          value: el.id,
        })),
      );
    });
  }, []);

  const selectedInstructions = getSelectedOptions(instructions, instruction_type_ids);
  const selectedRequirements = getSelectedOptions(requirements, requirement_type_ids);

  const unitType = unit_type_id
    ? unitTypeOtps.find((el) => el.value === unit_type_id) || selectedUnit
    : undefined;

  const materialCode = material_code_id
    ? materialCodeOpts.find((el) => el.value === material_code_id)
    : undefined;

  const onChangeState = (newState: Partial<SpecifiedDetail>) => {
    if (customProduct) {
      store.dispatch(updateCustomProductSpecifiedDetail(newState));
    } else {
      store.dispatch(setPartialProductSpecifiedData(newState));
    }
  };

  const formGroupProps: Partial<FormGroupProps> = {
    layout: 'vertical',
    style: { marginBottom: 0 },
  };

  if (!specifiedDetail.id) {
    return null;
  }

  return (
    <div style={{ paddingTop: '16px' }}>
      <Row gutter={[24, 8]} align="bottom">
        <Col span={12}>
          <FormGroup label="Material/Product Code" labelFontSize={4} required {...formGroupProps}>
            <DropdownSelectInput
              placeholder="select from the list"
              borderBottomColor="light"
              value={materialCode?.labelText}
              disabled
              containerClass={styles.inputColor}
              overlay={
                <CustomRadio
                  options={materialCodeOpts}
                  isRadioList
                  value={material_code_id}
                  onChange={(e) =>
                    onChangeState({
                      material_code_id: String(e.value),
                    })
                  }
                />
              }
            />
          </FormGroup>
        </Col>

        <Col span={12}>
          <CustomInput
            placeholder="suffix e.g.1,2../a,b.."
            borderBottomColor="light"
            value={suffix_code}
            onChange={(e) => onChangeState({ suffix_code: e.target.value })}
            containerClass={styles.inputColor}
          />
        </Col>

        <Col span={24}>
          <FormGroup label="Description" labelFontSize={4} required {...formGroupProps}>
            <CustomInput
              placeholder="e.g. Living room coffee table..."
              borderBottomColor="light"
              value={description}
              onChange={(e) => onChangeState({ description: e.target.value })}
              containerClass={styles.inputColor}
            />
          </FormGroup>
        </Col>

        <Col span={24}>
          <FormGroup
            label="Define Finish Schedule (appliable for Room Schedule only)"
            labelFontSize={4}
            {...formGroupProps}>
            <div
              className={`flex-between cursor-pointer ${styles.schedule}`}
              onClick={() => {
                if (!materialCode) {
                  message.error('Material Code is required');
                  return;
                }
                if (!description) {
                  scheduleModal.setValue(false);
                  message.error('Description is required');
                  return;
                }
                scheduleModal.setValue(true);
              }}>
              <div
                className={styles.label}
                title={finishScheduleLabel?.map((item) => item).join(' ')}>
                {!isEmpty(finishScheduleLabel) ? (
                  finishScheduleLabel.map((item) => (
                    <RobotoBodyText
                      level={6}
                      color="primary-color-dark"
                      style={{ paddingRight: 8 }}>
                      {item}
                    </RobotoBodyText>
                  ))
                ) : (
                  <RobotoBodyText level={6} color="mono-color-medium">
                    {'e.g. Floor, base, wall, ceiling, door, cabinet...'}
                  </RobotoBodyText>
                )}
              </div>
              <div className="flex-start">
                <SingleRightFormIcon />
              </div>
            </div>
          </FormGroup>
        </Col>

        <Col span={12}>
          <FormGroup label="Quantity/Unit Type" labelFontSize={4} {...formGroupProps}>
            <CustomInput
              borderBottomColor="light"
              value={quantity}
              onChange={(e) => onChangeState({ quantity: Number(e.target.value) })}
              inputValidation={validateFloatNumber}
              containerClass={styles.inputColor}
            />
          </FormGroup>
        </Col>
        <Col span={12}>
          <div style={{ position: 'relative' }}>
            <DropdownSelectInput
              placeholder="unit type"
              borderBottomColor="light"
              value={unitType?.label ? String(unitType?.label) : ''}
              noPadding
              disabled
              containerClass={styles.inputColor}
              overlay={
                <CustomRadio
                  options={unitTypeOtps}
                  isRadioList
                  inputPlaceholder="please specify"
                  value={unit_type_id}
                  otherInput
                  containerClass={`${styles.inputColor} ${styles.fontSizeSmall} ${styles.inputBorderBottom}`}
                  otherStickyBottom
                  stickyTopItem
                  containerStyle={{ padding: 0 }}
                  onChange={(e) => {
                    setSelectedUnit(e);
                    onChangeState({
                      unit_type_id: String(e.value === 'other' ? e.label : e.value),
                    });
                  }}
                />
              }
            />
          </div>
        </Col>

        {/* Default value is Direct Purchase */}
        <Col span={24}>
          <FormGroup
            label="Order Method"
            labelFontSize={4}
            formClass={styles.borderBottom}
            {...formGroupProps}>
            <CustomRadio
              direction="horizontal"
              containerClass={styles.fontSizeSmall}
              options={ORDER_METHODS}
              value={order_method}
              onChange={(e) =>
                onChangeState({
                  order_method: Number(e.value),
                })
              }
            />
          </FormGroup>
        </Col>

        <Col span={24}>
          <FormGroup
            label="Approval requirements prior to fabrication"
            formClass={`${styles.fontSizeSmall} ${styles.borderBottom} ${styles.inputBorderBottom}`}
            labelFontSize={4}
            {...formGroupProps}>
            <CustomCheckbox
              options={requirements}
              selected={selectedRequirements}
              onChange={(options) => {
                onChangeState({
                  requirement_type_ids: options.map((opt) =>
                    String(opt.value === 'other' ? opt.label : opt.value),
                  ),
                });
              }}
              otherInput
              checkboxClass={styles.inputColor}
              isCheckboxList
              inputPlaceholder="please specify"
              heightItem="36px"
              style={{ paddingLeft: 16, paddingTop: 4 }}
            />
          </FormGroup>
        </Col>

        <Col span={24}>
          <FormGroup
            label="General Instructions"
            formClass={`${styles.fontSizeSmall} ${styles.borderBottom}`}
            labelFontSize={4}
            {...formGroupProps}>
            <CustomCheckbox
              isCheckboxList
              options={instructions}
              selected={selectedInstructions}
              onChange={(options) => {
                onChangeState({
                  instruction_type_ids: options.map((opt) =>
                    String(opt.value === 'other' ? opt.label : opt.value),
                  ),
                });
              }}
              heightItem="36px"
              style={{ paddingLeft: 16, paddingTop: 4 }}
            />
          </FormGroup>
        </Col>

        <Col span={24}>
          <FormGroup label="Special Instructions" labelFontSize={4} {...formGroupProps}>
            <CustomTextArea
              customClass={styles.inputColor}
              placeholder="type here..."
              borderBottomColor="light"
              showCount
              maxLength={250}
              value={special_instructions}
              onChange={(e) => onChangeState({ special_instructions: e.target.value })}
            />
          </FormGroup>
        </Col>
      </Row>

      <ScheduleModal
        visible={scheduleModal.value}
        setVisible={(visible) => (visible ? undefined : scheduleModal.setValue(false))}
        materialCode={`${materialCode?.labelText} ${suffix_code}`}
        description={description}
        projectProductId={projectProductId}
        roomIds={roomIds}
        customProduct={customProduct}
      />
    </div>
  );
};
export default CodeOrderTab;
