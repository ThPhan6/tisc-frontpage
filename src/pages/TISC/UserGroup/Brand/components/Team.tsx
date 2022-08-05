import TextForm from '@/components/Form/TextForm';
import { RenderLabelHeader, RenderMemberHeader } from '@/components/RenderHeaderLabel';
import { USER_STATUS_TEXTS } from '@/constants/util';
import { useGetParam } from '@/helper/hook';
import { getListTeamProfileGroupCountryByBrandId } from '@/services';
import { TeamProfileGroupCountry } from '@/types';
import { Col, Collapse, Row } from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { CollapseLevel1Props, CollapseLevel2Props } from '../../icons';
import indexStyles from '../../styles/index.less';

const BrandTeamDetail = () => {
  const [teamData, setTeamData] = useState<TeamProfileGroupCountry[]>([]);

  const brandId = useGetParam();

  useEffect(() => {
    if (brandId) {
      getListTeamProfileGroupCountryByBrandId(brandId).then(setTeamData);
    }
  }, []);

  return (
    <Row className={indexStyles.container}>
      <Col span={12}>
        <div className={indexStyles.form}>
          <Collapse {...CollapseLevel1Props}>
            {teamData.length &&
              teamData.map((team, index) => (
                <Collapse.Panel
                  header={
                    <RenderLabelHeader
                      header={team.country_name}
                      quantity={team.count}
                      isUpperCase={true}
                      isSubHeader={false}
                    />
                  }
                  key={index}
                  collapsible={
                    isEmpty(team.country_name) || team.count == 0 ? 'disabled' : undefined
                  }
                >
                  <Collapse {...CollapseLevel2Props}>
                    {team.users?.map((user, userIndex) => (
                      <Collapse.Panel
                        header={
                          <RenderMemberHeader
                            firstName={user.firstname}
                            lastName={user.lastname}
                            avatar={user.logo}
                          />
                        }
                        key={`${index}-${userIndex}`}
                        collapsible={isEmpty(user.firstname) ? 'disabled' : undefined}
                      >
                        <div className={indexStyles.info}>
                          <TextForm label="Gender">
                            {user.gender === true ? 'Male' : 'Female'}
                          </TextForm>
                          <TextForm label="Work Location">{user.work_location ?? ''}</TextForm>
                          <TextForm label="Department">{user.department ?? ''}</TextForm>
                          <TextForm label="Position/Title">{user.position ?? ''}</TextForm>
                          <TextForm label="Work Email">{user.email ?? ''}</TextForm>
                          <TextForm label="Work Phone">{user.phone ?? ''}</TextForm>
                          <TextForm label="Work Mobile">{user.mobile ?? ''}</TextForm>
                          <TextForm label="Access Level">{user.access_level ?? ''}</TextForm>
                          <TextForm label="Status">
                            {USER_STATUS_TEXTS[user.status] ?? 'N/A'}
                          </TextForm>
                        </div>
                      </Collapse.Panel>
                    ))}
                  </Collapse>
                </Collapse.Panel>
              ))}
          </Collapse>
        </div>
      </Col>
    </Row>
  );
};

export default BrandTeamDetail;
