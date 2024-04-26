import { createContext, useState } from 'react';

import { ProductBasisFormType, useProductBasicEntryForm } from '../../Basis/hook';

import type { AttributeSubForm } from '@/types';

import ContentTypeModal from './ContentTypeModal';

export const AttributeEntryFormContext = createContext<{
  openContentTypeModal: boolean;
  setOpenContentTypeModal: (openContentTypeModal: boolean) => void;

  /// for save data from attribute to inside modal
  contentTypeSelected?: AttributeSubForm;
  setContentTypeSelected?: (contentType: AttributeSubForm) => void;

  /// for save data inside modal to attribute(save after submit)
  attributeSelected?: AttributeSubForm;
  setAttributeSelected?: (attributeSelected: AttributeSubForm) => void;
}>({
  openContentTypeModal: false,
  setOpenContentTypeModal: () => null,
  setContentTypeSelected: () => null,
});

const AttributeEntryForm = () => {
  const [contentTypeSelected, setContentTypeSelected] = useState<AttributeSubForm>();
  const [attributeSelected, setAttributeSelected] = useState<AttributeSubForm>();

  const [openContentTypeModal, setOpenContentTypeModal] = useState<boolean>(false);

  const { renderProductBasicEntryForm } = useProductBasicEntryForm(
    ProductBasisFormType.attributes,

    /// attribute selected after submit from select content type
    attributeSelected,
  );

  return (
    <AttributeEntryFormContext.Provider
      value={{
        attributeSelected,
        setAttributeSelected,
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
