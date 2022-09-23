import { FC, useEffect, useState } from 'react';

import { getSharingGroups } from '@/features/product/services';
import { getFinishScheduleList, getRequirementTypeList } from '@/features/project/services';
import { useBoolean } from '@/helper/hook';
import { getSelectedOptions } from '@/helper/utils';
import { snakeCase } from 'lodash';

import { CheckboxValue } from '../CustomCheckbox/types';
import { CustomRadioValue, RadioValue } from '../CustomRadio/types';
import { TabItem } from '../Tabs/types';
import { ProductItem } from '@/features/product/types';

import BrandProductBasicHeader from '../BrandProductBasicHeader';
import CollapseCheckboxList from '../CustomCheckbox/CollapseCheckboxList';
import CollapseRadioFormGroup from '../CustomRadio/CollapseRadioFormGroup';
import InputGroup from '../EntryForm/InputGroup';
import { FormGroup } from '../Form';
import { CustomTextArea } from '../Form/CustomTextArea';
import Popover from '../Modal/Popover';
import { renderDualLabel } from '../RenderHeaderLabel';
import { CustomTabs } from '../Tabs';
import styles from './index.less';

export enum TabKeys {
  inquiry = 'GENERAL INQUIRY',
  request = 'PROJECT REQUEST',
}

const Tabs: TabItem[] = [
  { tab: TabKeys.inquiry, key: TabKeys.inquiry },
  { tab: TabKeys.request, key: TabKeys.request },
];

export interface InquiryRequestForm {
  product_id: string;
  project_name_id: string;
  inquiry_for: string[];
  inquiry_title: string;
  inquiry_message: string;
  request_for: string[];
  request_title: string;
  request_message: string;
}

type FieldName = keyof InquiryRequestForm;
type checkboxDataTypes = 'inquiry_for' | 'request_for';

const DEFAULT_STATE = {
  product_id: '',
  project_name_id: '',
  inquiry_for: [],
  inquiry_title: '',
  inquiry_message: '',
  request_for: [],
  request_title: '',
  request_message: '',
};

interface InquiryRequestProps {
  product: ProductItem;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const InquiryRequest: FC<InquiryRequestProps> = ({ product, visible, setVisible }) => {
  const submitButtonStatus = useBoolean();
  const [selectedTab, setSelectedTab] = useState<TabKeys>(TabKeys.inquiry);

  const [data, setData] = useState<InquiryRequestForm>({
    ...DEFAULT_STATE,
    product_id: product.id,
  });

  const [projectNameData, setProjectNameData] = useState<CustomRadioValue[]>([]);
  // for handle selected item to show on label
  const [selectedProjectName, setSelectedProjectName] = useState<RadioValue | null>(null);
  const projectName = projectNameData.find(
    (project) => project.value === selectedProjectName?.value,
  )?.labelText;

  //
  const [inquiryForData, setInquiryForData] = useState<CheckboxValue[]>([]);
  const selectedInquiryFor = getSelectedOptions(inquiryForData, data.inquiry_for);

  //
  const [requestForData, setRequestForData] = useState<CheckboxValue[]>([]);
  const selectedRequestFor = getSelectedOptions(requestForData, data.request_for);

  useEffect(() => {
    getRequirementTypeList().then((res) => {
      setInquiryForData(
        res.map((el) => ({
          label: el.name,
          value: el.id,
        })),
      );
    });
  }, [selectedTab === TabKeys.inquiry]);

  useEffect(() => {
    getFinishScheduleList().then((res) => {
      setRequestForData(
        res.map((el) => ({
          label: el.name,
          value: el.id,
        })),
      );
    });

    getSharingGroups().then((res) => {
      if (res) {
        setProjectNameData(
          res.map((el) => ({
            label: renderDualLabel(el.name, el.name),
            value: el.id,
            labelText: `${el.name} ${el.name}`,
          })),
        );
      }
    });
  }, [selectedTab === TabKeys.request]);

  // handle onChange title and message
  const onChangeData = (newData: FieldName, fieldValue: any) => {
    setData((prevState) => ({
      ...prevState,
      [newData]: fieldValue,
    }));
  };

  // handle onChange Inquiry-For and Request-For
  const onChangeCheckboxListData = (type: checkboxDataTypes) => (option: CheckboxValue[]) => {
    console.log(type, option);
    setData((prevState) => ({
      ...prevState,
      [type]: option?.map((opt) => String(opt.value === 'other' ? opt.label : opt.value)),
    }));
  };

  // handle onChange Project-Name
  const onChangeProjectNameData = (selectedItem: RadioValue) => {
    setData((prevState) => ({
      ...prevState,
      project_name_id: String(selectedItem.value),
    }));
  };

  const handleSubmit = () => {};

  // render Inquiry For and Request For data
  const renderFor = (
    labelContent: 'Inquiry For' | 'Request For',
    option: CheckboxValue[],
    selectedOpt: CheckboxValue[],
  ) => (
    <FormGroup
      label={labelContent}
      required
      layout="vertical"
      formClass={`${styles.formGroup} ${selectedOpt.length ? styles.showSelectedItem : ''}`}>
      <CollapseCheckboxList
        checked={selectedOpt}
        onChange={onChangeCheckboxListData(snakeCase(labelContent) as checkboxDataTypes)}
        containerClass={selectedOpt.length ? styles.inputColor : undefined}
        otherInput
        options={option}
        placeholder={
          selectedOpt.length
            ? selectedOpt.map((item) => item.label).join(', ')
            : 'select from the list'
        }
      />
    </FormGroup>
  );

  const renderTitle = (title: 'inquiry_title' | 'request_title') => (
    <InputGroup
      label="Title"
      required
      deleteIcon
      fontLevel={3}
      hasPadding
      colorPrimaryDark
      hasBoxShadow
      hasHeight
      placeholder="type message title"
      value={data.inquiry_title}
      onChange={(e) => onChangeData(title, e.target.value)}
      onDelete={() => onChangeData(title, '')}
    />
  );

  const renderMessage = (message: 'inquiry_message' | 'request_message') => (
    <FormGroup label="Message" required layout="vertical">
      <CustomTextArea
        className={styles.message}
        maxLength={250}
        showCount
        placeholder="type message here..."
        borderBottomColor="mono-medium"
        boxShadow
        onChange={(e) => onChangeData(message, e.target.value)}
        value={data.inquiry_message}
      />
    </FormGroup>
  );

  return (
    <Popover
      title="INQUIRY/REQUEST"
      visible={visible}
      setVisible={setVisible}
      submitButtonStatus={submitButtonStatus.value}
      onFormSubmit={handleSubmit}>
      <BrandProductBasicHeader
        image={product.images?.[0] || product.image}
        logo={product.brand?.logo}
        text_1={product.brand_name || product.brand?.name}
        text_2={product.name}
        text_3={product.description}
        hasBoxShadow={true}
        customClass={styles.header}
      />

      {/* Tabs */}
      <CustomTabs
        listTab={Tabs}
        centered={true}
        tabPosition="top"
        tabDisplay="space"
        activeKey={selectedTab}
        onChange={(key) => setSelectedTab(key as TabKeys)}
      />

      {/* GENERAL INQUIRY */}
      {selectedTab === TabKeys.inquiry ? (
        <div>
          {/* Inquiry For */}
          {renderFor('Inquiry For', inquiryForData, selectedInquiryFor)}
          {renderTitle('inquiry_title')}
          {renderMessage('inquiry_message')}
        </div>
      ) : null}

      {/* PROJECT REQUEST */}
      {selectedTab === TabKeys.request ? (
        <div>
          {/* Project Name */}
          <CollapseRadioFormGroup
            label="Project Name"
            checked={data.project_name_id}
            defaultPlaceHolder="select from My Workspace"
            placeholder={projectName}
            onChange={(radioValue) => {
              /// to show on label
              setSelectedProjectName(radioValue);
              // update data
              onChangeProjectNameData(radioValue);
            }}
            optionData={projectNameData}
          />

          {/* Request For */}
          {renderFor('Request For', requestForData, selectedRequestFor)}
          {renderTitle('request_title')}
          {renderMessage('request_message')}
        </div>
      ) : null}
    </Popover>
  );
};

export default InquiryRequest;
