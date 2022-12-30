import { FC } from 'react';

import { ReactComponent as PendingIcon } from '@/assets/icons/action-pending-icon.svg';
import { ReactComponent as RespondedIcon } from '@/assets/icons/action-responded-icon.svg';
import { ReactComponent as UnreadIcon } from '@/assets/icons/action-unreaded-icon.svg';
import { ReactComponent as KeepInViewIcon } from '@/assets/icons/eye-icon.svg';
import { ReactComponent as FollowedIcon } from '@/assets/icons/followed-icon.svg';
import { ReactComponent as PriorityIcon } from '@/assets/icons/non-priority-icon.svg';
import { ReactComponent as ProjectArchivedIcon } from '@/assets/icons/project-archived-icon.svg';
import { ReactComponent as ProjectLiveIcon } from '@/assets/icons/project-live-icon.svg';
import { ReactComponent as ProjectOnHoldIcon } from '@/assets/icons/project-on-hold-icon.svg';
import { ReactComponent as UserAddIcon } from '@/assets/icons/user-add-icon.svg';

import Popover from '@/components/Modal/Popover';
import { BodyText, MainTitle, Title } from '@/components/Typography';

import styles from './LegendModal.less';

const dataLegend = [
  {
    tille: 'GENERAL INQUIRIES',
    content:
      '  General Inquiries are non-project-related inquiries. This free service is accessible by the entire team',
    subs: [
      {
        icon: <UnreadIcon />,
        title: 'Unread',
        content: 'New and unread inquiry indicator.',
      },
      {
        icon: <PendingIcon />,
        title: 'Pending',
        content: 'No action yet.',
      },
      {
        icon: <RespondedIcon />,
        title: 'Responded',
        content: 'The team has responded.',
      },
    ],
  },
  {
    tille: 'PROJECT TRACKING',
    content:
      ' Project Tracking monitors the project status, tracks the product select notifications, and allows the designer to submit additional project-related requests. This service needs a country-based subscription.',
    subs: [
      {
        icon: <UnreadIcon />,
        title: 'Unread',
        content: 'New and unread project, notification and request indicator.',
      },
      {
        icon: <ProjectLiveIcon />,
        title: 'Live',
        content: 'The design firm is currently designing the project.',
      },
      {
        icon: <ProjectOnHoldIcon />,
        title: 'On-hold',
        content: 'The project is on hold by the design firm.',
      },
      {
        icon: <ProjectArchivedIcon />,
        title: 'Archived',
        content: 'The design firm has archived the project.',
      },
      {
        icon: <PriorityIcon />,
        title: 'Priority',
        content: 'The project priority button and indicator.',
      },
      {
        icon: <UserAddIcon />,
        title: 'Team',
        content: 'Team member assigning function and indicator.',
      },
    ],
  },
  {
    tille: 'PRODUCT REQUESTS',
    subs: [
      {
        icon: <PendingIcon />,
        title: 'Pending',
        content: 'No action yet.',
      },
      {
        icon: <RespondedIcon />,
        title: 'Responded',
        content: 'The team has responded.',
      },
    ],
  },
  {
    tille: 'PRODUCT NOTIFICATIONS',
    subs: [
      {
        icon: <KeepInViewIcon />,
        title: 'Keep-In-View',
        content: 'Wait and see.',
      },
      {
        icon: <FollowedIcon />,
        title: 'Followed-up',
        content: 'The team has followed-up.',
      },
      {
        title: 'Considered:',
        content:
          'The designer has shown initial interest in the product and is pending further review.',
      },
      {
        title: 'Unlisted:',
        content: 'The designer temporarily unlisted the prodcut from the selection.',
      },
      {
        title: 'Re-considered:',
        content: 'The designer re-considered and relisted the product back to the selection.',
      },
      {
        title: 'Specified:',
        content:
          'The designer assigned a material code to the product and officially listed on project specification.',
      },
      {
        title: 'Cancelled:',
        content:
          'The designer cancelled the product but remained on the project specification list.',
      },
      {
        title: 'Re-specified:',
        content: 'The designer restored the product back to the project specification list.',
      },
      {
        title: 'Deleted:',
        content: 'The designer permanently deleted and removed the product from the project.',
      },
    ],
  },
];

export const ProjectTrackingLegendModal: FC = () => {
  return (
    <Popover
      title="LEGEND"
      visible
      noFooter
      className={styles.legend}
      extraTopAction={
        <div>
          {dataLegend.map((item) => (
            <div className={styles.modal}>
              <Title level={8}>{item.tille}</Title>
              <div className={styles.content}>
                <BodyText level={6} fontFamily="Roboto" style={{ marginBottom: '8px' }}>
                  {item.content}
                </BodyText>
                {item.subs.map((sub) => (
                  <div className={styles.listItem}>
                    <span style={{ marginRight: '12px', width: '18px', height: '18px' }}>
                      {sub.icon}
                    </span>
                    <div>
                      <MainTitle level={4}>{sub.title}</MainTitle>
                      <BodyText level={6} fontFamily="Roboto">
                        {sub.content}
                      </BodyText>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
};
