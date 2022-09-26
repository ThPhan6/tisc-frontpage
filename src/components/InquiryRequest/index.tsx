import { FC, useEffect, useState } from 'react';

import {
  createInquiryRequest,
  getInquiryFor,
  getProjectName,
  getRequestFor,
} from '@/features/product/services';
import { useBoolean } from '@/helper/hook';
import { getValueByCondition } from '@/helper/utils';

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

export interface ProjectName {
  id: string;
  code: string;
  name: string;
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
  // to show on label
  const [selectedProjectName, setSelectedProjectName] = useState<RadioValue | null>(null);
  const projectNameLabel = projectNameData.find(
    (project) => project.value === selectedProjectName?.value,
  )?.labelText;

  console.log('data', data);

  //
  const [inquiryForData, setInquiryForData] = useState<CheckboxValue[]>([]);
  const [selectedInquiryFor, setSelectedInquiryFor] = useState<CheckboxValue[]>([]); // for show on placeholder
  //
  const [requestForData, setRequestForData] = useState<CheckboxValue[]>([]);
  const [selectedRequestFor, setSelectedRequestFor] = useState<CheckboxValue[]>([]); // for show on placeholder

  /// handle to show on placeholder
  const selectedItem = (onPlaceholder: checkboxDataTypes) => {
    return getValueByCondition(
      [
        [
          onPlaceholder === 'inquiry_for' && selectedInquiryFor.length,
          selectedInquiryFor.map((item) => item.label).join(', '),
        ],
        [
          onPlaceholder === 'request_for' && selectedRequestFor.length,
          selectedRequestFor.map((item) => item.label).join(', '),
        ],
      ],
      'select from the list',
    );
  };

  const setStyleOnContainerClass = (onStyle: checkboxDataTypes) =>
    getValueByCondition([
      [onStyle === 'inquiry_for' && selectedInquiryFor.length, styles.inputColor],
      [onStyle === 'request_for' && selectedRequestFor.length, styles.inputColor],
    ]);

  // get Inquiry For data
  useEffect(() => {
    getInquiryFor().then((res) => {
      setInquiryForData(
        res.map((el) => ({
          label: el.name,
          value: el.id,
        })),
      );
    });
  }, []);

  useEffect(() => {
    // get Resquest For data
    getRequestFor().then((res) => {
      setRequestForData(
        res.map((el) => ({
          label: el.name,
          value: el.id,
        })),
      );
    });

    // get Project Name data
    getProjectName().then((res) => {
      if (res) {
        setProjectNameData(
          res.map(
            (el) =>
              ({
                value: el.id,
                label: renderDualLabel(el.name, el.name, 14, 300),
                labelText: `${el.name} ${el.name}`,
              } as CustomRadioValue),
          ),
        );
      }
    });
  }, []);

  // handle onChange title and message
  const onChangeData = (newData: FieldName, fieldValue: any) => {
    setData((prevState) => ({
      ...prevState,
      [newData]: fieldValue,
    }));
  };

  // handle onChange Inquiry-For and Request-For
  const onChangeCheckboxListData =
    (type: checkboxDataTypes) => (selectedOption: CheckboxValue[]) => {
      // delete other-input has empty value
      const selectedOpt = selectedOption.filter((el) => el.label !== '');

      setData((prevState) => ({
        ...prevState,
        [type]: selectedOpt?.map((opt) => String(opt.value === 'other' ? opt.label : opt.value)),
      }));

      if (type === 'inquiry_for') {
        setSelectedInquiryFor(selectedOpt);
      } else {
        setSelectedRequestFor(selectedOpt);
      }
    };

  // handle onChange Project-Name
  const onChangeProjectNameData = (selectedEl: RadioValue) => {
    setData((prevState) => ({
      ...prevState,
      project_name_id: String(selectedEl.value),
    }));
  };

  const handleSubmit = () => {
    createInquiryRequest(data).then((isSuccess) => {
      if (isSuccess) {
        submitButtonStatus.setValue(true);

        setTimeout(() => {
          submitButtonStatus.setValue(false);

          // clear data
          setData({
            ...DEFAULT_STATE,
            product_id: product.id,
          });
          // close popup
          setVisible(false);
        }, 300);
      }
    });
  };

  // render Inquiry For and Request For data
  const renderFor = (labelContent: checkboxDataTypes, option: CheckboxValue[]) => (
    <FormGroup
      label={labelContent === 'inquiry_for' ? 'Inquiry For' : 'Request For'}
      required
      layout="vertical"
      formClass={styles.formGroup}>
      <CollapseCheckboxList
        checked={labelContent === 'inquiry_for' ? selectedInquiryFor : selectedRequestFor}
        onChange={onChangeCheckboxListData(labelContent)}
        containerClass={setStyleOnContainerClass(labelContent)}
        otherInput
        options={option}
        placeholder={selectedItem(labelContent)}
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
      value={title === 'inquiry_title' ? data.inquiry_title : data.request_title}
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
        value={message === 'inquiry_message' ? data.inquiry_message : data.request_message}
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
          {renderFor('inquiry_for', inquiryForData)}
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
            placeholder={projectNameLabel}
            optionData={projectNameData}
            onChange={(radioValue) => {
              /// to show on label
              setSelectedProjectName(radioValue);
              // update data
              onChangeProjectNameData(radioValue);
            }}
          />

          {/* Request For */}
          {renderFor('request_for', requestForData)}
          {renderTitle('request_title')}
          {renderMessage('request_message')}
        </div>
      ) : null}
    </Popover>
  );
};

export default InquiryRequest;
