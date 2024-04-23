import { createContext, useState } from 'react';

import { ProductBasisFormType, useProductBasicEntryForm } from '../../Basis/hook';

import type { AttributeSubForm } from '@/types';

import ContentTypeModal from './ContentTypeModal';

const DEFAULT_CONTENT_TYPE: AttributeSubForm = {
  basis_id: '',
  name: '',
  description: '',
};

export const AttributeEntryFormContext = createContext<{
  openContentTypeModal: boolean;
  setOpenContentTypeModal: (openContentTypeModal: boolean) => void;
  contentTypeSelected: AttributeSubForm;
  setContentTypeSelected: (contentType: AttributeSubForm) => void;
}>({
  openContentTypeModal: false,
  setOpenContentTypeModal: () => null,
  contentTypeSelected: DEFAULT_CONTENT_TYPE,
  setContentTypeSelected: () => null,
});

const AttributeEntryForm = () => {
  const { renderProductBasicEntryForm } = useProductBasicEntryForm(ProductBasisFormType.attributes);

  const [contentTypeSelected, setContentTypeSelected] =
    useState<AttributeSubForm>(DEFAULT_CONTENT_TYPE);

  const [openContentTypeModal, setOpenContentTypeModal] = useState<boolean>(false);

  return (
    <AttributeEntryFormContext.Provider
      value={{
        contentTypeSelected,
        openContentTypeModal,
        setOpenContentTypeModal,
        setContentTypeSelected,
      }}
    >
      {renderProductBasicEntryForm()}

      <ContentTypeModal />
    </AttributeEntryFormContext.Provider>
  );
};

export default AttributeEntryForm;
