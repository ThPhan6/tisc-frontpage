import { FC, useEffect, useState } from 'react';
import Popover, { PopoverProps } from '@/components/Modal/Popover';
import { FormGroup } from '@/components/Form';
import CollapseRadioList from '@/components/CustomRadio/CollapseRadioList';
import { assignProductToProject, getAllProjects, getProjectSpaceListPagination } from '@/services';
import { RadioValue } from '@/components/CustomRadio/types';
import { useAppSelector } from '@/reducers';
import { CustomRadio } from '@/components/CustomRadio';
import { BodyText } from '@/components/Typography';
import { ReactComponent as InfoIcon } from '@/assets/icons/info.svg';
import { message, Tooltip } from 'antd';
import { useBoolean, useNumber } from '@/helper/hook';
import { ProjectSpaceListProps } from '@/types';
import CustomCollapse from '@/components/Collapse';
import styles from './AssignProductModal.less';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import { CheckboxValue } from '@/components/CustomCheckbox/types';

interface AssignProductModalProps extends Omit<PopoverProps, 'title'> {
  productId: string;
}

const AssignProductModal: FC<AssignProductModalProps> = ({ productId, ...props }) => {
  const projects = useAppSelector((state) => state.project.list);

  const [zones, setZones] = useState<ProjectSpaceListProps[]>([]);

  const [selectedProject, setSelectedProject] = useState<RadioValue>();
  const [projectCollapse, setProjectCollapse] = useState<string | string[]>([]);
  const expandingZone = useNumber(-1);
  const entireProject = useBoolean();
  const [selectedRooms, setSelectedRooms] = useState<{ [areaId: string]: CheckboxValue[] }>({});
  // console.log('selectedRooms', selectedRooms);

  const projectOptions: RadioValue[] = projects.map((el) => ({
    value: el.id,
    label: (
      <span className="selected-item flex-start">
        <BodyText
          fontFamily="Roboto"
          level={5}
          className="text-overflow"
          style={{ marginRight: 16, width: 60 }}
        >
          {el.code}
        </BodyText>
        <BodyText fontFamily="Roboto" level={5}>
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

  useEffect(() => {
    if (selectedProject?.value) {
      getProjectSpaceListPagination(
        {
          page: 1,
          pageSize: 9999,
          project_id: selectedProject.value,
        },
        (data) => {
          setZones(data.data);
        },
      );
    }
  }, [selectedProject]);

  const renderRoomLabel = (roomId: string, roomName: string) => (
    <span className="selected-item flex-start" style={{ paddingLeft: 16 }}>
      <BodyText
        fontFamily="Roboto"
        level={5}
        className="text-overflow"
        style={{ marginRight: 16, width: 60 }}
      >
        {roomId}
      </BodyText>
      <BodyText fontFamily="Roboto" level={5}>
        {roomName}
      </BodyText>
    </span>
  );

  const onSelectRooms = (areaId: string) => (value: CheckboxValue[]) => {
    setSelectedRooms((prevRooms) => ({ ...prevRooms, [areaId]: value }));

    entireProject.setValue(false); // not entire project anymore
  };

  const onChangeEntireProject = () => {
    entireProject.setValue(true);

    setSelectedRooms({}); // clear rooms
  };

  const renderCollapseZone = (zone: ProjectSpaceListProps, index: number) => {
    return (
      <CustomCollapse
        key={zone.id}
        activeKey={expandingZone.value === index ? '1' : ''}
        header={zone.name}
        noBorder
        arrowAlignRight
        onChange={() =>
          expandingZone.setValue((prevIndex: number) => (prevIndex === index ? -1 : index))
        }
      >
        {zone.areas.map((area) => {
          return (
            <div key={area.id} style={{ paddingBottom: 8 }}>
              <BodyText level={5} fontFamily="Roboto" style={{ paddingBottom: 8 }}>
                {area.name}
              </BodyText>
              <CustomCheckbox
                isCheckboxList
                options={area.rooms.map((room) => ({
                  label: renderRoomLabel(room.room_id, room.room_name),
                  value: room.id || '',
                }))}
                selected={selectedRooms[area.id]}
                onChange={onSelectRooms(area.id)}
                heightItem={'36px'}
              />
            </div>
          );
        })}
      </CustomCollapse>
    );
  };

  const onSubmitAssigning = () => {
    if (!selectedProject) {
      return message.error('Please select a project');
    }

    const selectedRoomIds: string[] = [];
    Object.values(selectedRooms).forEach((area) =>
      area.forEach((room) => selectedRoomIds.push(String(room.value))),
    );
    if (entireProject.value === false && selectedRoomIds.length === 0) {
      return message.error('Please assign to some rooms or entire project');
    }

    assignProductToProject({
      is_entire: entireProject.value,
      product_id: productId,
      project_id: String(selectedProject?.value),
      project_zone_ids: selectedRoomIds,
    }).then((success) => {
      if (success) {
        props.setVisible(false);
      }
    });
  };

  return (
    <Popover {...props} title="Asign material/product" onFormSubmit={onSubmitAssigning}>
      <FormGroup label="Project Name" layout="vertical">
        <CollapseRadioList
          activeKey={projectCollapse}
          options={projectOptions}
          checked={String(selectedProject?.value)}
          onChange={(checked) => {
            setSelectedProject(checked);
            setProjectCollapse([]);
          }}
          placeholder={selectedProject ? selectedProject.label : 'select from My Workspace'}
          containerClass={styles.customRadioList}
          onCollapseChange={setProjectCollapse}
        />
      </FormGroup>

      <FormGroup
        label="Assigning To"
        layout="vertical"
        style={{ marginTop: 24 }}
        formClass={`${styles.zonesContainer} ${selectedProject ? '' : styles.disabled}`}
      >
        {selectedProject ? (
          <CustomRadio
            options={[
              {
                label: (
                  <div className="flex-center">
                    <BodyText fontFamily="Roboto" level={5}>
                      ENTIRE PROJECT
                    </BodyText>
                    <Tooltip
                      placement="bottom"
                      title="Select this option if you apply the material/product throughout the entire project. (E.g. paint/surface coating, etc.)"
                      overlayInnerStyle={{
                        width: 199,
                      }}
                    >
                      <InfoIcon style={{ width: 18, height: 18, marginLeft: 8 }} />
                    </Tooltip>
                  </div>
                ),
                value: true,
              },
            ]}
            isRadioList
            value={entireProject.value}
            onChange={onChangeEntireProject}
          />
        ) : null}

        {selectedProject && zones.length
          ? zones.map((el, index) => renderCollapseZone(el, index))
          : null}
      </FormGroup>
    </Popover>
  );
};

export default AssignProductModal;
