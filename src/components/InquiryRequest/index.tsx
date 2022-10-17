import { FC, useEffect, useState } from 'react';

import { message } from 'antd';

import { getAllProjects } from '@/features/project/services';
import {
  createGeneralInquiry,
  createProjectRequest,
  getInquiryRequestFor,
} from '@/features/project/services/project-related.api';
import { useBoolean } from '@/helper/hook';
import { getValueByCondition } from '@/helper/utils';

import { CheckboxValue } from '../CustomCheckbox/types';
import { TabItem } from '../Tabs/types';
import { GeneralInquiryForm, ProductItem, ProjectRequestForm } from '@/features/product/types';
import { ProjectItem } from '@/features/project/types';
import { useAppSelector } from '@/reducers';

import BrandProductBasicHeader from '../BrandProductBasicHeader';
import CollapseCheckboxList from '../CustomCheckbox/CollapseCheckboxList';
import CollapseRadioFormGroup from '../CustomRadio/CollapseRadioFormGroup';
import InputGroup from '../EntryForm/InputGroup';
import { FormGroup } from '../Form';
import { CustomTextArea } from '../Form/CustomTextArea';
import Popover from '../Modal/Popover';
import { DualLabel } from '../RenderHeaderLabel';
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

const GENERAL_INQUIRY_DEFAULT_STATE = {
  product_id: '',
  title: '',
  message: '',
  inquiry_for_ids: [],
};

const PROJECT_REQUEST_DEFAULT_STATE = {
  product_id: '',
  project_id: '',
  title: '',
  message: '',
  request_for_ids: [],
};

interface InquiryRequestProps {
  product: ProductItem;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const InquiryRequest: FC<InquiryRequestProps> = ({ product, visible, setVisible }) => {
  const isSubmitted = useBoolean(false);
  const [selectedTab, setSelectedTab] = useState<TabKeys>(TabKeys.inquiry);
  const InquiryTab = selectedTab === TabKeys.inquiry;

  const projectData = useAppSelector((state) => state.project.list);

  const [generalInquirydata, setGeneralInquiryData] = useState<GeneralInquiryForm>({
    ...GENERAL_INQUIRY_DEFAULT_STATE,
    product_id: product.id,
  });
  const [projectRequestData, setProjectRequestData] = useState<ProjectRequestForm>({
    ...PROJECT_REQUEST_DEFAULT_STATE,
    product_id: product.id,
  });

  // to show on label
  const [projectChosen, setProjectChosen] = useState<ProjectItem>();

  //
  const [inquiryForData, setInquiryForData] = useState<CheckboxValue[]>([]);
  const [selectedInquiryFor, setSelectedInquiryFor] = useState<CheckboxValue[]>([]); // for show on placeholder
  //
  const [requestForData, setRequestForData] = useState<CheckboxValue[]>([]);
  const [selectedRequestFor, setSelectedRequestFor] = useState<CheckboxValue[]>([]); // for show on placeholder

  /// handle to show on placeholder
  const selectedItem = () => {
    return getValueByCondition(
      [
        [
          selectedTab === TabKeys.inquiry && selectedInquiryFor.length,
          selectedInquiryFor.map((item) => item.label).join(', '),
        ],
        [
          selectedTab === TabKeys.request && selectedRequestFor.length,
          selectedRequestFor.map((item) => item.label).join(', '),
        ],
      ],
      'select from the list',
    );
  };

  const setStyleOnContainerClass = () =>
    getValueByCondition([
      [InquiryTab && selectedInquiryFor.length, styles.inputColor],
      [selectedTab === TabKeys.request && selectedRequestFor.length, styles.inputColor],
    ]);

  /// get inquiry/request data
  useEffect(() => {
    if (!visible) {
      return;
    }

    getInquiryRequestFor().then((res) => {
      setInquiryForData(
        res.map((el) => ({
          label: el.name,
          value: el.id,
        })),
      );
      setRequestForData(
        res.map((el) => ({
          label: el.name,
          value: el.id,
        })),
      );
    });

    // get Project Name data
    getAllProjects();
  }, [visible]);

  // handle onChange title and message
  const onChangeValueInput = (newData: 'title' | 'message', fieldValue: any) => {
    if (InquiryTab) {
      setGeneralInquiryData((prevState) => ({
        ...prevState,
        [newData]: fieldValue,
      }));
    } else {
      setProjectRequestData((prevState) => ({
        ...prevState,
        [newData]: fieldValue,
      }));
    }
  };

  // handle onChange Inquiry-For and Request-For
  const onChangeCheckboxListData = (selectedOption: CheckboxValue[]) => {
    // delete other-input has empty value
    const selectedOpt = selectedOption.filter((el) => el.label !== '');

    if (InquiryTab) {
      setSelectedInquiryFor(selectedOpt);
      setGeneralInquiryData((prevState) => ({
        ...prevState,
        inquiry_for_ids: selectedOpt?.map((opt) =>
          String(opt.value === 'other' ? opt.label : opt.value),
        ),
      }));
    } else {
      setSelectedRequestFor(selectedOpt);
      setProjectRequestData((prevState) => ({
        ...prevState,
        request_for_ids: selectedOpt?.map((opt) =>
          String(opt.value === 'other' ? opt.label : opt.value),
        ),
      }));
    }
  };

  const getProjectName = (projectId: string) => () => {
    setProjectChosen(projectData.find((el) => el.id === projectId));
  };

  // handle onChange Project-Name
  const handleProjectName = (projectId: string, callback: (projectSelected: string) => void) => {
    setProjectRequestData((prevState) => ({
      ...prevState,
      project_id: projectId,
    }));

    callback(projectId);
  };

  const handleSubmit = () => {
    if (InquiryTab) {
      switch (true) {
        case generalInquirydata.inquiry_for_ids.length === 0:
          message.error('Inquiry For is required');
          return;
        case !generalInquirydata.title:
          message.error('Title is required');
          return;
        case !generalInquirydata.title:
          message.error('Message is required');
          return;
        default:
          break;
      }
    } else {
      switch (true) {
        case !projectRequestData.project_id:
          message.error('Project is required');
          return;
        case projectRequestData.request_for_ids.length === 0:
          message.error('Request For is required');
          return;
        case !projectRequestData.title:
          message.error('Title is required');
          return;
        case !projectRequestData.message:
          message.error('Message is required');
          return;
        default:
          break;
      }
    }

    const submitForm = InquiryTab
      ? createGeneralInquiry(generalInquirydata)
      : createProjectRequest(projectRequestData);

    submitForm.then((isSuccess) => {
      if (isSuccess) {
        isSubmitted.setValue(true);

        setTimeout(() => {
          isSubmitted.setValue(false);
          // clear data
          if (InquiryTab) {
            setSelectedInquiryFor([]);
            setGeneralInquiryData({
              ...GENERAL_INQUIRY_DEFAULT_STATE,
              product_id: product.id,
            });
          } else {
            setProjectChosen(undefined);
            setSelectedRequestFor([]);
            setProjectRequestData({
              ...PROJECT_REQUEST_DEFAULT_STATE,
              product_id: product.id,
            });
          }

          // close popup
          setVisible(false);
        }, 300);
      }
    });
  };

  // render Inquiry For and Request For data
  const renderFor = () => {
    const labelContent = InquiryTab ? 'Inquiry For' : 'Request For';
    const valueSelected = InquiryTab ? selectedInquiryFor : selectedRequestFor;
    const option = InquiryTab ? inquiryForData : requestForData;
    return (
      <FormGroup label={labelContent} required layout="vertical" formClass={styles.formGroup}>
        <CollapseCheckboxList
          checked={valueSelected}
          onChange={onChangeCheckboxListData}
          containerClass={setStyleOnContainerClass()}
          otherInput
          clearOtherInput={isSubmitted.value}
          options={option}
          placeholder={selectedItem()}
        />
      </FormGroup>
    );
  };

  const renderTitle = () => (
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
      value={InquiryTab ? generalInquirydata.title : projectRequestData.title}
      onChange={(e) => onChangeValueInput('title', e.target.value)}
      onDelete={() => onChangeValueInput('title', '')}
    />
  );

  const renderMessage = () => (
    <FormGroup label="Message" required layout="vertical">
      <CustomTextArea
        className={styles.message}
        maxLength={250}
        showCount
        placeholder="type message here..."
        borderBottomColor="mono-medium"
        boxShadow
        onChange={(e) => onChangeValueInput('message', e.target.value)}
        value={InquiryTab ? generalInquirydata.message : projectRequestData.message}
      />
    </FormGroup>
  );

  return (
    <Popover
      title="INQUIRY/REQUEST"
      visible={visible}
      setVisible={setVisible}
      submitButtonStatus={isSubmitted.value}
      onFormSubmit={handleSubmit}>
      <BrandProductBasicHeader
        image={product.images?.[0] || ''}
        logo={product.brand?.logo}
        text_1={product.brand?.name || ''}
        text_2={product.name || ''}
        text_3={product.description || ''}
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

      {selectedTab === TabKeys.request ? (
        <CollapseRadioFormGroup
          label="Project Name"
          checked={projectRequestData.project_id}
          defaultPlaceHolder="select from My Workspace"
          placeholder={projectChosen?.name}
          radioListClass={styles.projectNameInfo}
          optionData={projectData.map((el) => ({
            value: el.id,
            label: <DualLabel firstTxt={el.code} secTxt={el.name} fontSize={14} fontWeight={300} />,
          }))}
          onChange={(itemSelected) =>
            handleProjectName(
              String(itemSelected.value),
              getProjectName(String(itemSelected.value)),
            )
          }
          noDataMessage="No project yet"
        />
      ) : null}

      {renderFor()}
      {renderTitle()}
      {renderMessage()}
    </Popover>
  );
};

export default InquiryRequest;
