import { FC, useState } from 'react';

import { useParams } from 'umi';

import { ReactComponent as BrandIcon } from '@/assets/icons/brand-icon.svg';
import { ReactComponent as MaterialIcon } from '@/assets/icons/material-product-icon.svg';
import { ReactComponent as PrintIcon } from '@/assets/icons/print-icon.svg';
import { ReactComponent as SpaceIcon } from '@/assets/icons/space-icon.svg';

import { useScreen } from '@/helper/common';

import ProjectTabContentHeader from '../../components/ProjectTabContentHeader';
import CustomButton from '@/components/Button';
import ActionButton from '@/components/Button/ActionButton';
import { CustomTabPane } from '@/components/Tabs';
import { BodyText } from '@/components/Typography';

import ProductSpecifyToPDF from './ProductSpecifyToPDF';
import SpecificationByBrand from './SpecificationByBrand';
import { SpecificationByMaterial } from './SpecificationByMaterial';
import SpecificationBySpace from './SpecificationBySpace';
import styles from './index.less';

type viewBy = 'brand' | 'material' | 'space' | 'pdf';

const ProductSpecification: FC = () => {
  const isMobile = useScreen().isMobile;

  const [viewBy, setViewBy] = useState<viewBy>('brand');
  const params = useParams<{ id: string }>();

  return (
    <div>
      <ProjectTabContentHeader
        style={isMobile ? { justifyContent: 'space-between', width: '100%' } : undefined}
      >
        <div className="flex-start">
          {isMobile ? null : (
            <BodyText
              level={4}
              fontFamily="Cormorant-Garamond"
              color="mono-color"
              style={{ fontWeight: '600' }}
            >
              View By:
            </BodyText>
          )}
          <ActionButton
            active={viewBy === 'brand'}
            icon={<BrandIcon style={{ width: 16, height: 16 }} />}
            onClick={() => setViewBy('brand')}
            title="Brand"
            className={styles.customActionButton}
            short={isMobile}
          />
          <ActionButton
            active={viewBy === 'material'}
            icon={<MaterialIcon style={{ width: 16, height: 16 }} />}
            onClick={() => setViewBy('material')}
            title="Material"
            className={styles.customActionButton}
            short={isMobile}
          />
          <ActionButton
            active={viewBy === 'space'}
            icon={<SpaceIcon style={{ width: 16, height: 16 }} />}
            onClick={() => setViewBy('space')}
            title="Space"
            className={styles.customActionButton}
            short={isMobile}
          />
        </div>
        <CustomButton
          properties="rounded"
          size="small"
          variant="secondary"
          buttonClass={styles.button}
          onClick={() => setViewBy('pdf')}
          active={viewBy === 'pdf'}
        >
          <PrintIcon />
          PDF
        </CustomButton>
      </ProjectTabContentHeader>

      <CustomTabPane active={viewBy === 'brand'} lazyLoad forceReload>
        <SpecificationByBrand projectId={params.id} />
      </CustomTabPane>

      <CustomTabPane active={viewBy === 'material'} lazyLoad forceReload>
        <SpecificationByMaterial />
      </CustomTabPane>

      <CustomTabPane active={viewBy === 'space'} lazyLoad forceReload>
        <SpecificationBySpace projectId={params.id} />
      </CustomTabPane>

      <CustomTabPane active={viewBy === 'pdf'}>
        <ProductSpecifyToPDF projectId={params.id} />
      </CustomTabPane>
    </div>
  );
};

export default ProductSpecification;
