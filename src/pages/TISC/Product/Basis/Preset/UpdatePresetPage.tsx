import { TableHeader } from '@/components/Table/TableHeader';
import { PresetsEntryForm } from './components/PresetsEntryForm';
import styles from './styles/CreatePresetPage.less';
import { ReactComponent as PlusIcon } from '@/assets/icons/button-plus-disabled-icon.svg';
import LoadingPageCustomize from '@/components/LoadingPage';
import { useBoolean } from '@/helper/hook';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { presetsValueDefault, PresetsValueProp } from './types';
import { useParams } from 'umi';
import { useEffect, useState } from 'react';
import { getOnePresetMiddleware } from './services/api';

const UpdatePresetPage = () => {
  const [presetValue, setPresetValue] = useState<PresetsValueProp>(presetsValueDefault);
  const isLoading = useBoolean();
  const submitButtonStatus = useBoolean(false);
  const params = useParams<{
    id: string;
  }>();
  const idPreset = params?.id || '';

  useEffect(() => {
    if (idPreset) {
      isLoading.setValue(true);
      getOnePresetMiddleware(
        idPreset,
        (dataRes: PresetsValueProp) => {
          if (dataRes) {
            setPresetValue(dataRes);
          }
          isLoading.setValue(false);
        },
        () => {
          isLoading.setValue(false);
        },
      );
      return;
    }
    pushTo(PATH.presets);
  }, []);

  const handleCancel = () => {
    pushTo(PATH.presets);
  };

  const handleUpdatePreset = (data: PresetsValueProp) => {
    console.log(data);
  };

  return (
    <div className={styles.container}>
      <TableHeader
        customClass={styles.container__header}
        title={'PRESETS'}
        rightAction={<PlusIcon />}
      />
      <div className={styles.container__content}>
        <PresetsEntryForm
          onSubmit={handleUpdatePreset}
          onCancel={handleCancel}
          submitButtonStatus={submitButtonStatus.value}
          presetsValue={presetValue}
        />
      </div>
      {isLoading.value && <LoadingPageCustomize />}
    </div>
  );
};

export default UpdatePresetPage;
