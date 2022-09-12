import { FC, useEffect, useState } from 'react';

import { Col, Row } from 'antd';

import {
  getFinishScheduleList,
  getInstructionTypeList,
  getRequirementTypeList,
  getUnitTypeList,
} from '@/features/project/services';
import { getAllMaterialCode } from '@/features/user-group/services';
import { validateFloatNumber } from '@/helper/utils';

import { CodeOrderRequestParams, OnChangeSpecifyingProductFnc } from './types';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { RadioValue } from '@/components/CustomRadio/types';
import { FormGroupProps } from '@/components/Form/types';

import { CustomCheckbox } from '@/components/CustomCheckbox';
import { CustomRadio } from '@/components/CustomRadio';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { DropdownSelectInput } from '@/components/Form/DropdownSelectInput';
import { BodyText, Title } from '@/components/Typography';

import styles from './styles/code-order.less';

const ORDER_METHODS: RadioValue[] = [
  {
    label: 'Direct Purchase',
    value: 1,
  },
  {
    label: 'Custom Order',
    value: 2,
  },
];

type CustomRadioValue = RadioValue & { labelText: string };

interface CodeOrderTabProps {
  codeOrderState: CodeOrderRequestParams;
  onChangeSpecifyingState: OnChangeSpecifyingProductFnc;
}

const getSelectedOptions = (options: CheckboxValue[], selectedIds: string[]) =>
  options.filter((opt) => selectedIds.includes(String(opt.value)) || opt.value === 'other');

const CodeOrderTab: FC<CodeOrderTabProps> = ({ codeOrderState, onChangeSpecifyingState }) => {
  const [materialCodeOpts, setMaterialCodeOtps] = useState<CustomRadioValue[]>([]);
  const [unitTypeOtps, setUnitTypeOtps] = useState<CheckboxValue[]>([]);
  const [requirements, setRequirements] = useState<CheckboxValue[]>([]);
  const [instructions, setInstructions] = useState<CheckboxValue[]>([]);

  // for show data
  const [finishSchedules, setFinishSchedule] = useState<CheckboxValue[]>([]);
  /// get option selected
  const [selectedFinishSchedules, setSelectedFinishSchedule] = useState<CheckboxValue[]>([]);

  const [selectedUnit, setSelectedUnit] = useState<RadioValue | null>(null);

  const {
    description,
    material_code_id,
    order_method,
    quantity,
    suffix_code,
    unit_type_id,
    special_instructions,
    instruction_type_ids,
    requirement_type_ids,
    finish_schedules,
  } = codeOrderState;

  const selectedInstructions = getSelectedOptions(instructions, instruction_type_ids);
  const selectedRequirements = getSelectedOptions(requirements, requirement_type_ids);
  const selectedFinishScheduleOpts = getSelectedOptions(finishSchedules, finish_schedules);

  const unitType = unit_type_id
    ? unitTypeOtps.find((el) => el.value === unit_type_id) || selectedUnit
    : undefined;

  const materialCode = material_code_id
    ? materialCodeOpts.find((el) => el.value === material_code_id)
    : undefined;

  const renderDualLabel = (firstTxt: string, secTxt: string) => {
    return (
      <span className="flex-center">
        <Title level={9} style={{ width: 32, marginRight: 12 }}>
          {firstTxt}
        </Title>
        <BodyText fontFamily="Roboto" level={6}>
          {secTxt}
        </BodyText>
      </span>
    );
  };

  useEffect(() => {
    getAllMaterialCode().then((res) => {
      setMaterialCodeOtps(
        res.map((el) => ({
          label: renderDualLabel(el.code, el.description),
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

    getFinishScheduleList().then((res) => {
      setFinishSchedule(
        res.map((el) => ({
          label: el.name,
          value: el.id,
        })),
      );
    });
  }, []);

  const getFinishSchedules = (opts: CheckboxValue[]) => {
    const newSelectedSchedules = opts.filter((type) => type.value !== 'other').map((type) => type);

    const otherFinishSchedules = opts.find((type) => type.value === 'other');
    if (otherFinishSchedules) {
      newSelectedSchedules.push({
        label: otherFinishSchedules.label,
        value: otherFinishSchedules.value,
      });
    }

    return newSelectedSchedules;
  };

  const formGroupProps: Partial<FormGroupProps> = {
    layout: 'vertical',
    style: { marginBottom: 0 },
  };

  return (
    <div style={{ padding: '16px 0' }}>
      <Row gutter={[24, 8]} align="bottom">
        <Col span={12}>
          <FormGroup label="Material/Product Code" {...formGroupProps}>
            <DropdownSelectInput
              placeholder="select from the list"
              borderBottomColor="light"
              value={materialCode?.labelText}
              disabled
              containerClass={styles.color}
              overlay={
                <CustomRadio
                  options={materialCodeOpts}
                  isRadioList
                  value={material_code_id}
                  onChange={(e) =>
                    onChangeSpecifyingState({
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
            onChange={(e) => onChangeSpecifyingState({ suffix_code: e.target.value })}
            containerClass={styles.color}
          />
        </Col>

        <Col span={24}>
          <FormGroup label="Description" {...formGroupProps}>
            <CustomInput
              placeholder="e.g. Living room coffee table..."
              borderBottomColor="light"
              value={description}
              onChange={(e) => onChangeSpecifyingState({ description: e.target.value })}
              containerClass={styles.color}
            />
          </FormGroup>
        </Col>

        <Col span={24}>
          <FormGroup label="Finish Schedule For (if appliable)" {...formGroupProps}>
            <DropdownSelectInput
              borderBottomColor="light"
              noPadding
              disabled
              containerClass={styles.color}
              overlayClass={styles.overlayForm}
              placement="bottomRight"
              placeholder={
                selectedFinishScheduleOpts?.length === 0
                  ? 'e.g. Wall, base, ceiling, door...'
                  : selectedFinishScheduleOpts?.map((opt) => opt.label).join(', ')
              }
              value={selectedFinishSchedules?.map((opt) =>
                String(opt.value === 'other' ? opt.value : opt.label),
              )}
              overlayStyle={{ minWidth: 'auto' }}
              overlay={
                <CustomCheckbox
                  options={finishSchedules}
                  inputPlaceholder="please specify"
                  isCheckboxList
                  otherInput
                  checkboxClass={styles.color}
                  selected={selectedFinishScheduleOpts}
                  onChange={(option) => {
                    setSelectedFinishSchedule(getFinishSchedules(option));
                    onChangeSpecifyingState({
                      finish_schedules: option?.map((opt) =>
                        String(opt.value === 'other' ? opt.label : opt.value),
                      ),
                    });
                  }}
                />
              }
            />
          </FormGroup>
        </Col>

        <Col span={12}>
          <FormGroup label="Quantity/Unit Type" {...formGroupProps}>
            <CustomInput
              borderBottomColor="light"
              value={quantity}
              onChange={(e) => onChangeSpecifyingState({ quantity: e.target.value })}
              inputValidation={validateFloatNumber}
              containerClass={styles.color}
            />
          </FormGroup>
        </Col>
        <Col span={12}>
          <DropdownSelectInput
            placeholder="unit type"
            borderBottomColor="light"
            value={unitType?.label ? String(unitType?.label) : ''}
            noPadding
            disabled
            containerClass={styles.color}
            overlay={
              <CustomRadio
                options={unitTypeOtps}
                isRadioList
                inputPlaceholder="please specify"
                value={unit_type_id}
                otherInput
                containerClass={styles.color}
                otherStickyBottom
                stickyTopItem
                containerStyle={{ padding: 0 }}
                onChange={(e) => {
                  setSelectedUnit(e);
                  onChangeSpecifyingState({
                    unit_type_id: String(e.value === 'other' ? e.label : e.value),
                  });
                }}
              />
            }
          />
        </Col>

        {/* Default value is Direct Purchase */}
        <Col span={24}>
          <FormGroup label="Order Method" {...formGroupProps}>
            <CustomRadio
              direction="horizontal"
              options={ORDER_METHODS}
              value={order_method}
              onChange={(e) =>
                onChangeSpecifyingState({
                  order_method: Number(e.value),
                })
              }
            />
          </FormGroup>
        </Col>

        <Col span={24}>
          <FormGroup label="Approval requirements prior to fabrication" {...formGroupProps}>
            <CustomCheckbox
              options={requirements}
              selected={selectedRequirements}
              onChange={(options) => {
                onChangeSpecifyingState({
                  requirement_type_ids: options.map((opt) =>
                    String(opt.value === 'other' ? opt.label : opt.value),
                  ),
                });
              }}
              otherInput
              checkboxClass={styles.color}
              isCheckboxList
              inputPlaceholder="please specify"
              heightItem="36px"
              style={{ paddingLeft: 16, paddingTop: 4 }}
            />
          </FormGroup>
        </Col>

        <Col span={24}>
          <FormGroup label="General Instructions" {...formGroupProps}>
            <CustomCheckbox
              isCheckboxList
              options={instructions}
              selected={selectedInstructions}
              onChange={(options) => {
                onChangeSpecifyingState({
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
          <FormGroup label="Special Instructions" {...formGroupProps}>
            <CustomTextArea
              placeholder="type here..."
              borderBottomColor="light"
              showCount
              maxLength={250}
              value={special_instructions}
              onChange={(e) => onChangeSpecifyingState({ special_instructions: e.target.value })}
            />
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
};
export default CodeOrderTab;
