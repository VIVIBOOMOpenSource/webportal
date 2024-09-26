import axios from 'axios';
import fileDownload from 'js-file-download';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import './downloadable-file.scss';

import { numberWithCommas } from 'src/utils/number';

function File({
  src, params, filename, size,
}) {
  const { t } = useTranslation('translation', { keyPrefix: 'common' });
  const authToken = useSelector((state) => state.user?.authToken);

  const fetchFile = useCallback(async () => {
    try {
      const res = await axios.get(src, {
        headers: { 'auth-token': authToken },
        params: { ...params },
        responseType: 'blob',
      });
      fileDownload(res.data, filename);
    } catch (err) {
      console.error(err);
    }
  }, [src, authToken, params, filename]);

  return (
    <li>
      <button className="file-link" type="button" onClick={fetchFile}>
        {filename}
        {' '}
        { numberWithCommas(size) }
        {' '}
        {t('bytes')}
      </button>
    </li>
  );
}

export default File;
