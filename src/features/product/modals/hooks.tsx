import { FC, useEffect, useState } from 'react';

import { Tooltip } from 'antd';

import { ReactComponent as InfoIcon } from '@/assets/icons/info.svg';

import { getProductAssignSpaceByProject } from '@/features/project/services';
import { confirmDelete } from '@/helper/common';
import { useBoolean, useNumber } from '@/helper/hook';

import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { ProjectSpaceListProps } from '@/features/project/types';

import CustomCollapse from '@/components/Collapse';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import { CustomRadio } from '@/components/CustomRadio';
import { BodyText } from '@/components/Typography';

type RoomsState = { [areaId: string]: CheckboxValue[] };

export const getSelectedRoomIds = (selectedRooms: RoomsState) => {
  const selectedRoomIds: string[] = [];
  Object.values(selectedRooms).forEach((area) =>
    area.forEach((room) => selectedRoomIds.push(String(room.value))),
  );
  return selectedRoomIds;
};

export const useAssignProductToSpaceForm = (
  productId: string,
  projectId: string,
  specifyOptions?: {
    onChangeEntireProjectCallback: (isEntire: boolean) => void;
    onChangeSelectedRoomsCallback: (selectedRooms: string[]) => void;
    isEntire?: boolean;
    roomId?: string;
  },
) => {
  const entireProject = useBoolean();
  const haveConfirmed = useBoolean();
  const [selectedRooms, setSelectedRooms] = useState<RoomsState>({});
  const expandingZone = useNumber(-1);
  const [zones, setZones] = useState<ProjectSpaceListProps[]>([]);

  useEffect(() => {
    if (projectId) {
      getProductAssignSpaceByProject(projectId, productId, (isEntireProject, data) => {
        entireProject.setValue(isEntireProject);
        specifyOptions?.onChangeEntireProjectCallback(isEntireProject);
        if (isEntireProject === false && specifyOptions) {
          const selectedRoomIds: string[] = [];
          data.forEach((zone) =>
            zone.areas.forEach((area) =>
              area.rooms.forEach((room) =>
                room.is_assigned ? selectedRoomIds.push(room.id || '') : {},
              ),
            ),
          );
          specifyOptions?.onChangeSelectedRoomsCallback(selectedRoomIds);
        }

        setZones(data);

        const curSelectedRooms: { [areaId: string]: CheckboxValue[] } = {};
        data.forEach((zone) => {
          zone.areas.forEach((area) => {
            const assignedRooms = area.rooms.filter((room) => room.is_assigned === true);
            const roomCheckboxs: CheckboxValue[] = assignedRooms.map((el) => ({
              value: el.id || '',
              label: el.room_name,
            }));
            curSelectedRooms[area.id] = roomCheckboxs;
          });
        });
        setSelectedRooms(curSelectedRooms);
      });
    }
  }, [projectId]);

  const onChangeEntireProject = () => {
    const handleChooseEntireProject = () => {
      specifyOptions?.onChangeEntireProjectCallback(true);
      specifyOptions?.onChangeSelectedRoomsCallback([]);
      entireProject.setValue(true);
      setSelectedRooms({}); // clear rooms
      haveConfirmed.setValue(true);
    };
    if (specifyOptions?.roomId && haveConfirmed.value === false) {
      return confirmDelete(handleChooseEntireProject, {
        title: 'Are you sure to re-allocate?',
        content:
          'You are re-allocating product from current room to entire project along with all of your specifying data after submitting.',
      });
    }

    handleChooseEntireProject();
  };

  const onSelectRooms = (areaId: string) => (value: CheckboxValue[]) => {
    const handleSelectRooms = () => {
      setSelectedRooms((prevRooms) => {
        const nextRoomState = { ...prevRooms, [areaId]: value };
        specifyOptions?.onChangeSelectedRoomsCallback(getSelectedRoomIds(nextRoomState));
        return nextRoomState;
      });
      entireProject.setValue(false); // not entire project anymore
      specifyOptions?.onChangeEntireProjectCallback(false);
      haveConfirmed.setValue(true);
    };

    const nextRooms = { ...selectedRooms, [areaId]: value };
    const roomIds = getSelectedRoomIds(nextRooms);

    const isSelectedRoomBeRemoved =
      specifyOptions?.roomId && roomIds.length && roomIds.includes(specifyOptions.roomId) === false;

    if (haveConfirmed.value === false && (specifyOptions?.isEntire || isSelectedRoomBeRemoved)) {
      return confirmDelete(handleSelectRooms, {
        title: 'Are you sure to re-allocate?',
        content: isSelectedRoomBeRemoved
          ? 'Your are removing this consider by uncheck its room. All of your specifying data will be remove along with this consider after submitting.'
          : 'You are re-allocating product from entire project to some specific rooms. All of specifying data will be move to new assigned rooms - considers.',
      });
    }

    handleSelectRooms();
  };

  const renderRoomLabel = (key: string, roomId: string, roomName: string) => (
    <span key={key} className="selected-item flex-start" style={{ paddingLeft: 16 }}>
      <BodyText
        fontFamily="Roboto"
        level={5}
        className="text-overflow"
        style={{ marginRight: 12, width: 60 }}>
        {roomId}
      </BodyText>
      <BodyText fontFamily="Roboto" level={5}>
        {roomName}
      </BodyText>
    </span>
  );

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
        customHeaderClass="collapse-header">
        {zone.areas.map((area) => {
          return (
            <div key={area.id} style={{ paddingBottom: 8, paddingLeft: 16 }}>
              <BodyText level={5} fontFamily="Roboto" style={{ height: '36px' }}>
                {area.name}
              </BodyText>
              <CustomCheckbox
                isCheckboxList
                options={area.rooms.map((room) => ({
                  label: renderRoomLabel(room.id || '', room.room_id, room.room_name),
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

  const renderEntireProjectLabel = (specifyingModal?: boolean) => {
    return (
      <div className="flex-center" style={{ padding: specifyingModal ? '10px 0' : '9px 0' }}>
        <BodyText
          fontFamily="Roboto"
          level={specifyingModal ? 6 : 5}
          style={{ fontWeight: specifyingModal ? '500' : undefined }}>
          {specifyingModal ? 'Entire Project' : 'ENTIRE PROJECT'}
        </BodyText>
        <Tooltip
          placement="bottom"
          title={`Select this option if you apply the material/product throughout the entire project.
            (E.g. paint/surface coating, etc)`}
          overlayInnerStyle={{
            width: 199,
          }}>
          <InfoIcon style={{ width: 18, height: 18, marginLeft: 8 }} />
        </Tooltip>
      </div>
    );
  };

  const AssignProductToSpaceForm: FC<{ specifyingModal?: boolean; noPaddingLeft?: boolean }> = ({
    specifyingModal,
    noPaddingLeft,
  }) => (
    <>
      {projectId && (
        <CustomRadio
          options={[
            {
              label: renderEntireProjectLabel(specifyingModal),
              value: true,
            },
          ]}
          isRadioList
          value={entireProject.value}
          onChange={onChangeEntireProject}
          containerStyle={{ boxShadow: 'inset 0 -.7px 0 #000' }}
          noPaddingLeft={noPaddingLeft}
        />
      )}

      {projectId && zones.length ? zones.map((el, index) => renderCollapseZone(el, index)) : null}
    </>
  );

  return {
    AssignProductToSpaceForm,
    selectedRooms,
    isEntire: entireProject.value,
  };
};
