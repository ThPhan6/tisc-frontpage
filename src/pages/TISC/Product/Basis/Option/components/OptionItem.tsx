import React, { CSSProperties, FC, useContext } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import { MESSAGE_ERROR } from '@/constants/message';
import { IMAGE_ACCEPT_TYPES, LOGO_SIZE_LIMIT } from '@/constants/util';
import { Collapse, Upload, message } from 'antd';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as RemoveIcon } from '@/assets/icons/action-remove.svg';
import DefaultImage from '@/assets/icons/default-option-icon.png';
import { ReactComponent as DragIcon } from '@/assets/icons/drag-icon.svg';

import { useCheckAttributeForm } from '../../../BrandAttribute/hook';
import { FormGroupContext, FormOptionGroupHeaderContext, ProductBasisFormType } from '../../hook';
import { getBase64, showImageUrl } from '@/helper/utils';
import { cloneDeep, uniqueId } from 'lodash';

import { BasisOptionSubForm, MainBasisOptionSubForm, SubBasisOption } from '@/types';

import { EmptyOne } from '@/components/Empty';

import styles from './OptionItem.less';
import { MainPanelHeader } from './entryForm/MainPanelHeader';
import { SubPanelHeader } from './entryForm/SubPanelHeader';
import { SubItemOption } from '@/features/sub-form/SubItem';

export const ImageUpload: FC<{
  onFileChange: (base64: string) => void;
  image?: string;
  style?: CSSProperties;
}> = ({ style, onFileChange, image, ...props }) => {
  return (
    <Upload
      accept={IMAGE_ACCEPT_TYPES.image}
      maxCount={1}
      showUploadList={false}
      beforeUpload={(file) => {
        if (file.size > LOGO_SIZE_LIMIT) {
          message.error(MESSAGE_ERROR.reachSizeLimit);
          return false;
        }
        getBase64(file)
          .then(onFileChange)
          .catch(() => {
            message.error('Upload Failed');
          });
        return true;
      }}
      {...props}
    >
      <img
        style={{
          width: 48,
          height: 48,
          objectFit: 'cover',
          marginRight: 16,
          cursor: 'pointer',
          ...style,
        }}
        src={image || DefaultImage}
      />
    </Upload>
  );
};

interface SubOptionItemProps {
  subOption: BasisOptionSubForm;
  handleChangeSubItem: (changedSubs: BasisOptionSubForm) => void;
  handleDeleteSubOption: () => void;
  handleCopySubOtionItem?: () => void;
  dragIcon?: JSX.Element;
  containerId?: string;
  type?: ProductBasisFormType;
  dataContainerRef?: any;
}

export const SubOptionItem: FC<SubOptionItemProps> = (props) => {
  const {
    subOption,
    handleChangeSubItem,
    handleDeleteSubOption,
    dragIcon,
    handleCopySubOtionItem,
    containerId,
    type,
    dataContainerRef,
  } = props;

  const { isAttribute } = useCheckAttributeForm();
  const { mode = 'list' } = useContext(FormOptionGroupHeaderContext);

  const { collapse, setCollapse } = useContext(FormGroupContext);

  const higestLength =
    subOption.subs?.reduce((subA, subB) =>
      subA.value_1.length > subB.value_1.length ? subA : subB,
    ).value_1?.length * 8;

  console.log('subOption.subs: ', subOption.subs);

  const handleDeleteSubItem =
    (index: number) => (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
      e.stopPropagation();

      const newSubItems = [...subOption.subs];
      newSubItems.splice(index, 1);
      handleChangeSubItem({
        ...subOption,
        count: newSubItems.length,
        subs: newSubItems,
      });
    };

  const handleChangeSubOptionItem = (changedOptionItem: SubBasisOption, index: number) => {
    const newSubItems = [...subOption.subs];
    newSubItems[index] = changedOptionItem;
    handleChangeSubItem({
      ...subOption,
      subs: newSubItems,
    });
  };

  const handleCollapse = () => {
    const newCollapse: any = cloneDeep(collapse);

    if (newCollapse[subOption.id]) {
      delete newCollapse[subOption.id];
      if (type === ProductBasisFormType.options) {
        if (dataContainerRef) {
          dataContainerRef.current.style.height = 'unset';
        }
        const formContainer = containerId ? document.getElementById(containerId) : undefined;
        const groupContent = document.getElementById(`${subOption.id}_content`);
        if (formContainer) {
          formContainer.style.overflowY = 'auto';
          if (groupContent) {
            groupContent.style.height = 'unset';
            groupContent.style.overflowY = 'unset';
          }
        }
      }
    } else {
      newCollapse[subOption.id] = true;
      if (type === ProductBasisFormType.options) {
        if (dataContainerRef) {
          dataContainerRef.current.style.height = '9999px';
        }
        const formContainer = containerId ? document.getElementById(containerId) : undefined;
        const groupContainer = document.getElementById(subOption.id);
        const groupContent = document.getElementById(`${subOption.id}_content`);
        if (formContainer) {
          const formTop = formContainer.getBoundingClientRect().top;
          const groupTop = groupContainer.getBoundingClientRect().top;
          formContainer.scrollTop += groupTop - formTop - 60;
          formContainer.style.overflowY = 'hidden';
          if (groupContent) {
            groupContent.style.height = 'calc(var(--vh) * 100 - 400px)';
            groupContent.style.overflowY = 'auto';
          }
        }
      }
    }

    setCollapse(newCollapse);
  };

  return (
    <div className={styles.collapse_container}>
      <Collapse
        ghost
        activeKey={collapse[subOption.id] ? subOption.id : ''}
        onChange={handleCollapse}
        // collapsible={
        //   mode === 'card' &&
        //   subOption.subs.every((sub) => sub.image?.indexOf('/default/option_default.webp') !== -1)
        //     ? 'disabled'
        //     : undefined
        // }
      >
        <Collapse.Panel
          className={`${collapse[subOption.id] && styles.active_collapse_panel} ${
            type === ProductBasisFormType.options && styles.noBorder
          }`}
          header={
            <SubPanelHeader
              subOption={subOption}
              handleChangeSubItem={handleChangeSubItem}
              handleDeleteSubOption={handleDeleteSubOption}
              handleCopySubOtionItem={handleCopySubOtionItem}
              dragIcon={dragIcon}
            />
          }
          key={subOption.id}
          showArrow={false}
          id={subOption.id}
          forceRender={true}
        >
          <div
            style={{ paddingLeft: 80 }}
            className={`${styles.sub_wrapper} ${mode === 'card' ? styles.cardMode : ''}`}
            id={`${subOption.id}_content`}
          >
            {!subOption.subs?.length ? (
              <EmptyOne />
            ) : (
              subOption.subs.map(
                (subItemOption, index) =>
                  mode === 'list' ? (
                    <div
                      key={index}
                      className={styles.optionItemGroup}
                      style={{ paddingTop: index == 0 ? 0 : 16 }}
                    >
                      <SubItemOption
                        subItemOption={subItemOption}
                        onChange={(changedOptionItem) =>
                          handleChangeSubOptionItem(changedOptionItem, index)
                        }
                        type={type}
                        higestLength={
                          type === ProductBasisFormType.options ? higestLength : undefined
                        }
                      />
                      <div className="flex-center">
                        {isAttribute ? (
                          <DeleteIcon
                            // className="delete_sub_icon"
                            onClick={handleDeleteSubItem(index)}
                            color="#000"
                            style={{ cursor: 'pointer' }}
                          />
                        ) : (
                          <RemoveIcon
                            className="delete_sub_icon"
                            onClick={handleDeleteSubItem(index)}
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <img
                      key={index}
                      src={showImageUrl(subItemOption.image)}
                      style={{
                        width: 64,
                        height: 64,
                        objectFit: 'cover',
                        cursor: 'default',
                      }}
                    />
                  ),
                // subItemOption.image &&
                //   subItemOption.image?.indexOf('/default/option_default.webp') === -1 ? (
                //   <img
                //     src={showImageUrl(subItemOption.image)}
                //     style={{
                //       width: 64,
                //       height: 64,
                //       objectFit: 'cover',
                //       cursor: 'default',
                //     }}
                //   />
                // ) : null,
              )
            )}
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

interface MainOptionItemProps {
  mainOption: MainBasisOptionSubForm;
  mainOptionIndex: number;
  containerId?: string;
  handleChangeMainSubItem: (changedSubs: MainBasisOptionSubForm) => void;
  handleDeleteMainSubOption: () => void;
  handleCopyMainOption?: (mainOption: MainBasisOptionSubForm) => void;
  type?: ProductBasisFormType;
  dataContainerRef?: any;
}

export const MainOptionItem: FC<MainOptionItemProps> = (props) => {
  const {
    mainOption,
    mainOptionIndex,
    containerId,
    handleChangeMainSubItem,
    handleDeleteMainSubOption,
    handleCopyMainOption,
    type,
    dataContainerRef,
  } = props;

  const { collapse, setCollapse, hideDrag } = useContext(FormGroupContext);

  const handleDeleteSubOption = (index: number) => {
    const newSubItems = [...mainOption.subs];
    newSubItems.splice(index, 1);
    handleChangeMainSubItem({
      ...mainOption,
      count: newSubItems.length,
      subs: newSubItems,
    });
  };

  const handleChangeSubOptionItem = (changedOptionItem: BasisOptionSubForm, index: number) => {
    const newSubItems = [...mainOption.subs];
    newSubItems[index] = changedOptionItem;
    handleChangeMainSubItem({
      ...mainOption,
      subs: newSubItems,
    });
  };

  const handleCopySubOtionItem = (subItem: BasisOptionSubForm) => {
    const newId = uniqueId('new-');

    const newSub: BasisOptionSubForm = {
      ...subItem,
      id: `${newId}-${subItem.id}`,
      subs: subItem.subs.map((opt) => ({
        ...opt,
        id: `${newId}-${opt.id}`,
      })),
    };

    handleChangeMainSubItem({
      ...mainOption,
      count: mainOption.subs.length + 1,
      subs: [...mainOption.subs, newSub],
    });
  };

  const handleCollapse = () => {
    const newCollapse = cloneDeep(collapse);

    if (newCollapse[mainOption.id]) {
      delete newCollapse[mainOption.id];
    } else {
      newCollapse[mainOption.id] = true;
    }

    setCollapse(newCollapse);
  };

  return (
    <Draggable key={mainOption.id} draggableId={mainOption.id} index={mainOptionIndex}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <Droppable droppableId={mainOption.id}>
            {(droppableProvided) => (
              <div
                ref={droppableProvided.innerRef}
                {...droppableProvided.droppableProps}
                className={styles.collapseContainer}
              >
                <Collapse
                  ghost
                  activeKey={collapse[mainOption.id] ? mainOption.id : ''}
                  onChange={handleCollapse}
                >
                  <Collapse.Panel
                    className={`${
                      collapse[mainOption.id]
                        ? styles.active_collapse_panel
                        : styles.unactive_collapse_panel
                    } ${type === ProductBasisFormType.options && styles.noBorder}`}
                    header={
                      <MainPanelHeader
                        mainOption={mainOption}
                        handleChangeMainSubItem={handleChangeMainSubItem}
                        handleDeleteMainSubOption={handleDeleteMainSubOption}
                        handleCopyMainOption={handleCopyMainOption}
                      />
                    }
                    key={mainOption.id}
                    showArrow={false}
                  >
                    <div
                      className={styles.main_option}
                      // style={{ paddingLeft: isAttribute ? 16 : 0 }}
                    >
                      {!mainOption.subs.length ? (
                        <EmptyOne />
                      ) : (
                        mainOption.subs.map((subItemOption, index) => (
                          <Draggable
                            key={subItemOption.id}
                            draggableId={subItemOption.id}
                            index={index}
                          >
                            {(mainOptionProvided) => (
                              <div
                                ref={mainOptionProvided.innerRef}
                                {...mainOptionProvided.draggableProps}
                              >
                                <SubOptionItem
                                  subOption={subItemOption}
                                  handleChangeSubItem={(changedSubs) =>
                                    handleChangeSubOptionItem(changedSubs, index)
                                  }
                                  handleCopySubOtionItem={() => {
                                    handleCopySubOtionItem({
                                      ...subItemOption,
                                      name: `${subItemOption.name} copy`,
                                    });
                                  }}
                                  handleDeleteSubOption={() => handleDeleteSubOption(index)}
                                  dragIcon={
                                    hideDrag ? undefined : (
                                      <div
                                        {...mainOptionProvided.dragHandleProps}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                        }}
                                        className="drag-icon flex-start"
                                      >
                                        {<DragIcon />}
                                      </div>
                                    )
                                  }
                                  containerId={containerId}
                                  type={type}
                                  dataContainerRef={dataContainerRef}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                    </div>
                  </Collapse.Panel>
                </Collapse>
                {droppableProvided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};
