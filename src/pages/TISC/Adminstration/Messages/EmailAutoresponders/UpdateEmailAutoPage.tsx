import LoadingPageCustomize from '@/components/LoadingPage';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { TableHeader } from '@/components/Table/TableHeader';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { useEffect, useState } from 'react';
import { ReactComponent as ActionRemoveIcon } from '@/assets/icons/action-remove.svg';
import { getOneEmailAuto, getTargetedForList, getTopicList, updateEmailAuto } from '@/services';
import { RadioItem, EmailTemplate } from '@/types';
import { useParams } from 'umi';
import { contentId, EntryFormWrapper } from '@/components/EntryForm';
import { FormGroup } from '@/components/Form';
import styles from './styles/EmailAutorespondersEntryForm.less';
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import { useDrag } from './utils/useDrag';
import { CustomRadio } from '@/components/CustomRadio';
import { CustomInput } from '@/components/Form/CustomInput';
import { CustomEditorInput } from '@/components/Form/CustomEditorInput';

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
  const { dragStart, dragStop, onWheel, handleDrag } = useDrag();

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

  const handleOnChangeRadio = (
    typeRadio: 'topic' | 'targeted_for',
    valueRadio: string | boolean,
  ) => {
    setFormState((state) => ({
      ...state,
      [typeRadio]: valueRadio,
    }));
  };

  const handleUpdateEmailAuto = () => {
    isLoading.setValue(true);
    updateEmailAuto(idEmailAuto, formState).then((isSuccess) => {
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

  const handleOnChangeTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeState('title', e.target.value);
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
      <TableHeader title="Email Autoresponders" rightAction={<CustomPlusButton disabled />} />
      <div className={styles.container}>
        <EntryFormWrapper
          handleSubmit={handleUpdateEmailAuto}
          submitButtonStatus={submitButtonStatus.value}
        >
          {/* Topic */}
          <FormGroup label="Topic" required={true} layout="vertical" formClass={styles.radio_form}>
            <div onMouseLeave={() => dragStop}>
              <ScrollMenu
                onWheel={onWheel}
                onMouseDown={() => dragStart}
                onMouseMove={handleDrag}
                onMouseUp={() => dragStop}
              >
                {topicList.map((item) => (
                  <CustomRadio
                    key={item.value}
                    direction="horizontal"
                    value={formState.topic}
                    onChange={(radioValue) => onChangeState('topic', radioValue.value)}
                    options={[{ value: item.value, label: item.key }]}
                    containerClass={styles.radio_container}
                  />
                ))}
              </ScrollMenu>
            </div>
          </FormGroup>

          {/* Targeted For */}
          <FormGroup
            label="Targeted For"
            required={true}
            layout="vertical"
            formClass={styles.radio_form}
          >
            <div onMouseLeave={() => dragStop}>
              <ScrollMenu
                onWheel={onWheel}
                onMouseDown={() => dragStart}
                onMouseMove={handleDrag}
                onMouseUp={() => dragStop}
              >
                {targetedForList.map((item) => (
                  <CustomRadio
                    key={item.value}
                    direction="horizontal"
                    value={formState.targeted_for}
                    onChange={(radioValue) => handleOnChangeRadio('targeted_for', radioValue.value)}
                    options={[{ value: item.value, label: item.key }]}
                    containerClass={styles.radio_container}
                  />
                ))}
              </ScrollMenu>
            </div>
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

          <FormGroup label="Document" required={true} layout="vertical" formClass={styles.editor} />
          {/* Message */}
          {
            <CustomEditorInput
              loading={loadingEmail}
              onChangeText={handleOnChangeMessageInput}
              initData={formState.message}
              containerSelector={`#${contentId}`}
            />
          }
        </EntryFormWrapper>
      </div>

      {isLoading.value && <LoadingPageCustomize />}
    </div>
  );
};

export default UpdateEmailAutoPage;
