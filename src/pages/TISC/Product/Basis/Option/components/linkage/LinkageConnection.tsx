import { Col } from 'antd';

import { ReactComponent as InactivePairIcon } from '@/assets/icons/inactive-pair-icon-16.svg';
import { ReactComponent as PairIcon } from '@/assets/icons/pair-icon-16.svg';
import { ReactComponent as UnPairIcon } from '@/assets/icons/unpair-icon-16.svg';

import store, { useAppSelector } from '@/reducers';

import { BodyText } from '@/components/Typography';

import { LinkedOption, updateLinkedOptionStatus } from '../../store';
import style from '../Linkage.less';

export const LinkageConnection = () => {
  const connectionList = useAppSelector((state) => state.linkage.connectionList);
  const rootSubItemProductId = useAppSelector((state) => state.linkage.rootSubItemProductId);
  const chosenOptionIds = useAppSelector((state) => state.linkage.chosenOptionIds);

  const handleChangeConnectionStatus = (item: LinkedOption) => () => {
    store.dispatch(updateLinkedOptionStatus(item));
  };

  return (
    <Col span={6} className={style.borderLeft}>
      <div className="border-bottom-light">
        <div className="flex-between" style={{ margin: '0 8px 8px', minHeight: 32 }}>
          <BodyText level={4}>Connection List</BodyText>
          <BodyText level={4}>Status</BodyText>
        </div>
      </div>
      <div>
        {!connectionList.length ? (
          <BodyText
            level={6}
            fontFamily="Roboto"
            color="mono-color-medium"
            style={{ padding: '0 8px' }}
          >
            select the product from left
          </BodyText>
        ) : (
          connectionList.map((item, index) => {
            return (
              <div
                key={index}
                className="flex-between"
                style={{ padding: '0 8px 8px', minHeight: 20 }}
              >
                <BodyText fontFamily="Roboto" level={6}>
                  {rootSubItemProductId} to {item.productId}
                </BodyText>

                {chosenOptionIds.includes(item.pairId) ? (
                  <div className="cursor-pointer" onClick={handleChangeConnectionStatus(item)}>
                    {item.isPair ? <PairIcon title="pair" /> : <UnPairIcon title="unpair" />}
                  </div>
                ) : (
                  <div>
                    <InactivePairIcon title="inactive" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </Col>
  );
};
