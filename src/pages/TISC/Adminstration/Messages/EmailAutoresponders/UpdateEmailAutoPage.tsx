import LoadingPageCustomize from '@/components/LoadingPage';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { TableHeader } from '@/components/Table/TableHeader';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { useEffect, useState } from 'react';
import { EmailAutoRespondEntryForm } from './components/EmailAutorespondersEntryForm';
import { getOneEmailAuto, getTargetedForList, getTopicList, updateEmailAuto } from '@/services';
import { IEmailAutoRadioListProps, IEmailAutoRespondForm } from '@/types';
import { useParams } from 'umi';

const DEFAULT_EMAILAUTORESPONDERS_VALUE: IEmailAutoRespondForm = {
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
  const [value, setValue] = useState<IEmailAutoRespondForm>(DEFAULT_EMAILAUTORESPONDERS_VALUE);
  /// for topic list
  const [topicList, setTopicList] = useState<IEmailAutoRadioListProps[]>([]);
  /// for targeted-for list
  const [targetedForList, setTargetedForList] = useState<IEmailAutoRadioListProps[]>([]);

  const handleOnChange = (newValue: IEmailAutoRespondForm) => {
    setValue(newValue);
  };

  console.log(value);

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
    getOneEmailAutoData();
    /// load topic list
    getTopicEmailAutoList();

    /// load targeted-for list
    getTargetedForEmailAutoList();
  }, []);

  /// load email auto form data
  // useEffect(() => {
  // }, []);

  const handleUpdateEmailAuto = (data: IEmailAutoRespondForm) => {
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
