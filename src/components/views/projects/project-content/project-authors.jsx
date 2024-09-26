import './project-authors.scss';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Select, { components } from 'react-select';
import { AsyncPaginate } from 'react-select-async-paginate';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import Button from 'src/components/common/button/button';
import { ReactComponent as DeleteSvg } from 'src/css/imgs/icon-delete.svg';
import { ReactComponent as EditSvg } from 'src/css/imgs/icon-edit.svg';
import DefaultProfilePicture from 'src/css/imgs/boom-imgs/profile/default-profile-picture.png';
import MyImage from 'src/components/common/MyImage';
import Modal from 'src/components/common/modal/modal';
import { projectAuthorRoleTypes } from 'src/enums/ProjectAuthorRoleType';
import UserApi from 'src/apis/viviboom/UserApi';

const MAX_COUNT = 10;
const DEFAULT_LIMIT = 20;
const DEFAULT_PROFILE_WIDTH = 256;

const roleOptions = projectAuthorRoleTypes.map((roleType) => ({ value: roleType, label: roleType }));

function Option({ value, children, ...props }) {
  return (
    <components.Option {...props}>
      <div className="custom-option">
        <MyImage src={value?.profileImageUri} alt={value?.name} preloadImage={DefaultProfilePicture} defaultImage={DefaultProfilePicture} width={64} />
        {children}
      </div>
    </components.Option>
  );
}

function ProjectAuthors({
  authorUserId, authors, setAuthors, markDocumentDirty,
}) {
  const { t } = useTranslation('translation', { keyPrefix: 'projects' });
  const authToken = useSelector((state) => state?.user?.authToken);

  const [selectedAuthorId, setSelectedAuthorId] = useState(null);
  const [selectedUserOption, setSelectedUserOption] = useState(null);
  const [role, setRole] = useState(null);
  const [isNewAuthor, setNewAuthor] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState('');

  const loadUserOptions = async (keywords, prevOptions) => {
    try {
      const requestParams = {
        authToken,
        limit: DEFAULT_LIMIT,
        offset: prevOptions.length,
      };

      if (keywords) requestParams.username = keywords;

      const res = await UserApi.getList(requestParams);
      const { users, count } = res.data;
      return {
        options: users.filter((u) => !authors?.find((pau) => pau.id === u.id)).map((u) => ({
          value: {
            id: u.id, username: u.username, name: u.name, profileImageUri: u.profileImageUri,
          },
          label: `${u.username}, ${u.name}`,
        })),
        hasMore: prevOptions.length + users.length < count,
      };
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }

    return {
      options: [],
      hasMore: false,
    };
  };

  // handlers
  const handleModalClose = () => {
    setSelectedAuthorId(null);
    setRole(null);
    setSelectedUserOption(null);
    setNewAuthor(false);
    setModalErrorMessage('');
  };

  const handleDelete = (authorId) => () => {
    if (!window.confirm(t('Are you sure you want to delete this collaborator?'))) {
      return;
    }
    setAuthors(authors.filter((author) => author.id !== authorId));
    markDocumentDirty();
  };

  const handleConfirm = () => {
    setModalErrorMessage('');
    if (!role) {
      setModalErrorMessage(t('Please add a role for this collaborator!'));
      return;
    }
    if (!selectedUserOption) {
      setModalErrorMessage(t('Please select a collaborator!'));
      return;
    }
    if (isNewAuthor) {
      setAuthors([...authors, { ...selectedUserOption.value, role: role.value }]);
    } else if (selectedAuthorId) {
      const newAuthors = [...authors];
      const authorIndex = newAuthors.findIndex((author) => author.id === selectedAuthorId);
      newAuthors[authorIndex] = { ...selectedUserOption.value, role: role.value };
      setAuthors(newAuthors);
    } else {
      return;
    }
    handleModalClose();
    markDocumentDirty();
  };

  const handleEdit = (index) => () => {
    setRole({ value: authors[index].role, label: authors[index].role });
    setSelectedUserOption({
      value: {
        id: authors[index].id, username: authors[index].username, name: authors[index].name, profileImageUri: authors[index].profileImageUri,
      },
      label: `${authors[index].username}, ${authors[index].name}`,
    });
    setSelectedAuthorId(authors[index].id);
  };

  return (
    <>
      <div className="project-authors">
        <div className="title">{t('collaboration')}</div>
        <p className="subtitle">
          {t('authorLimit', { count: MAX_COUNT })}
        </p>
        <div className="item-row">
          {authors?.length > 1 && (
            <ul className="authors-container">
              {authors.map((v, idx) => (
                <li key={`project-author_${v.id}`}>
                  <MyImage
                    alt={`project-author_${v.id}`}
                    src={v.profileImageUri}
                    defaultImage={DefaultProfilePicture}
                    width={DEFAULT_PROFILE_WIDTH}
                  />
                  <p className="author-name">{v.name}</p>
                  <p className="author-role">
                    {v.role}
                    {' '}
                    {authorUserId === v.id && `(${t('Owner')})`}
                  </p>
                  <div className="op-buttons">
                    <button type="button" className="edit-button" onClick={handleEdit(idx)}>
                      <EditSvg />
                    </button>
                    <button type="button" className={authorUserId === v.id ? 'delete-button greyed' : 'delete-button'} disabled={authorUserId === v.id} onClick={handleDelete(v.id)}>
                      <DeleteSvg />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="add-author">
            <label className={authors?.length >= MAX_COUNT ? 'add-button greyed' : 'add-button'} onClick={() => setNewAuthor(true)}>
              <div className="text">
                +
                {' '}
                {t('Add Collaborator')}
              </div>
            </label>
            {authors?.length >= MAX_COUNT && (
              <p style={{ textAlign: 'center', color: 'red', marginTop: 5 }}>
                {t('Only 10 collaborators can be added')}
              </p>
            )}
          </div>
        </div>
      </div>
      <Modal className="author-modal" show={!!selectedAuthorId || isNewAuthor} handleClose={handleModalClose}>
        <div className="author-modal-container">
          <h4>{t(isNewAuthor ? 'New Collaborator' : 'Edit Collaborator')}</h4>
          <div className="author-selects">
            <div className="author-select">
              <p>{t('Role')}</p>
              <Select isClearable={false} isSearchable={false} value={role} className="author-dropdown" onChange={setRole} options={roleOptions} />
            </div>
            <div className="author-select">
              <p>{t('Author')}</p>
              <AsyncPaginate
                isDisabled={selectedAuthorId && authorUserId === selectedAuthorId}
                isClearable={false}
                cacheUniqs={[isNewAuthor, selectedAuthorId]}
                debounceTimeout={300}
                value={selectedUserOption}
                loadOptions={loadUserOptions}
                onChange={setSelectedUserOption}
                components={{ Option }}
                className="author-dropdown"
              />
            </div>
            <p className="modal-error-message">{modalErrorMessage}</p>
            <Button type="add" parentClassName="author-button" onClick={handleConfirm}>{t('Confirm')}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
export default ProjectAuthors;
