import { useEffect, useState } from 'react';

import { Col, Row } from 'antd';

import {
  getFinishScheduleList,
  getInstructionTypeList,
  getRequirementTypeList,
  getUnitTypeList,
} from '@/features/project/services';
import { getAllMaterialCode } from '@/features/user-group/services';
import { getSelectedOptions, validateFloatNumber } from '@/helper/utils';

import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { RadioValue } from '@/components/CustomRadio/types';
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
import { BodyText, Title } from '@/components/Typography';

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

type CustomRadioValue = RadioValue & { labelText: string };

const CodeOrderTab = () => {
  const [materialCodeOpts, setMaterialCodeOtps] = useState<CustomRadioValue[]>([]);
  const [unitTypeOtps, setUnitTypeOtps] = useState<CheckboxValue[]>([]);
  const [requirements, setRequirements] = useState<CheckboxValue[]>([]);
  const [instructions, setInstructions] = useState<CheckboxValue[]>([]);
  const [finishSchedules, setFinishSchedule] = useState<CheckboxValue[]>([]);

  const [selectedUnit, setSelectedUnit] = useState<RadioValue | null>(null);

  const specifiedDetail = useAppSelector((state) => state.product.details.specifiedDetail);

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

  if (!specifiedDetail) {
    return null;
  }

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

  const selectedInstructions = getSelectedOptions(instructions, instruction_type_ids);
  const selectedRequirements = getSelectedOptions(requirements, requirement_type_ids);
  const selectedFinishSchedules = getSelectedOptions(finishSchedules, finish_schedules);

  const unitType = unit_type_id
    ? unitTypeOtps.find((el) => el.value === unit_type_id) || selectedUnit
    : undefined;

  const materialCode = material_code_id
    ? materialCodeOpts.find((el) => el.value === material_code_id)
    : undefined;

  const scheduleValues = finish_schedules
    .filter((item, index) => finish_schedules.indexOf(item) === index)
    ?.map((schId) => finishSchedules.find((el) => el.value === schId)?.label || schId)
    .join(', ');

  const onChangeState = (newState: Partial<SpecifiedDetail>) => {
    store.dispatch(setPartialProductSpecifiedData(newState));
  };

  const formGroupProps: Partial<FormGroupProps> = {
    layout: 'vertical',
    style: { marginBottom: 0 },
  };

  return (
    <div style={{ padding: '16px 0' }}>
      <Row gutter={[24, 8]} align="bottom">
        <Col span={12}>
          <FormGroup label="Material/Product Code" required {...formGroupProps}>
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
          <FormGroup label="Description" required {...formGroupProps}>
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
          <FormGroup label="Finish Schedule For (if appliable)" {...formGroupProps}>
            <DropdownSelectInput
              borderBottomColor="light"
              noPadding
              disabled
              containerClass={styles.inputColor}
              overlayClass={styles.overlayForm}
              placement="bottomRight"
              placeholder={'e.g. Wall, base, ceiling, door...'}
              value={scheduleValues}
              overlayStyle={{ minWidth: 'unset' }}
              overlay={
                <CustomCheckbox
                  options={finishSchedules}
                  inputPlaceholder="please specify"
                  isCheckboxList
                  otherInput
                  checkboxClass={styles.inputColor}
                  selected={selectedFinishSchedules}
                  onChange={(option) => {
                    onChangeState({
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
              onChange={(e) => onChangeState({ quantity: Number(e.target.value) })}
              inputValidation={validateFloatNumber}
              containerClass={styles.inputColor}
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
            containerClass={styles.inputColor}
            overlay={
              <CustomRadio
                options={unitTypeOtps}
                isRadioList
                inputPlaceholder="please specify"
                value={unit_type_id}
                otherInput
                containerClass={styles.inputColor}
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
        </Col>

        {/* Default value is Direct Purchase */}
        <Col span={24}>
          <FormGroup label="Order Method" {...formGroupProps}>
            <CustomRadio
              direction="horizontal"
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
          <FormGroup label="Approval requirements prior to fabrication" {...formGroupProps}>
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
          <FormGroup label="General Instructions" {...formGroupProps}>
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
          <FormGroup label="Special Instructions" {...formGroupProps}>
            <CustomTextArea
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
    </div>
  );
};
export default CodeOrderTab;
