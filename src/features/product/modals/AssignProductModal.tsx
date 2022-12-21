import { FC, useEffect, useState } from 'react';

import { message } from 'antd';

import { getSelectedRoomIds, useAssignProductToSpaceForm } from './hooks';
import { assignProductToProject, getAllProjects } from '@/features/project/services';

import { RadioValue } from '@/components/CustomRadio/types';
import { useAppSelector } from '@/reducers';

import CollapseRadioList from '@/components/CustomRadio/CollapseRadioList';
import { FormGroup } from '@/components/Form';
import Popover, { PopoverProps } from '@/components/Modal/Popover';
import { BodyText } from '@/components/Typography';

import styles from './AssignProductModal.less';

interface AssignProductModalProps extends Omit<PopoverProps, 'title'> {
  productId: string;
  isCustomProduct: boolean;
}

const AssignProductModal: FC<AssignProductModalProps> = ({
  productId,
  isCustomProduct,
  ...props
}) => {
  const projects = useAppSelector((state) => state.project.list);

  const [selectedProject, setSelectedProject] = useState<RadioValue>();
  const { AssignProductToSpaceForm, selectedRooms, isEntire } = useAssignProductToSpaceForm(
    productId,
    String(selectedProject?.value || ''),
  );

  const projectOptions: RadioValue[] = projects.map((el) => ({
    value: el.id,
    label: (
      <span className="selected-item flex-start">
        <BodyText
          fontFamily="Roboto"
          level={5}
          customClass="text-overflow"
          style={{ marginRight: 16, width: 60 }}>
          {el.code}
        </BodyText>
        <BodyText
          fontFamily="Roboto"
          level={5}
          customClass="text-overflow"
          style={{ maxWidth: 430 }}>
          {el.name}
        </BodyText>
      </span>
    ),
  }));

  useEffect(() => {
    if (!props.visible) {
      return;
    }
    getAllProjects();
  }, [props.visible]);

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
    }).then((success) => {
      if (success) {
        props.setVisible(false);
      }
    });
  };

  return (
    <Popover {...props} title="Assign material/product" onFormSubmit={onSubmitAssigning}>
      <FormGroup label="Project Name" layout="vertical">
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
        style={{ marginTop: 24 }}
        formClass={`${styles.zonesContainer} ${selectedProject ? '' : styles.disabled}`}>
        <AssignProductToSpaceForm />
      </FormGroup>
    </Popover>
  );
};

export default AssignProductModal;
