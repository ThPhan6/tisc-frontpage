import React from 'react';

import { DefaultProjectArea, DefaultProjectRoom } from '../../constants/form';

import { ReactComponent as ActionDeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as ActionUpDown } from '@/assets/icons/action-up-icon.svg';
import { ReactComponent as CirclePlusIcon } from '@/assets/icons/circle-plus.svg';
import { ReactComponent as ArrowIcon } from '@/assets/icons/drop-down-icon.svg';

import { deleteProjectSpace } from '@/features/project/services';
import { useScreen } from '@/helper/common';
import { validateFloatNumber, validateNumber } from '@/helper/utils';

import { ProjectSpaceRoom, ProjectSpaceZone } from '@/features/project/types';

import CustomCollapse from '@/components/Collapse';
import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText } from '@/components/Typography';

import styles from '../../styles/space-management.less';

interface SpaceEntryFormProps {
  data: ProjectSpaceZone;
  setData: (data: ProjectSpaceZone | undefined) => void;
  handleSubmit?: () => void;
  handleCancel?: () => void;
  submitButtonStatus?: boolean;
}
type ProjectSpaceRoomKey = keyof ProjectSpaceRoom;
interface AreaRoomCollapseProps {
  room: ProjectSpaceRoom;
  onChangeRoomData: (e: React.ChangeEvent<HTMLInputElement>, key: ProjectSpaceRoomKey) => void;
  onDeleteRoom: () => void;
}

const AreaRoomCollapse: React.FC<AreaRoomCollapseProps> = ({
  room,
  onChangeRoomData,
  onDeleteRoom,
}) => {
  const preventCollapseAction = (e: React.ChangeEvent<any>) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <CustomCollapse
      className={styles.spaceEntryFormAreaWrapper}
      customHeaderClass={styles.spaceEntryFormRoom}
      header={
        <>
          <div className={styles.spaceEntryFormRoomLeft}>
            <BodyText level={3}>Room</BodyText>
            <ActionUpDown />
            <CustomInput
              value={room.room_name}
              onChange={(e) => onChangeRoomData(e, 'room_name')}
              placeholder="type room name"
              containerClass={styles.areaInputName}
              onClick={preventCollapseAction}
            />
          </div>
          <ActionDeleteIcon
            className="remove-icon"
            onClick={(e: any) => {
              preventCollapseAction(e);
              onDeleteRoom();
            }}
          />
        </>
      }
    >
      <table>
        <tbody>
          <tr>
            <td>
              <BodyText level={3}>Room ID:</BodyText>
            </td>
            <td>
              <CustomInput
                value={room.room_id}
                onChange={(e) => onChangeRoomData(e, 'room_id')}
                placeholder="type room ID"
                containerClass={styles.areaInputName}
                onClick={preventCollapseAction}
              />
            </td>
          </tr>
          <tr>
            <td>
              <BodyText level={3}>Room Size:</BodyText>
            </td>
            <td>
              <CustomInput
                value={room.room_size}
                onChange={(e) => onChangeRoomData(e, 'room_size')}
                placeholder="room size"
                containerClass={styles.areaInputName}
                onClick={preventCollapseAction}
                inputValidation={validateFloatNumber}
              />
            </td>
          </tr>
          <tr>
            <td>
              <BodyText level={3}>Quantity:</BodyText>
            </td>
            <td>
              <CustomInput
                value={room.quantity}
                onChange={(e) => onChangeRoomData(e, 'quantity')}
                placeholder="# of same room type"
                containerClass={styles.areaInputName}
                onClick={preventCollapseAction}
                inputValidation={validateNumber}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </CustomCollapse>
  );
};

const SpaceEntryForm: React.FC<SpaceEntryFormProps> = (props) => {
  const { data, setData, handleSubmit, handleCancel, submitButtonStatus = false } = props;
  const { isTablet } = useScreen();
  const addMoreArea = () => {
    const newAreas = [...data.areas, { ...DefaultProjectArea }];
    setData({
      ...data,
      areas: newAreas,
    });
  };

  const onChangeZoneName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      name: e.target.value,
    });
  };
  const onChangeAreaName = (e: React.ChangeEvent<HTMLInputElement>, areaIndex: number) => {
    const newAreas = [...data.areas];
    newAreas[areaIndex].name = e.target.value;
    setData({
      ...data,
      areas: newAreas,
    });
  };

  const addMoreRoom = (e: React.ChangeEvent<any>, areaIndex: number) => {
    e.stopPropagation();
    e.preventDefault();
    const newAreas = [...data.areas];
    newAreas[areaIndex].rooms = [...newAreas[areaIndex].rooms, { ...DefaultProjectRoom }];
    setData({
      ...data,
      areas: newAreas,
    });
  };

  const onChangeRoomData = (
    e: React.ChangeEvent<HTMLInputElement>,
    areaIndex: number,
    roomIndex: number,
    key: ProjectSpaceRoomKey,
  ) => {
    const newRooms = [...data.areas[areaIndex].rooms];
    newRooms[roomIndex] = {
      ...newRooms[roomIndex],
      [key]: e.target.value,
    };
    const newAreas = [...data.areas];
    newAreas[areaIndex].rooms = newRooms;
    setData({
      ...data,
      areas: newAreas,
    });
  };

  const onDeleteArea = (areaIndex: number) => {
    const newAreas = data.areas.filter((_a, index) => index !== areaIndex);
    setData({
      ...data,
      areas: newAreas,
    });
  };
  const onDeleteRoom = (areaIndex: number, roomIndex: number) => {
    const newAreas = [...data.areas];
    // console.log('areaIndex', areaIndex);
    // console.log('roomIndex', roomIndex);
    newAreas[areaIndex].rooms = newAreas[areaIndex].rooms.filter(
      (_a, index) => index !== roomIndex,
    );
    setData({
      ...data,
      areas: newAreas,
    });
  };

  const handleDeleteZone = () => {
    if (data?.id) {
      deleteProjectSpace(data.id).then((isSuccess) => {
        if (isSuccess) {
          setData(undefined);
        }
      });
    }
  };

  return (
    <EntryFormWrapper
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      handleDelete={handleDeleteZone}
      entryFormTypeOnMobile={data?.id ? 'edit' : 'create'}
      submitButtonStatus={submitButtonStatus}
      customClass={styles.spaceEntryForm}
      contentClass={isTablet ? 'height-on-tablet' : 'height-on-desktop'}
    >
      <FormNameInput
        placeholder="type zone name"
        title="Zone"
        onChangeInput={onChangeZoneName}
        HandleOnClickAddIcon={addMoreArea}
        inputValue={data.name || ''}
        customClass={styles.zoneNameInput}
      />
      {data?.areas.map((area, areaIndex) => (
        <CustomCollapse
          key={areaIndex}
          className={styles.spaceEntryFormAreaWrapper}
          customHeaderClass={styles.spaceEntryFormArea}
          defaultActiveKey={['1']}
          header={
            <>
              <div className={styles.spaceEntryFormAreaLeft}>
                <BodyText level={3}>Area</BodyText>
                <ArrowIcon />
              </div>
              <CirclePlusIcon
                className="action-icon"
                onClick={(e: any) => addMoreRoom(e, areaIndex)}
              />
            </>
          }
        >
          <div className={styles.areaInputGroup}>
            <CustomInput
              value={area.name}
              onChange={(e) => onChangeAreaName(e, areaIndex)}
              placeholder="type area name"
              containerClass={styles.areaInputName}
            />
            <ActionDeleteIcon className="remove-icon" onClick={() => onDeleteArea(areaIndex)} />
          </div>
          {area.rooms.map((room, roomIndex) => (
            <AreaRoomCollapse
              room={room}
              key={roomIndex}
              onChangeRoomData={(e, roomKey) => onChangeRoomData(e, areaIndex, roomIndex, roomKey)}
              onDeleteRoom={() => onDeleteRoom(areaIndex, roomIndex)}
            />
          ))}
        </CustomCollapse>
      ))}
    </EntryFormWrapper>
  );
};

export default SpaceEntryForm;
