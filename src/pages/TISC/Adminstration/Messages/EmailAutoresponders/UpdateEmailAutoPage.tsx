import LoadingPageCustomize from '@/components/LoadingPage';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { TableHeader } from '@/components/Table/TableHeader';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { useEffect, useState } from 'react';
import { EmailAutoRespondEntryForm } from './components/EmailAutorespondersEntryForm';
import { getOneEmailAuto, getTargetedForList, getTopicList, updateEmailAuto } from '@/services';
import { RadioItem, EmailTemplate } from '@/types';
import { useParams } from 'umi';

const DEFAULT_EMAILAUTORESPONDERS_VALUE: EmailTemplate = {
  topic: '',
  targeted_for: '',
  title: '',
  message: '',
};

const UpdateEmailAutoPage = () => {
  const submitButtonStatus = useBoolean(false);
  const isLoading = useBoolean();
  const params = useParams<{ id: string }>();
  const idEmailAuto = params?.id || '';

  /// email auto form
  const [value, setValue] = useState<EmailTemplate>(DEFAULT_EMAILAUTORESPONDERS_VALUE);
  /// for topic list
  const [topicList, setTopicList] = useState<RadioItem[]>([]);
  /// for targeted-for list
  const [targetedForList, setTargetedForList] = useState<RadioItem[]>([]);

  const handleOnChange = (newValue: EmailTemplate) => {
    setValue(newValue);
  };

  const handleCancel = () => {
    pushTo(PATH.emailAuto);
  };

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
      if (data) {
        setValue(data);
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

  const handleUpdateEmailAuto = (data: EmailTemplate) => {
    isLoading.setValue(true);
    updateEmailAuto(idEmailAuto, data).then((isSuccess) => {
      isLoading.setValue(false);
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          pushTo(PATH.emailAuto);
        }, 1000);
        return;
      }
    });
  };

  return (
    <div>
      <TableHeader title="Email Autoresponders" rightAction={<CustomPlusButton disabled />} />
      <EmailAutoRespondEntryForm
        value={value}
        onChange={handleOnChange}
        onCancel={handleCancel}
        onSubmit={handleUpdateEmailAuto}
        submitButtonStatus={submitButtonStatus.value}
        topicList={topicList}
        targetedForList={targetedForList}
      />
      {isLoading.value && <LoadingPageCustomize />}
    </div>
  );
};

export default UpdateEmailAutoPage;
