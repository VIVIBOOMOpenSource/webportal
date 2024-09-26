/* eslint-disable react/jsx-one-expression-per-line */
import React, { useMemo } from 'react';
import './notification-item.scss';

import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import MyImage from 'src/components/common/MyImage';
import * as DateUtil from 'src/utils/date';

import NotificationTypeEnum from 'src/enums/NotificationType';
import DefaultBadgePicture from 'src/css/imgs/boom-imgs/badge/default-badge-picture.png';
import DefaultProfilePicture from 'src/css/imgs/boom-imgs/profile/default-profile-picture.png';
import VivicoinImage from 'src/css/imgs/v-coin.png';

const DEFAULT_NOTIFICATION_IMAGE_SIZE = 128;

const posWords = [
  'Awesome', 'Sweet', 'Nice', 'Good news', 'Excellent', 'Woo',
  'Yeah', 'Yay', 'Hooray', 'Fantastic', 'Gnarly', 'Epic',
];
const posMojis = [
  '😁', '🤩', '💪', '🚀', '🔥',
];

const negWords = [
  'Bummer', 'Dang', 'Bad news', 'Bonkers',
];
const negMojis = [
  '🤕', '🥴', '😵', '😖',
];

function NotificationItem({ notification }) {
  const { t } = useTranslation('translation', { keyPrefix: 'notifications' });
  const posWord = notification.id % posWords.length;
  const posMoji = notification.id % posMojis.length;
  const negWord = notification.id % negWords.length;
  const negMoji = notification.id % negMojis.length;

  const badgeImageParams = useMemo(() => ({ suffix: 'png' }), []);

  let textEle = <div />;
  switch (notification.type) {
    case NotificationTypeEnum.MESSAGE:
      textEle = (<div>{(notification.text) ? notification.text : ''}</div>);
      break;
    case NotificationTypeEnum.STARTER_CRITERIA_COMPLETION:
      textEle = (
        <div>
          {t(posWords[posWord])}
          !
          {posMojis[posMoji]}
          {' '}
          <Trans i18nKey="notifications.starterCriteriaCompletion">
            You are now a VIVINAUT and welcome to the VIVITA family!
          </Trans>
        </div>
      );
      break;
    case NotificationTypeEnum.BADGE_AWARD:
      textEle = (
        <div>
          {t(posWords[posWord])}
          !
          {posMojis[posMoji]}
          {' '}
          <Trans i18nKey="notifications.newBadge">
            You just got the <Link to={`/badge/${notification.badge?.id}`}>{{ name: notification.badge?.name || '-' }}</Link> badge.
          </Trans>
        </div>
      );
      break;
    case NotificationTypeEnum.CHALLENGE_AWARD:
      textEle = (
        <div>
          {t(posWords[posWord])}
          !
          {posMojis[posMoji]}
          {' '}
          <Trans i18nKey="notifications.newChallenge">
            You have just completed the <Link to={`/badge/${notification.badge?.id}`}>{{ name: notification.badge?.name || '-' }}</Link> challenge.
          </Trans>
        </div>
      );
      break;
    case NotificationTypeEnum.BADGE_REMOVAL:
      textEle = (
        <div>
          {t(negWords[negWord])}
          .
          {' '}
          {negMojis[negMoji]}
          {' '}
          <Trans i18nKey="notifications.lostBadge">
            Looks like you lost the <Link to={`/badge/${notification.badge?.id}`}>{{ name: notification.badge?.name || '-' }}</Link> badge.
          </Trans>
        </div>
      );
      break;
    case NotificationTypeEnum.CHALLENGE_REMOVAL:
      textEle = (
        <div>
          {t(negWords[negWord])}
          .
          {' '}
          {negMojis[negMoji]}
          {' '}
          <Trans i18nKey="notifications.lostChallenge">
            Looks like the approval of the <Link to={`/badge/${notification.badge?.id}`}>{{ name: notification.badge?.name || '-' }}</Link> challenge is withdrawn.
          </Trans>
        </div>
      );
      break;
    case NotificationTypeEnum.COMMENT_LIKE:
      textEle = (
        <div>
          {t(posWords[posWord])}
          !
          {' '}
          {posMojis[posMoji]}
          {' '}
          <Trans i18nKey="notifications.likeComment">
            <Link to={`/member/${notification.actingUser?.id}`}>{{ name: notification.actingUser?.name || '-' }}</Link> liked your comment.
          </Trans>
        </div>
      );
      break;
    case NotificationTypeEnum.COMMENT_REPLY:
      textEle = (
        <div>
          {t(posWords[posWord])}
          !
          {' '}
          {posMojis[posMoji]}
          {' '}
          <Trans i18nKey="notifications.replyComment">
            <Link to={`/member/${notification.actingUser?.id}`}>{{ name: notification.actingUser?.name || '-' }}</Link> replied to your comment.
          </Trans>
        </div>
      );
      break;
    case NotificationTypeEnum.PROJECT_BADGE_APPROVAL:
      textEle = (
        <div>
          {t(posWords[posWord])}
          !
          {posMojis[posMoji]}
          {' '}
          <Trans i18nKey="notifications.badgeApprove">
            The badge(s) you chose for your project, <Link to={`/project/${notification.project?.id}`}>{{ projectName: notification.project?.name || '-' }}</Link>, were approved by {{ userName: notification.actingUser?.name || '-' }}.
          </Trans>
        </div>
      );
      break;
    case NotificationTypeEnum.PROJECT_BADGE_REJECTION:
      textEle = (
        <div>
          {t(negWords[negWord])}
          .
          {' '}
          {negMojis[negMoji]}
          {' '}
          <Trans i18nKey="notifications.badgeReject">
            Looks like the badge(s) you chose for your project, <Link to={`/project/${notification.project?.id}`}>{{ name: notification.project?.name || '-' }}</Link>, were rejected.
          </Trans>
        </div>
      );
      break;
    case NotificationTypeEnum.PROJECT_COMMENT:
      textEle = (
        <div>
          {t(posWords[posWord])}
          !
          {' '}
          {posMojis[posMoji]}
          {' '}
          <Trans i18nKey="notifications.projectComment">
            <Link to={`/member/${notification.actingUser?.id}`}>{{ userName: notification.actingUser?.name || '-' }}</Link> commented on your project, <Link to={`/project/${notification.project?.id}`}>{{ projectName: notification.project?.name || '-' }}</Link>.
          </Trans>
        </div>
      );
      break;
    case NotificationTypeEnum.PROJECT_LIKE:
      textEle = (
        <div>
          {t(posWords[posWord])}
          !
          {' '}
          {posMojis[posMoji]}
          {' '}
          <Trans i18nKey="notifications.projectLike">
            <Link to={`/member/${notification.actingUser?.id}`}>{{ userName: notification.actingUser?.name || '-' }}</Link> liked your project, <Link to={`/project/${notification.project?.id}`}>{{ projectName: notification.project?.name || '-' }}</Link>.
          </Trans>
        </div>
      );
      break;
    case NotificationTypeEnum.WALLET_ACTIVATION:
      textEle = (
        <div>
          <Link to="/wallet">
            <Trans i18nKey="notifications.walletActivated">
              Your wallet has been successfully created!
            </Trans>
          </Link>
        </div>
      );
      break;
    case NotificationTypeEnum.TRANSACTION_RECEIVE:
      textEle = (
        <div>
          <Link to="/wallet">
            <Trans>
              {notification.text}
            </Trans>
          </Link>
        </div>
      );
      break;
    default:
      break;
  }
  let buttonLink = '/badges';
  if (notification.project?.id) {
    buttonLink = `/edit-project/${notification.project?.id}`;
  }

  let imageEle = (<div />);
  if (notification.badge) {
    imageEle = (
      <div className="badge-image">
        <Link to={`/badge/${notification.badge?.id}`}>
          <MyImage
            src={notification.badge?.imageUri}
            defaultImage={DefaultBadgePicture}
            width={DEFAULT_NOTIFICATION_IMAGE_SIZE}
            params={badgeImageParams}
          />
        </Link>
      </div>
    );
  } else if (notification.type === NotificationTypeEnum.WALLET_ACTIVATION) {
    imageEle = (
      <div className="user-image">
        <Link to="/wallet">
          <MyImage
            src={VivicoinImage}
            defaultImage={VivicoinImage}
            width={DEFAULT_NOTIFICATION_IMAGE_SIZE}
          />
        </Link>
      </div>
    );
  } else if (notification.actingUser) {
    imageEle = (
      <div className="user-image">
        <Link to={`/member/${notification.actingUser?.id}`}>
          <MyImage
            src={notification.actingUser?.profileImageUri}
            defaultImage={DefaultProfilePicture}
            width={DEFAULT_NOTIFICATION_IMAGE_SIZE}
          />
        </Link>
      </div>
    );
  } else if (notification.type === NotificationTypeEnum.TRANSACTION_RECEIVE) {
    imageEle = (
      <div className="user-image">
        <Link to="/wallet">
          <MyImage
            src={VivicoinImage}
            defaultImage={VivicoinImage}
            width={DEFAULT_NOTIFICATION_IMAGE_SIZE}
          />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="notification-item">
        <div className="notif-details-container">
          {imageEle}
          <div className="notif-detail">
            {textEle}
            <div className="date-time-since">{DateUtil.dateTimeSince(notification.createdAt)}</div>
            {notification.text && notification.type !== NotificationTypeEnum.TRANSACTION_RECEIVE && <p className="message">{notification.text}</p>}
            <Link className={(notification.type === NotificationTypeEnum.PROJECT_BADGE_REJECTION) || (notification.type === NotificationTypeEnum.BADGE_REMOVAL) ? 'another-badge-button' : 'another-badge-button-none'} to={buttonLink}>
              {t('Try another badge')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationItem;
