import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import './verify-email.scss';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import UserApi from 'src/apis/viviboom/UserApi';
import { useSelector } from 'react-redux';
import UserReduxActions from 'src/redux/user/UserReduxActions';
import CenterDiv from '../../../common/center-div/center-div';
import Button from '../../../common/button/button';
import Loading from '../../../common/loading/loading';

function VerifyEmail() {
  const history = useHistory();

  const params = useParams();
  const { token } = params;
  const { t } = useTranslation();

  const user = useSelector((state) => state?.user);

  const [email, setEmail] = useState(user?.guardianEmail || '');
  const [loading, setLoading] = useState(false);
  const [verifyingToken, setVerifyingToken] = useState(false);
  const [verifiedToken, setVerifiedToken] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const verifyEmail = useCallback(async () => {
    if (token?.length > 1) {
      try {
        setVerifyingToken(true);
        await UserReduxActions.verifyEmail({ authToken: user?.authToken, token });
        setVerifiedToken(true);
        toast.success(t('email.verifyTokenSuccess'));
      } catch (err) {
        setErrorMessage(t('email.verifyTokenFail'));
        history.push('/welcome');
        toast.error(t('email.verifyTokenFail'));
      }
      setVerifyingToken(false);
    }
  }, [history, t, token, user?.authToken]);

  const onSubmitRequestVerifyEmail = useCallback(async (e) => {
    if (e) e.preventDefault();

    if (email === '') {
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setEmailSent(false);
    try {
      await UserApi.requestVerifyEmail({ email, authToken: user.authToken });
      toast.success(t('email.emailSentText'));
      setEmailSent(true);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message);
    }
    setLoading(false);
  }, [email, t, user.authToken]);

  useEffect(() => {
    verifyEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user?.isEmailVerified) {
      history.push('/');
    } else if (user?.authToken && !token) {
      onSubmitRequestVerifyEmail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.isEmailVerified]);

  if (verifyingToken || verifiedToken) {
    return (
      <CenterDiv>
        <div className="verify-email">
          <h1>{t('email.verifyingToken')}</h1>
          {(verifiedToken)
            ? <div className="success">{t('email.verifyTokenSuccess')}</div>
            : <Loading show size="48px" />}
        </div>
      </CenterDiv>
    );
  }

  return (
    <CenterDiv>
      <div className="verify-email">
        <h1>{t('email.verifyEmail')}</h1>
        {(emailSent) ? (
          <ul className="success">
            <li>{t('email.emailSentText')}</li>
          </ul>
        ) : ''}
        {(errorMessage !== '') ? (
          <ul className="errors">
            <li>{errorMessage}</li>
          </ul>
        ) : ''}
        <p>{t('email.verifyEmailText')}</p>
        <form onSubmit={onSubmitRequestVerifyEmail}>
          <label>{t('email.email')}</label>
          <input disabled={loading} type="email" placeholder={t('email.email')} value={email} onChange={(e) => { setEmail(e.target.value); }} />
          <Button disabled={loading} type="submit" status={(loading) ? 'loading' : ''} value={t(emailSent ? 'email.resendVerificationCode' : 'email.sendVerificationCode')} />
        </form>
      </div>
    </CenterDiv>
  );
}

export default VerifyEmail;
