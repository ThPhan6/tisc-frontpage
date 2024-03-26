import { FC, useEffect, useState } from 'react';

import { message } from 'antd';

import { getProductById } from '../services';
import { getSelectedRoomIds, useAssignProductToSpaceForm } from './hooks';
import { assignProductToProject, getAllProjects } from '@/features/project/services';
import { useScreen } from '@/helper/common';

import { RadioValue } from '@/components/CustomRadio/types';
import { useAppSelector } from '@/reducers';
import { modalPropsSelector } from '@/reducers/modal';

import CollapseRadioList from '@/components/CustomRadio/CollapseRadioList';
import { FormGroup } from '@/components/Form';
import Popover from '@/components/Modal/Popover';
import { BodyText } from '@/components/Typography';

import styles from './AssignProductModal.less';

export const assignProductModalTitle = 'Assign material/product';

const AssignProductModal: FC = () => {
  const { isMobile } = useScreen();
  const { productId, isCustomProduct } = useAppSelector(modalPropsSelector);

  const projects = useAppSelector((state) => state.project.list);

  const [selectedProject, setSelectedProject] = useState<RadioValue>();
  const { AssignProductToSpaceForm, selectedRooms, isEntire } = useAssignProductToSpaceForm(
    productId,
    String(selectedProject?.value || ''),
  );

  useEffect(() => {
    getAllProjects();
  }, []);

  const onSubmitAssigning = () => {
    if (!selectedProject) {
      return message.error('Please select a project');
    }

    const selectedRoomIds = getSelectedRoomIds(selectedRooms);

    if (isEntire === false && selectedRoomIds.length === 0) {
      return message.error('Please assign to some rooms or entire project');
    }

    assignProductToProject({
      entire_allocation: isEntire,
      product_id: productId,
      project_id: String(selectedProject?.value),
      allocation: selectedRoomIds,
      custom_product: isCustomProduct,
    }).then((response) => {
      if (response) {
        getProductById(productId);
      }
    });
  };

  const projectOptions: RadioValue[] = projects.map((el) => ({
    value: el.id,
    label: (
      <span className="selected-item flex-start">
        <BodyText
          fontFamily="Roboto"
          level={5}
          customClass="text-overflow"
          style={{ marginRight: 12, width: 60 }}
          title={el.code}
        >
          {el.code}
        </BodyText>
        <BodyText
          fontFamily="Roboto"
          level={5}
          customClass="text-overflow"
          style={{ maxWidth: isMobile ? 'calc(100vw - 150px)' : 430 }}
          title={el.name}
        >
          {el.name}
        </BodyText>
      </span>
    ),
  }));

  return (
    <Popover visible title={assignProductModalTitle} onFormSubmit={onSubmitAssigning}>
      <FormGroup label="Live Project Name" layout="vertical">
        <CollapseRadioList
          options={projectOptions}
          checked={String(selectedProject?.value)}
          onChange={setSelectedProject}
          placeholder={selectedProject ? selectedProject.label : 'select from My Workspace'}
          Header={selectedProject?.label}
          containerClass={styles.customRadioList}
          noDataMessage={'No project yet'}
        />
      </FormGroup>

      <FormGroup
        label="Assigning To"
        layout="vertical"
        style={{ marginTop: isMobile ? 16 : 24 }}
        formClass={`${styles.zonesContainer} ${selectedProject ? '' : styles.disabled}`}
      >
        <AssignProductToSpaceForm />
      </FormGroup>
    </Popover>
  );
};

export default AssignProductModal;
