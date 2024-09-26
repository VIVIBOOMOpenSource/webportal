import './step-five.scss';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { toast } from 'react-toastify';

import Loading from 'src/components/common/loading/loading';

import UserReduxActions from 'src/redux/user/UserReduxActions';
import UserApi from 'src/apis/viviboom/UserApi';

function StepFive() {
  const { t } = useTranslation('translation', { keyPrefix: 'welcome' });
  const user = useSelector((state) => state?.user);

  const [loading, setLoading] = useState(false);

  const [description, setDescription] = useState(user.description);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { id: userId, authToken } = user;

    if (description?.length >= 0) {
      await UserApi.patch({
        authToken, userId, description: description?.length === 0 ? null : description,
      });
    }
    await UserReduxActions.fetch();
    setLoading(false);
    toast.success(t('Description saved!'));
  };

  return (
    <div className="step-five">
      <div className="text heading">
        <strong>{t('Add a short description about yourself!')}</strong>
      </div>

      <div className="profile-desc">
        <form onSubmit={handleSubmit}>
          <textarea
            id="profile-desc-text"
            rows="4"
            autoFocus
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          {loading
            ? <Loading show={loading} size="40px" />
            : (
              <button className="button" type="submit">
                {t('Save')}
              </button>
            )}

        </form>
      </div>
    </div>
  );
}

export default StepFive;
