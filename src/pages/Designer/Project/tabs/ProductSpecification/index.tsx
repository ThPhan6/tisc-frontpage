import ActionButton from '@/components/Button/ActionButton';
import { BodyText } from '@/components/Typography';
import { FC, useState } from 'react';
import ProjectTabContentHeader from '../../components/ProjectTabContentHeader';
import { ReactComponent as BrandIcon } from '@/assets/icons/brand-icon.svg';
import { ReactComponent as MaterialIcon } from '@/assets/icons/material-product-icon.svg';
import { ReactComponent as SpaceIcon } from '@/assets/icons/space-icon.svg';
import { ReactComponent as PrintIcon } from '@/assets/icons/print-icon.svg';
import CustomButton from '@/components/Button';
import styles from './index.less';
import { useParams } from 'umi';
import ProductSpecifyToPDF from './ProductSpecifyToPDF';
import SpecificationByBrand from './SpecificationByBrand';
import SpecificationBySpace from './SpecificationBySpace';
import { CustomTabPane } from '@/components/Tabs';
import { SpecificationByMaterial } from './SpecificationByMaterial';

type viewBy = 'brand' | 'material' | 'space' | 'pdf';

const ProductSpecification: FC = () => {
  const [viewBy, setViewBy] = useState<viewBy>('brand');
  const params = useParams<{ id: string }>();

  return (
    <div>
      <ProjectTabContentHeader>
        <BodyText
          level={4}
          fontFamily="Cormorant-Garamond"
          color="mono-color"
          style={{ fontWeight: '600', marginRight: 4 }}
        >
          View By:
        </BodyText>
        <ActionButton
          active={viewBy === 'brand'}
          icon={<BrandIcon />}
          onClick={() => setViewBy('brand')}
          title="Brand"
        />
        <ActionButton
          active={viewBy === 'material'}
          icon={<MaterialIcon />}
          onClick={() => setViewBy('material')}
          title="Material"
        />
        <ActionButton
          active={viewBy === 'space'}
          icon={<SpaceIcon />}
          onClick={() => setViewBy('space')}
          title="Space"
        />
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

      <CustomTabPane active={viewBy === 'brand'}>
        <SpecificationByBrand projectId={params.id} />
      </CustomTabPane>

      <CustomTabPane active={viewBy === 'material'}>
        <SpecificationByMaterial />
      </CustomTabPane>

      <CustomTabPane active={viewBy === 'space'}>
        <SpecificationBySpace projectId={params.id} />
      </CustomTabPane>

      <CustomTabPane active={viewBy === 'pdf'}>
        <ProductSpecifyToPDF />
      </CustomTabPane>
    </div>
  );
};

export default ProductSpecification;
