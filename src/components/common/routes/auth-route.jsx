import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Route, Redirect, useHistory, useLocation,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import UserReduxActions from 'src/redux/user/UserReduxActions';

function AuthRoute({ component: Component, ...rest }) {
  const { t } = useTranslation('translation', { keyPrefix: 'common' });
  const history = useHistory();
  const location = useLocation();
  const user = useSelector((state) => state.user);

  const [redirect, setRedirect] = useState('');

  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        await UserReduxActions.fetch();
        if (!user?.isEmailVerified) {
          if (!history.location.pathname.includes('/verify-email')) {
            setRedirect('/verify-email');
          } else {
            setRedirect('');
          }
        } else {
          if ((!user?.branch?.allowVivicoinRewards || !user?.institution?.isRewardEnabled) && (location.pathname.includes('/reward') || location.pathname.includes('/wallet'))) setRedirect('/not-found');
          if (!user?.institution?.isChatEnabled && location.pathname.includes('/chat')) setRedirect('/not-found');
          if (!user?.branch?.allowEventBooking && (location.pathname.includes('booking') || location.pathname.includes('event'))) setRedirect('/not-found');
        }
      } catch (err) {
        toast.error(t('autoLogout'));
        await UserReduxActions.logout();
        setRedirect('/welcome');
      }
    };
    if (user?.authToken) {
      checkAuthToken();
    } else {
      setRedirect('/welcome');
    }
  }, [user?.authToken, history.location.pathname, user?.isEmailVerified, t, user?.branch?.allowVivicoinRewards, user?.branch?.allowEventBooking, location.pathname, user?.institution?.isRewardEnabled, user?.institution?.isChatEnabled]);

  if (!redirect) return <Route {...rest} component={Component} />;
  return <Redirect {...rest} to={{ pathname: redirect, state: { redirectRoute: location.pathname } }} />;
}

export default AuthRoute;
