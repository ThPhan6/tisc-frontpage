import { TableHeader } from '@/components/Table/TableHeader';
import { useBoolean } from '@/helper/hook';
import { useEffect, useState } from 'react';
import { getOnePolicyTemplete, updatePolicyTemplate } from './api';
import { AgreementPoliciesProps } from './types';

import styles from './styles/AgreementPoliciesEntryForm.less';
import { contentId, EntryFormWrapper } from '@/components/EntryForm';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';

import { ReactComponent as ActionRemoveIcon } from '@/assets/icons/action-remove.svg';
import { CustomEditorInput } from '@/components/Form/CustomEditorInput';
import { REGEX_GET_CONTENT_ONLY } from '@/helper/utils';
import { useHistory, useParams } from 'umi';

const DEFAULT_AGREEMENTPOLICIES_VALUE = {
  title: '',
  message: '',
};

const CreateAgreementPoliciesPage = () => {
  const isLoading = useBoolean();
  const submitButtonStatus = useBoolean();
  const [value, setValue] = useState<AgreementPoliciesProps>(DEFAULT_AGREEMENTPOLICIES_VALUE);
  const params = useParams<{ id: string }>();
  const history = useHistory();

  const fetchOne = () => {
    getOnePolicyTemplete(params.id).then((res) => {
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
    setValue((state) => ({ ...state, message: html.replace(REGEX_GET_CONTENT_ONLY, '') }));
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

  return (
    <div>
      <TableHeader title="AGREEMENT / POLICIES / TERMS" />

      <div className={styles.container}>
        <EntryFormWrapper
          handleSubmit={handleSubmit}
          handleCancel={history.goBack}
          submitButtonStatus={submitButtonStatus.value}
        >
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
          {value.message && (
            <CustomEditorInput
              initData={value.message}
              onChangeText={(input) => handleOnChangeMessageInput(input)}
              placeholder="type text..."
              containerSelector={`#${contentId}`}
            />
          )}
        </EntryFormWrapper>
      </div>
    </div>
  );
};

export default CreateAgreementPoliciesPage;
