import { TableHeader } from '@/components/Table/TableHeader';
import styles from './styles/CreateOptionPage.less';
import { ReactComponent as PlusIcon } from '@/assets/icons/button-plus-disabled-icon.svg';
import OptionEntryForm from './components/OptionsEntryForm';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';
import { IBasisOptionForm } from './types';
import { useBoolean } from '@/helper/hook';
import { STATUS_RESPONSE } from '@/constants/util';
import { createOptionMiddleWare } from './services/api';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';

const CreateOptionPage = () => {
  const isLoading = useBoolean();

  const handleCancel = () => {
    pushTo(PATH.options);
  };

  const handleCreateOption = (data: IBasisOptionForm) => {
    const subsOptionData = data.subs.map((subs) => {
      return subs.isUsingImage
        ? {
            name: subs.name,
            subs: subs.subs.map((subsOption) => {
              return {
                image: subsOption.image?.split(',')[1],
                value_1: subsOption.value_1,
                value_2: subsOption.value_2,
                unit_1: subsOption.unit_2,
                unit_2: subsOption.unit_2,
              };
            }),
          }
        : {
            name: subs.name,
            subs: subs.subs.map((subsOption) => {
              return {
                value_1: subsOption.value_1,
                value_2: subsOption.value_2,
                unit_1: subsOption.unit_2,
                unit_2: subsOption.unit_2,
              };
            }),
          };
    });

    const submitData = {
      name: data.name,
      subs: subsOptionData,
    };

    console.log(submitData);

    isLoading.setValue(true);

    createOptionMiddleWare(submitData, (type: STATUS_RESPONSE, msg?: string) => {
      if (type === STATUS_RESPONSE.SUCCESS) {
        message.success(MESSAGE_NOTIFICATION.CREATE_OPTION_SUCCESS);
        setTimeout(() => {
          pushTo(PATH.options);
        }, 1000);
      } else {
        message.error(msg);
      }
      isLoading.setValue(false);
    });
  };

  return (
    <div className={styles.container}>
      <TableHeader
        customClass={styles.container__header}
        title={'OPTION'}
        rightAction={<PlusIcon />}
      />
      <div className={styles.container_content}>
        <OptionEntryForm onCancel={handleCancel} onSubmit={handleCreateOption} />
      </div>
    </div>
  );
};

export default CreateOptionPage;
