import { useEffect, useState } from 'react';

import { useScreen } from '@/helper/common';
import { getSelectedOptions } from '@/helper/utils';
import { createActionTask, getActionTask } from '@/pages/Brand/GeneralInquiries/services';

import { CheckboxValue } from '../CustomCheckbox/types';
import { ActionTaskRequestBody } from '@/pages/Brand/GeneralInquiries/types';
import store, { useAppSelector } from '@/reducers';
import { closeModal } from '@/reducers/modal';

import { CustomCheckbox } from '../CustomCheckbox';
import Popover from '../Modal/Popover';
import styles from './modal.less';
import { setActionTaskModalVisible, setReloadActionTaskTable } from './slice';

export const ActionTaskModal = () => {
  const { isMobile } = useScreen();
  /// for show data
  const [actionTaskData, setActionTaskData] = useState<CheckboxValue[]>([]);

  const { model_id, model_name } = useAppSelector((state) => state.actionTasks);

  /// for update data
  const [actionTaskModal, setActionTaskModal] = useState<ActionTaskRequestBody>({
    common_type_ids: [],
    model_id: model_id,
    model_name: model_name,
  });

  const selectedActionTask = getSelectedOptions(actionTaskData, actionTaskModal.common_type_ids);

  const [clearOtherInput, setClearOtherInput] = useState<boolean>(false);

  useEffect(() => {
    getActionTask().then((res) => {
      if (res) {
        setActionTaskData(
          res.map((el) => ({
            label: el.name,
            value: el.id,
          })),
        );
      }
    });
  }, []);

  const onChangeActionTask = (selectedOption: CheckboxValue[]) => {
    setActionTaskModal((prevState) => ({
      ...prevState,
      common_type_ids: selectedOption.map((el) =>
        String(el.value === 'other' ? el.label : el.value),
      ),
    }));
  };

  const handleSubmitActionTask = () => {
    if (actionTaskModal.common_type_ids.length === 0) {
      // close popup
      closeModal();
    } else {
      createActionTask(actionTaskModal).then((isSuccess) => {
        if (isSuccess) {
          setClearOtherInput(true);
          // clear data
          setActionTaskModal({
            common_type_ids: [],
            model_id: model_id,
            model_name: model_name,
          });

          // close popup
          closeModal();

          // reload table to get/update actions-tasks list
          if (model_name !== 'none') {
            store.dispatch(setReloadActionTaskTable(true));
            store.dispatch(setActionTaskModalVisible(false));
          }
        }
      });
    }
  };

  return (
    <Popover
      className={`${isMobile ? styles.modalOnMobile : styles.modal}`}
      title="SELECT ACTIONS/TASKS"
      visible
      onFormSubmit={handleSubmitActionTask}
    >
      <CustomCheckbox
        options={actionTaskData}
        selected={selectedActionTask}
        isCheckboxList
        otherInput
        clearOtherInput={clearOtherInput}
        onChange={onChangeActionTask}
        checkboxClass={styles.checkBoxList}
      />
    </Popover>
  );
};
