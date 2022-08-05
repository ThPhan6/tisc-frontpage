import { FormGroup } from '@/components/Form';
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
                          <FormGroup
                            label="Gender"
                            labelColor="mono-color-medium"
                            layout="vertical"
                            bodyText={{
                              text: user.gender === true ? 'Male' : 'Female',
                            }}
                          />
                          <FormGroup
                            label="Work Location"
                            labelColor="mono-color-medium"
                            layout="vertical"
                            bodyText={{
                              text: user.work_location ?? '',
                            }}
                          />
                          <FormGroup
                            label="Department"
                            labelColor="mono-color-medium"
                            layout="vertical"
                            bodyText={{
                              text: user.department ?? '',
                            }}
                          />
                          <FormGroup
                            label="Position/Title"
                            labelColor="mono-color-medium"
                            layout="vertical"
                            bodyText={{
                              text: user.position ?? '',
                            }}
                          />
                          <FormGroup
                            label="Work Email"
                            labelColor="mono-color-medium"
                            layout="vertical"
                            bodyText={{
                              text: user.email ?? '',
                            }}
                          />
                          <FormGroup
                            label="Work Phone"
                            labelColor="mono-color-medium"
                            layout="vertical"
                            bodyText={{
                              text: user.phone ?? '',
                            }}
                          />
                          <FormGroup
                            label="Work Mobile"
                            labelColor="mono-color-medium"
                            layout="vertical"
                            bodyText={{
                              text: user.mobile ?? '',
                            }}
                          />
                          <FormGroup
                            label="Access Level"
                            labelColor="mono-color-medium"
                            layout="vertical"
                            bodyText={{
                              text: user.access_level ?? '',
                            }}
                          />
                          <FormGroup
                            label="Status"
                            labelColor="mono-color-medium"
                            layout="vertical"
                            bodyText={{
                              text: USER_STATUS_TEXTS[user.status] ?? 'N/A',
                            }}
                          />
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
