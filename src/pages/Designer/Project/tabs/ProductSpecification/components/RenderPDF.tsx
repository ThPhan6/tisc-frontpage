import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { ReactComponent as PaginationLeftIcon } from '@/assets/icons/pagination-left.svg';
import { ReactComponent as PaginationRightIcon } from '@/assets/icons/pagination-right.svg';
import TemplatePDF from '@/assets/images/page.png';

import { createPDF } from '@/features/project/services';

import { DetailPDF } from '../type';

import CustomButton from '@/components/Button';
import { BodyText } from '@/components/Typography';

import styles from '../index.less';
import moment from 'moment';

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.js`;

interface RenderPDFProps {
  generatePDF: any;
  data: DetailPDF;
}
export const RenderPDF: React.FC<RenderPDFProps> = ({ generatePDF, data }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = (response: any) => {
    setNumPages(response.numPages);
  };

  const handleDownloadPDF = async () => {
    await createPDF(data.config.project_id, {
      location_id: data.config.location_id,
      issuing_for_id: data.config.issuing_for_id,
      revision: data.config.revision,
      has_cover: data.config.has_cover,
      document_title: data.config.document_title,
      template_ids: data.config.has_cover
        ? [...data.config.template_cover_ids, ...data.config.template_standard_ids]
        : data.config.template_standard_ids,
    }).then((result) => {
      const linkSoure = new Blob([result], { type: 'application/pdf' });
      const downloadLink = document.createElement('a');
      const fileName = `${moment().format('YYYY-MM-DD')}.pdf`;
      downloadLink.href = window.URL.createObjectURL(linkSoure);
      downloadLink.download = fileName;
      downloadLink.click();
    });
  };

  return (
    <div className={styles.pdf}>
      <div style={{ height: 'calc(100vh - 296px)' }}>
        {generatePDF ? (
          <Document
            file={generatePDF}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => alert('Error while retrieving the outline! ' + error.message)}>
            <Page key={`page_${pageNumber + 1}`} pageNumber={pageNumber} />
          </Document>
        ) : (
          <img
            src={TemplatePDF}
            style={{ display: 'flex', margin: 'auto', height: 'calc(100vh - 312px)' }}
          />
        )}
      </div>
      <div className={styles.action}>
        {generatePDF ? (
          <div style={{ display: 'flex', marginRight: '32px' }}>
            <PaginationLeftIcon
              className={pageNumber === 1 ? 'disabled' : ''}
              onClick={() => {
                if (pageNumber === 1) {
                  return;
                }
                setPageNumber(pageNumber - 1);
              }}
            />
            <BodyText level={5} fontFamily="Roboto">
              {pageNumber} / {numPages}
            </BodyText>
            <PaginationRightIcon
              className={pageNumber === numPages ? 'disabled' : ''}
              onClick={() => {
                if (pageNumber === numPages) {
                  return;
                }
                setPageNumber(pageNumber + 1);
              }}
            />
          </div>
        ) : null}

        <CustomButton size="small" properties="rounded" onClick={handleDownloadPDF}>
          Download
        </CustomButton>
      </div>
    </div>
  );
};
