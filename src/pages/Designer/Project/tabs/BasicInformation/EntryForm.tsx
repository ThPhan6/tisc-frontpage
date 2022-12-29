import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';

import {
  getProjectBuildingTypes,
  getProjectMeasurementUnits,
  getProjectTypes,
} from '@/features/project/services';
import { isEmptySpace, messageError, messageErrorType, validatePostalCode } from '@/helper/utils';

import type { RadioValue } from '@/components/CustomRadio/types';
import type { ProjectBodyRequest } from '@/features/project/types';
import type { GeneralData } from '@/types';

import { CustomRadio } from '@/components/CustomRadio';
import CollapseRadioList from '@/components/CustomRadio/CollapseRadioList';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import DateInput from '@/components/Form/DateInput';
import CityModal from '@/features/locations/components/CityModal';
import CountryModal from '@/features/locations/components/CountryModal';
import StateModal from '@/features/locations/components/StateModal';

import styles from '../../styles/basic-information.less';

interface BasicInformationEntryFormProps {
  data: ProjectBodyRequest;
  onChangeData: (newDate: Partial<ProjectBodyRequest>) => void;
}

export const EntryForm: FC<BasicInformationEntryFormProps> = ({ data, onChangeData }) => {
  // for content type modal
  const [visible, setVisible] = useState({
    country: false,
    state: false,
    city: false,
  });

  const [buildingTypes, setBuildingTypes] = useState<GeneralData[]>([]);
  const [projectTypes, setProjectTypes] = useState<GeneralData[]>([]);
  const [measurementUnits, setMeasurementUnits] = useState<RadioValue[]>([]);

  const countryData: RadioValue = {
    label: data.country_name,
    value: data.country_id,
  };

  const stateData: RadioValue = {
    label: data.state_name,
    value: data.state_id,
  };

  const cityData: RadioValue = {
    label: data.city_name,
    value: data.city_id,
  };

  // handle onchange postal code
  const onChangePostalCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    // only 10 chars and cannot type space
    if (!validatePostalCode(e.target.value) || !isEmptySpace(e.target.value)) {
      return;
    }
    onChangeData({
      postal_code: e.target.value,
    });
  };

  useEffect(() => {
    getProjectBuildingTypes().then(setBuildingTypes);
    getProjectTypes().then(setProjectTypes);
    getProjectMeasurementUnits().then((res) => {
      setMeasurementUnits(
        res.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        }),
      );
    });
  }, []);

  // format data
  const buildingTypeData = buildingTypes.find(
    (buildingType) => buildingType.id === data.building_type_id,
  ) ?? {
    name: data.building_type_id,
    id: '',
  };
  const projectTypeData = projectTypes.find(
    (projectType) => projectType.id === data.project_type_id,
  ) ?? {
    name: data.project_type_id,
    id: '',
  };

  return (
    <div className={styles.entryFormWrapper}>
      <InputGroup
        label="Project Code"
        required
        deleteIcon
        fontLevel={3}
        value={data.code}
        hasPadding
        colorPrimaryDark
        hasBoxShadow
        hasHeight
        onChange={(e) => onChangeData({ code: e.target.value })}
        onDelete={() => onChangeData({ code: '' })}
        placeholder="type here"
      />
      <InputGroup
        label="Project Name"
        required
        deleteIcon
        fontLevel={3}
        value={data.name}
        hasPadding
        colorPrimaryDark
        hasBoxShadow
        hasHeight
        onChange={(e) => onChangeData({ name: e.target.value })}
        onDelete={() => onChangeData({ name: '' })}
        placeholder="type here"
      />

      <InputGroup
        label="Country Location"
        required
        fontLevel={3}
        value={countryData.label?.toString()}
        hasPadding
        colorPrimaryDark
        hasBoxShadow
        hasHeight
        rightIcon
        onRightIconClick={() =>
          setVisible({
            city: false,
            state: false,
            country: true,
          })
        }
        placeholder="country list"
      />
      <InputGroup
        label="State / Province"
        required
        fontLevel={3}
        value={stateData.label?.toString()}
        hasPadding
        colorPrimaryDark
        hasBoxShadow
        hasHeight
        rightIcon
        disabled={data.country_id === '-1' || data.country_id === ''}
        onRightIconClick={() =>
          setVisible({
            city: false,
            state: true,
            country: false,
          })
        }
        placeholder="select from the list"
      />
      <InputGroup
        label="City / Town"
        required
        fontLevel={3}
        value={cityData.label?.toString()}
        hasPadding
        colorPrimaryDark
        hasBoxShadow
        hasHeight
        rightIcon
        disabled={data.state_id === ''}
        onRightIconClick={() =>
          setVisible({
            city: true,
            state: false,
            country: false,
          })
        }
        placeholder="select from the list"
      />

      <FormGroup label="Address" required layout="vertical">
        <CustomTextArea
          className={styles.address}
          maxLength={100}
          showCount
          placeholder="type here"
          borderBottomColor="mono-medium"
          onChange={(e) => onChangeData({ address: e.target.value })}
          value={data.address}
          boxShadow
        />
      </FormGroup>
      <InputGroup
        label="Postal / Zip Code"
        placeholder="postal / zip code"
        required
        deleteIcon
        fontLevel={3}
        value={data.postal_code}
        hasPadding
        colorPrimaryDark
        hasBoxShadow
        hasHeight
        onChange={onChangePostalCode}
        onDelete={() => onChangeData({ postal_code: '' })}
        message={messageError(data.postal_code, MESSAGE_ERROR.POSTAL_CODE, 10)}
        messageType={messageErrorType(data.postal_code, 10, 'error', 'normal')}
      />

      <FormGroup
        label="Project Type"
        required
        layout="vertical"
        formClass={`${styles.formGroup} ${projectTypeData.name !== '' ? styles.activeText : ''}`}>
        <CollapseRadioList
          groupType="project-basic-info"
          groupIndex={1}
          options={projectTypes.map((projectType) => {
            return {
              label: projectType.name,
              value: projectType.id,
            };
          })}
          checked={data.project_type_id}
          onChange={(checkedItem) => {
            onChangeData({
              project_type_id: String(
                checkedItem.value === 'other' ? checkedItem.label : checkedItem.value,
              ),
            });
          }}
          placeholder={projectTypeData.name === '' ? 'select from list' : projectTypeData.name}
          otherInput
        />
      </FormGroup>
      <FormGroup
        label="Building Type"
        required
        layout="vertical"
        formClass={`${styles.formGroup} ${buildingTypeData.name !== '' ? styles.activeText : ''}`}>
        <CollapseRadioList
          groupType="project-basic-info"
          groupIndex={2}
          options={buildingTypes.map((buildingType) => {
            return {
              label: buildingType.name,
              value: buildingType.id,
            };
          })}
          checked={data.building_type_id}
          onChange={(checkedItem) => {
            onChangeData({
              building_type_id: String(
                checkedItem.value === 'other' ? checkedItem.label : checkedItem.value,
              ),
            });
          }}
          placeholder={buildingTypeData.name === '' ? 'select from list' : buildingTypeData.name}
          otherInput
        />
      </FormGroup>

      <FormGroup
        label="Measurement Unit"
        required={true}
        layout="vertical"
        formClass={`${styles.form_group} ${styles.border_bottom}`}>
        <CustomRadio
          options={measurementUnits}
          value={data.measurement_unit}
          onChange={(selectedValue) =>
            onChangeData({ measurement_unit: Number(selectedValue.value) })
          }
        />
      </FormGroup>

      <FormGroup label="Design Due" required layout="vertical" formClass={styles.formGroup}>
        <DateInput
          value={data.design_due}
          onChange={(date) => onChangeData({ design_due: date?.format('YYYY-MM-DD') ?? '' })}
        />
      </FormGroup>
      <FormGroup label="Construction Start" required layout="vertical" formClass={styles.formGroup}>
        <DateInput
          value={data.construction_start}
          onChange={(date) =>
            onChangeData({ construction_start: date?.format('YYYY-MM-DD') ?? '' })
          }
        />
      </FormGroup>

      <CountryModal
        visible={visible.country}
        setVisible={(status) =>
          setVisible({
            city: false,
            state: false,
            country: status,
          })
        }
        chosenValue={countryData}
        setChosenValue={(v) =>
          onChangeData({
            country_id: v.value,
            country_name: String(v.label),
          })
        }
        withPhoneCode
        hasGlobal={false}
      />
      <StateModal
        countryId={data.country_id}
        visible={visible.state}
        setVisible={(status) =>
          setVisible({
            city: false,
            state: status,
            country: false,
          })
        }
        chosenValue={stateData}
        setChosenValue={(v) =>
          onChangeData({
            state_id: v.value,
            state_name: String(v.label),
          })
        }
      />

      <CityModal
        stateId={data.state_id}
        countryId={data.country_id}
        visible={visible.city}
        setVisible={(status) =>
          setVisible({
            city: status,
            state: false,
            country: false,
          })
        }
        chosenValue={cityData}
        setChosenValue={(v) =>
          onChangeData({
            city_id: v.value,
            city_name: String(v.label),
          })
        }
      />
    </div>
  );
};
