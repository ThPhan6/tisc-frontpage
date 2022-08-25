import { FC, useEffect, useState } from 'react';

import { Col, Row } from 'antd';

import {
  getInstructionTypeList,
  getRequirementTypeList,
  getUnitTypeList,
} from '@/features/project/services';
import { getAllMaterialCode } from '@/features/user-group/services';

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
  } = codeOrderState;

  const selectedInstructions = getSelectedOptions(instructions, instruction_type_ids);
  const selectedRequirements = getSelectedOptions(requirements, requirement_type_ids);

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
          labelText: `${el.description} (${el.code})`,
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
          />
        </Col>

        <Col span={24}>
          <FormGroup label="Description" {...formGroupProps}>
            <CustomInput
              placeholder="e.g. Living room coffee table..."
              borderBottomColor="light"
              value={description}
              onChange={(e) => onChangeSpecifyingState({ description: e.target.value })}
            />
          </FormGroup>
        </Col>

        <Col span={12}>
          <FormGroup label="Quantity/Unit Type" {...formGroupProps}>
            <CustomInput
              borderBottomColor="light"
              type="number"
              step={1}
              min={1}
              value={quantity || 1}
              onChange={(e) => onChangeSpecifyingState({ quantity: Number(e.target.value) })}
            />
          </FormGroup>
        </Col>
        <Col span={12}>
          <DropdownSelectInput
            placeholder="unit type"
            borderBottomColor="light"
            value={unitType?.label ? String(unitType?.label) : ''}
            noPadding
            overlay={
              <CustomRadio
                options={unitTypeOtps}
                isRadioList
                inputPlaceholder="please specify"
                value={unit_type_id}
                otherInput
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
