import { useEffect, useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';
import { PATH } from '@/constants/path';
import { message } from 'antd';

import { ReactComponent as ActionRemoveIcon } from '@/assets/icons/action-remove.svg';

import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId } from '@/helper/hook';
import { getOneEmailAuto, getTargetedForList, getTopicList, updateEmailAuto } from '@/services';
import { isEmpty, trimStart } from 'lodash';

import { EmailTemplate, RadioItem } from '@/types';

import { CustomRadio } from '@/components/CustomRadio';
import { EntryFormWrapper, contentId } from '@/components/EntryForm';
import { FormGroup } from '@/components/Form';
import { CustomEditorInput } from '@/components/Form/CustomEditorInput';
import { CustomInput } from '@/components/Form/CustomInput';
import ScrollBar from '@/components/ScrollBar';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import styles from './styles/EmailAutorespondersEntryForm.less';
import { showPageLoading } from '@/features/loading/loading';

const DEFAULT_EMAILAUTORESPONDERS_VALUE: EmailTemplate = {
  topic: '',
  targeted_for: '',
  title: '',
  message: '',
};

const UpdateEmailAutoPage = () => {
  const submitButtonStatus = useBoolean(false);
  const idEmailAuto = useGetParamId();

  /// email auto form
  const [formState, setFormState] = useState<EmailTemplate>(DEFAULT_EMAILAUTORESPONDERS_VALUE);
  const [loadingEmail, setLoadingEmail] = useState(false);
  /// for topic list
  const [topicList, setTopicList] = useState<RadioItem[]>([]);
  /// for targeted-for list
  const [targetedForList, setTargetedForList] = useState<RadioItem[]>([]);

  /// get topic list
  const getTopicEmailAutoList = () => {
    getTopicList().then((topicData) => {
      if (topicData) {
        setTopicList(topicData);
      }
    });
  };

  /// get targeted-for list
  const getTargetedForEmailAutoList = () => {
    getTargetedForList().then((targetedForData) => {
      if (targetedForData) {
        setTargetedForList(targetedForData);
      }
    });
  };

  /// get data want to update
  const getOneEmailAutoData = () => {
    getOneEmailAuto(idEmailAuto).then((data) => {
      setLoadingEmail(true);
      if (data) {
        setFormState(data);
      }
    });
  };

  useEffect(() => {
    /// load topic list
    getTopicEmailAutoList();

    /// load targeted-for list
    getTargetedForEmailAutoList();
  }, []);

  // load email auto form data
  useEffect(() => {
    getOneEmailAutoData();
  }, []);

  const onChangeState = (
    key: keyof typeof DEFAULT_EMAILAUTORESPONDERS_VALUE,
    value: string | boolean,
  ) => {
    setFormState((state) => ({
      ...state,
      [key]: value,
    }));
  };

  const handleCancel = () => {
    pushTo(PATH.emailAuto);
  };

  const handleUpdateEmailAuto = () => {
    if (isEmpty(formState.message)) {
      message.error(MESSAGE_ERROR.EMAIL_AUTO);
    } else {
      showPageLoading();

      updateEmailAuto(idEmailAuto, {
        ...formState,
        title: formState.title.trim(),
      }).then((isSuccess) => {
        if (isSuccess) {
          submitButtonStatus.setValue(true);
          setTimeout(() => {
            submitButtonStatus.setValue(false);
          }, 1000);
        }
      });
    }
  };

  const handleOnChangeTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeState('title', trimStart(e.target.value));
  };
  const handleRemoveTitleInput = () => {
    onChangeState('title', '');
  };

  /// only get content entered
  const handleOnChangeMessageInput = (html: string) => {
    onChangeState('message', html);
  };

  return (
    <div>
      <TableHeader title="Email Autoresponder" rightAction={<CustomPlusButton disabled />} />
      <div className={styles.container}>
        <EntryFormWrapper
          handleCancel={handleCancel}
          handleSubmit={handleUpdateEmailAuto}
          submitButtonStatus={submitButtonStatus.value}>
          {/* Topic */}
          <FormGroup label="Topic" required={true} layout="vertical" formClass={styles.radio_form}>
            <ScrollBar>
              {topicList.map((item) => (
                <CustomRadio
                  key={item.value}
                  direction="horizontal"
                  value={formState.topic}
                  options={[{ value: item.value, label: item.key }]}
                  containerClass={styles.radio_container}
                />
              ))}
            </ScrollBar>
          </FormGroup>

          {/* Targeted For */}
          <FormGroup
            label="Targeted For"
            required={true}
            layout="vertical"
            formClass={styles.radio_form}>
            <ScrollBar>
              {targetedForList.map((item) => (
                <CustomRadio
                  key={item.value}
                  direction="horizontal"
                  value={formState.targeted_for}
                  options={[{ value: item.value, label: item.key }]}
                  containerClass={styles.radio_container}
                />
              ))}
            </ScrollBar>
          </FormGroup>

          {/* Title */}
          <FormGroup label="Title" required={true} layout="vertical" formClass={styles.title}>
            <div className={styles.title_field}>
              <CustomInput
                borderBottomColor="mono-medium"
                placeholder="message title"
                onChange={handleOnChangeTitleInput}
                value={formState.title}
                className={formState.title && styles.title_input}
              />
              {formState.title && (
                <ActionRemoveIcon className={styles.remove_icon} onClick={handleRemoveTitleInput} />
              )}
            </div>
          </FormGroup>

          {/* Message */}
          <FormGroup label="Message" required={true} layout="vertical" formClass={styles.editor} />
          <CustomEditorInput
            loading={loadingEmail}
            onChangeText={handleOnChangeMessageInput}
            initData={formState.message}
            containerSelector={`#${contentId}`}
          />
        </EntryFormWrapper>
      </div>
    </div>
  );
};

export default UpdateEmailAutoPage;
