import { FC, useEffect, useState } from 'react';

import { useBoolean } from '@/helper/hook';

import { TabItem } from '../Tabs/types';
import { ProductItem } from '@/features/product/types';
import { GeneralData } from '@/types';

import BrandProductBasicHeader from '../BrandProductBasicHeader';
import CollapseCheckBoxListFormGroup from '../CustomCheckbox/CollapseCheckboxListFromGroup';
import CollapseRadioFormGroup from '../CustomRadio/CollapseRadioFormGroup';
import InputGroup from '../EntryForm/InputGroup';
import { FormGroup } from '../Form';
import { CustomTextArea } from '../Form/CustomTextArea';
import Popover from '../Modal/Popover';
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
  project_name: string;
  inquiry_for: string[];
  inquiry_title: string;
  inquiry_message: string;
  request_for: string[];
  request_title: string;
  request_message: string;
}

// interface ProjectNameProps {
//   code: string;
//   project_name: string;
//   project_id: string;
// }

// type FieldName = keyof InquiryRequestForm;

const DEFAULT_STATE = {
  product_id: '',
  project_name: '',
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

  const [inquiryData, setInquiryData] = useState<GeneralData[]>([]);
  // const [requestData, setRequestData] = useState([]);
  // const [projectNameData, setProjectNameData] = useState<ProjectNameProps[]>([]);

  useEffect(() => {
    setInquiryData([]);
  });

  const onChangeData = (newData: Partial<InquiryRequestForm> /* fieldValue: any */) => {
    // setData({
    //   ...data,
    //   [fieldName]: fieldValue,
    // });
    setData((prevState) => ({
      ...prevState,
      ...newData,
    }));
  };

  // format data
  const Inquiry = inquiryData.find((item) => item.id === data.inquiry_for) ?? {
    name: data.inquiry_for,
    id: '',
  };
  const sharingPurposeLabel = sharingPurpose.find((item) => item.id === data.sharing_purpose) ?? {
    name: data.sharing_purpose,
    id: '',
  };

  console.log('Inquiry', Inquiry);

  const handleSubmit = () => {
    // createShareViaEmail(data).then((isSuccess) => {
    //   if (isSuccess) {
    //     submitButtonStatus.setValue(true);
    //     setTimeout(() => {
    //       setVisible(false);
    //       // clear data after submited
    //       setdata({
    //         ...DEFAULT_STATE,
    //         product_id: product.id,
    //       });
    //     }, 200);
    //   }
    // });
  };

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
        // customClass={styles.header}
      />

      {/* Tabs */}
      <CustomTabs
        listTab={Tabs}
        widthItem="auto"
        activeKey={selectedTab}
        onChange={(key) => setSelectedTab(key as TabKeys)}
      />

      {/* GENERAL INQUIRY */}
      <div>
        {/* Inquiry For */}
        <CollapseCheckBoxListFormGroup
          label="Inquiry For"
          checked={data.inquiry_for}
          placeholder={data}
          otherInput
          optionData={inquiryData.map((item) => {
            return {
              label: item.name,
              value: item.id,
            };
          })}
          onChange={(checkboxs) => {
            checkboxs.forEach((checkbox) => {
              if (checkbox.value === 'other') {
                onChangeData({ inquiry_for: data.inquiry_for.push(checkbox.value) });
              } else {
                onChangeData({ inquiry_for: checkbox.label });
              }
            });
          }}
        />

        {/* Title */}
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
          onChange={(e) => {
            onChangeData('inquiry_title', e.target.value);
          }}
          onDelete={() => onChangeData('inquiry_title', '')}
        />
        {/* Message */}
        <FormGroup label="Message" required layout="vertical">
          <CustomTextArea
            className={styles.message}
            maxLength={250}
            showCount
            placeholder="type message here..."
            borderBottomColor="mono-medium"
            boxShadow
            onChange={(e) => onChangeData('message', e.target.value)}
            value={data.message}
          />
        </FormGroup>
      </div>

      {/* PROJECT REQUEST */}
      <div>
        {/* Sharing Purpose */}
        <CollapseRadioFormGroup
          label="Sharing Purpose"
          checked={data.sharing_purpose}
          placeholder={sharingPurposeLabel.name}
          otherInput
          optionData={sharingPurpose.map((item) => {
            return {
              label: item.name,
              value: item.id,
            };
          })}
          onChange={(radioValue) => {
            if (radioValue.value === 'other') {
              onChangeData('sharing_purpose', radioValue.label);
            } else {
              onChangeData('sharing_purpose', radioValue.value);
            }
          }}
        />
      </div>
    </Popover>
  );
};

export default InquiryRequest;
