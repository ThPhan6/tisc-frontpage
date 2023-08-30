import { useLocation } from 'umi';

import store, { useAppSelector } from '@/reducers';

import CustomButton from '@/components/Button';
import { BodyText } from '@/components/Typography';

import {
  linkageSummarySelector,
  preSelectLinkageSummarySelector,
  setLinkageState,
} from '../../store';
import style from '../Linkage.less';

const titleProps = {
  fontFamily: 'Roboto',
  level: 4,
  style: { marginRight: 8 },
} as any;

const quantityProps = {
  fontFamily: 'Roboto',
  level: 4,
  style: { fontWeight: 500 },
} as any;

export const LinkageSummary = () => {
  const { state: linkageOptionState } = useLocation();
  // const { pickedOptionIds, options } = preLinkageState as {
  //   pickedOptionIds: string[];
  //   options: BasisOptionForm[];
  //   groupName: string;
  // };

  const groupName = useAppSelector((state) => state.linkage.groupName);

  const preSelectLinkageSummary = useAppSelector(preSelectLinkageSummarySelector);

  const linkageSummary = useAppSelector(linkageSummarySelector);

  const summary = !linkageOptionState ? preSelectLinkageSummary : linkageSummary;

  const handleClearAll = () => {
    if (!linkageOptionState) {
      store.dispatch(setLinkageState({ pickedOptionIds: [] }));
    } else {
      store.dispatch(
        setLinkageState({
          chosenOptionIds: [],
          connectionList: [],
          rootSubItemId: '',
          rootMainOptionId: '',
          rootSubItemProductId: '',
        }),
      );
    }
  };

  return (
    <div className={style.borderBottom}>
      <div className={style.topHeader}>
        <div className="flex-start">
          <BodyText fontFamily="Roboto" level={4} style={{ textTransform: 'uppercase' }}>
            Group Name :
          </BodyText>
          <BodyText
            fontFamily="Roboto"
            level={4}
            style={{ textTransform: 'uppercase', padding: '0 4px' }}
          >
            {groupName || (linkageOptionState as any)?.groupName}
          </BodyText>
        </div>
        <div className="flex-start">
          {summary.map((el, index) => {
            const key = Object.keys(el)[0];
            const value = Object.values(el)[0];

            return (
              <div key={index} className="flex-start" style={{ marginLeft: 24 }}>
                <BodyText {...titleProps}>{key}</BodyText>
                <BodyText {...quantityProps}>{value}</BodyText>
              </div>
            );
          })}

          <CustomButton
            size="small"
            buttonClass={style.clearAllBtn}
            onClick={handleClearAll}
            style={{ minWidth: 84 }}
          >
            <BodyText fontFamily="Roboto" level={6}>
              Deselect all
            </BodyText>
          </CustomButton>
        </div>
      </div>
    </div>
  );
};
