import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import * as NumberUtil from 'src/utils/number';

import Button from 'src/components/common/button/button';

const MAX_SIZE = 8 * 1024 * 1024;
const MAX_COUNT = 10;

function ProjectFiles({ files, setFiles, markMediaDirty }) {
  const { t } = useTranslation('translation', { keyPrefix: 'projects' });
  // for id assignment of new images
  const [newFileCount, setNewFileCount] = useState(1);

  // handlers
  const handleDelete = (fileId) => () => {
    setFiles(files.filter((f) => f.id !== fileId));
    markMediaDirty();
  };

  const handleAddFile = (e) => {
    const file = e.currentTarget.files.length >= 1 ? e.currentTarget.files[0] : null;
    e.target.value = null;
    if (file.size > MAX_SIZE) {
      return toast.error(t('fileTooLarge', { size: NumberUtil.numberWithCommas(file.size), maxSize: NumberUtil.numberWithCommas(MAX_SIZE) }));
    }

    setFiles(files.concat({
      name: file.name,
      blob: file,
      size: file.size,
      id: -newFileCount, // negative ids to avoids key conflicts, will be updated after save
    }));
    setNewFileCount(newFileCount + 1);
    return markMediaDirty();
  };

  return (
    <div className="project-files">
      <div className="title">{t('Downloadable Files (Optional)')}</div>
      <p className="no-margin">
        {t('fileLimit', { limit: MAX_SIZE / 1024 / 1024, countLimit: MAX_COUNT })}
      </p>
      <p>{t('(e.g. 3D model/printing files, laser cutting files, Roblox files, etc.)')}</p>

      <div className="item-row">
        {files?.length > 0 && (
          <ul>
            {files.map((v) => (
              <li className="file" key={`project-file_${v.id}`}>
                <div className="file-name">
                  <div>{v.name}</div>
                  <div>
                    {NumberUtil.numberWithCommas(v.size)}
                    {' '}
                    {t('Bytes')}
                  </div>
                </div>
                <div className="op-buttons">
                  <Button
                    parentClassName="delete"
                    type="button"
                    status="delete"
                    onClick={handleDelete(v.id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="add-file">
          <label className="add-button">
            <input type="file" onChange={handleAddFile} />
            <div className="text">
              +
              {' '}
              {t('Add File')}
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

export default ProjectFiles;
