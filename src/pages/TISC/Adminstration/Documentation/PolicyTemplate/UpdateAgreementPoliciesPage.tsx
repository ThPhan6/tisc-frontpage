import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { useParams } from 'umi';

import { ReactComponent as ActionRemoveIcon } from '@/assets/icons/action-remove.svg';

import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';

import { AgreementPoliciesProps } from './types';

import { EntryFormWrapper, contentId } from '@/components/EntryForm';
import { FormGroup } from '@/components/Form';
import { CustomEditorInput } from '@/components/Form/CustomEditorInput';
import { CustomInput } from '@/components/Form/CustomInput';
import { TableHeader } from '@/components/Table/TableHeader';

import { getOnePolicyTemplete, updatePolicyTemplate } from './api';
import styles from './styles/AgreementPoliciesEntryForm.less';

const DEFAULT_AGREEMENTPOLICIES_VALUE = {
  title: '',
  message: '',
};

const UpdateAgreementPoliciesPage = () => {
  const isLoading = useBoolean();
  const submitButtonStatus = useBoolean();
  const loadingEmail = useBoolean(true);
  const [value, setValue] = useState<AgreementPoliciesProps>(DEFAULT_AGREEMENTPOLICIES_VALUE);
  const params = useParams<{ id: string }>();

  const fetchOne = () => {
    getOnePolicyTemplete(params.id).then((res) => {
      loadingEmail.setValue(false);
      if (res) {
        setValue({
          message: res.document.document,
          title: res.title,
        });
      }
    });
  };

  useEffect(() => {
    fetchOne();
  }, []);

  const handleOnChangeTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue((state) => ({ ...state, title: e.target.value }));
  };
  const handleRemoveTitleInput = () => {
    setValue((state) => ({ ...state, title: '' }));
  };

  /// only get content entered
  const handleOnChangeMessageInput = (html: string) => {
    setValue((state) => ({ ...state, message: html }));
  };

  const handleSubmit = () => {
    isLoading.setValue(true);
    submitButtonStatus.setValue(true);
    updatePolicyTemplate(params.id, {
      title: value.title,
      document: {
        document: value.message,
      },
    }).then((isSuccess) => {
      isLoading.setValue(false);
      setTimeout(() => {
        submitButtonStatus.setValue(false);
      }, 1000);
      if (isSuccess) {
        fetchOne();
      }
    });
  };

  const handleCancel = () => {
    pushTo(PATH.policy);
  };

  return (
    <div>
      <TableHeader title="AGREEMENT / POLICIES / TERMS" />

      <div className={styles.container}>
        <EntryFormWrapper
          handleCancel={handleCancel}
          handleSubmit={handleSubmit}
          submitButtonStatus={submitButtonStatus.value}
          entryFormTypeOnMobile="">
          <FormGroup label="Title" required={true} layout="vertical" formClass={styles.title}>
            <div className={styles.title_field}>
              <CustomInput
                borderBottomColor="mono-medium"
                placeholder="document title"
                onChange={handleOnChangeTitleInput}
                value={value.title}
                className={value.title && styles.title_input}
              />
              {value.title && (
                <ActionRemoveIcon className={styles.remove_icon} onClick={handleRemoveTitleInput} />
              )}
            </div>
          </FormGroup>

          <FormGroup label="Document" required={true} layout="vertical" formClass={styles.editor} />

          {/* do not wrap CustomEditorInout component inside FormGroup */}
          <CustomEditorInput
            loading={loadingEmail.value}
            initData={value.message}
            onChangeText={(input) => handleOnChangeMessageInput(input)}
            containerSelector={`#${contentId}`}
          />
        </EntryFormWrapper>
      </div>
    </div>
  );
};

export default UpdateAgreementPoliciesPage;
