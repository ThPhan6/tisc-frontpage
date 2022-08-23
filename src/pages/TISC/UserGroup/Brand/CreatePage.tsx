import { TISCAccessLevelDataRole } from '../../Adminstration/TeamProfiles/constants/role';
import { PATH } from '@/constants/path';
import { PageContainer } from '@ant-design/pro-layout';

import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { inviteUser } from '@/services';

import BrandEntryForm from './components/BrandEntryForm';
import BrandMenuSummary from './components/BrandMenuSummary';
import LoadingPageCustomize from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

const BrandCreatePage = () => {
  const submitButtonStatus = useBoolean(false);
  const isLoading = useBoolean(false);

  const handleInvite = (userId: string) => {
    inviteUser(userId);
    pushTo(PATH.tiscUserGroupBrandList);
  };

  const handleCancel = () => {
    pushTo(PATH.tiscUserGroupBrandList);
  };

  const handleCreateData = () =>
    // submitData: TISCUserGroupBrandForm,
    // callBack?: (userId: string) => void,
    {
      isLoading.setValue(true);
      // createBrandTISCUserGroup(submitData).then((brandUserGroup) => {
      //   isLoading.setValue(false);
      //   if (brandUserGroup) {
      //     submitButtonStatus.setValue(true);
      //     if (callBack) {
      //       callBack(brandUserGroup.id ?? '');
      //     } else {
      //       pushTo(PATH.tiscUserGroupBrandList);
      //     }
      //   }
      // });
    };

  return (
    <PageContainer pageHeaderRender={() => <BrandMenuSummary />}>
      <TableHeader title="BRANDS" rightAction={<CustomPlusButton disabled />} />
      <BrandEntryForm
        onCancel={handleCancel}
        onSubmit={handleCreateData}
        handleInvite={handleInvite}
        submitButtonStatus={submitButtonStatus.value}
        AccessLevelDataRole={TISCAccessLevelDataRole}
        // role="TISC"
      />
      {isLoading.value && <LoadingPageCustomize />}
    </PageContainer>
  );
};

export default BrandCreatePage;
