import { AtomicBlockUtils } from 'draft-js';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './wysiwyg-scratch-toolbar-option.scss';

function ScratchOption({ editorState, onChange }) {
  const { t } = useTranslation('translation', { keyPrefix: 'projects' });
  const [expand, setExpand] = useState(false);
  const [link, setLink] = useState('');
  const nodeRef = useRef(null);
  const triggerRef = useRef(null);

  const reset = () => {
    setLink('');
    setExpand(false);
  };

  const handleClickOutside = (event) => {
    if (triggerRef.current && triggerRef.current.contains(event.target)) {
      setExpand(!expand);
    }

    if (expand && nodeRef.current && !nodeRef.current.contains(event.target)) {
      reset();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  const addLink = () => {
    const searchStr = 'scratch.mit.edu/projects/';
    if (!link.includes(searchStr)) {
      return;
    }
    const index = link.indexOf(searchStr);
    const projectCode = link.substring(index + searchStr.length).match(/\d+/)[0];
    const src = `https://${searchStr}${projectCode}/embed`;

    const width = 'auto';
    const height = 'auto';
    const entityKey = editorState.getCurrentContent().createEntity('EMBEDDED_LINK', 'MUTABLE', { src, height, width }).getLastCreatedEntityKey();
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
    onChange(newEditorState);
    reset();
  };
  return (
    <div className="rdw-scratch-wrapper">
      <div className="rdw-option-wrapper" ref={triggerRef}>
        <img alt="scratch" />
      </div>

      <div className={expand ? 'rdw-scratch-modal' : 'rdw-scratch-modal hide'} ref={nodeRef}>
        <div className="rdw-scratch-modal-header">
          <span className="rdw-scratch-modal-header-option">
            <span className="rdw-scratch-modal-header-label" />
          </span>
        </div>

        <div className="rdw-scratch-modal-link-section">
          <span className="rdw-scratch-modal-link-input-wrapper">
            <input
              className="rdw-scratch-modal-link-input"
              placeholder="Enter link"
              name="scratchLink"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <span className="rdw-image-mandatory-sign">*</span>
          </span>
        </div>

        <span className="rdw-scratch-modal-btn-section">
          <button type="button" className="rdw-scratch-modal-btn" disabled={link === ''} onClick={addLink}>
            {t('Add')}
          </button>
          <button type="button" className="rdw-scratch-modal-btn" onClick={reset}>
            {t('Cancel')}
          </button>
        </span>
      </div>
    </div>
  );
}

export default ScratchOption;
