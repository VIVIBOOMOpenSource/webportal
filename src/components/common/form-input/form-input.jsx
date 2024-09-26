import React, { useState, useEffect, useRef } from 'react';
import { app } from '../../../js/utils/app';

import { ReactComponent as VisibilityOnSvg } from '../../../css/imgs/icon-visibility-on.svg';
import { ReactComponent as VisibilityOffSvg } from '../../../css/imgs/icon-visibility-off.svg';

function FormInput({
  passRef, type, label, ...rest
}) {
  const [showPass, setShowPass] = useState(false);
  const [requestFocus, setRequestFocus] = useState(false);
  const inputRef = useRef(null);

  const showPasswordToggle = () => {
    setRequestFocus(true);
    setShowPass(!showPass);
  };

  useEffect(() => {
    if (requestFocus) {
      inputRef.current.focus();
      // Move cursor to the end of the input
      const { value } = inputRef.current;
      inputRef.current.value = '';
      inputRef.current.value = value;
      setRequestFocus(false);
    }
  }, [requestFocus]);

  useEffect(() => {
    app.querySelector('.form-input', (elements) => {
      for (const el of elements) {
        if (el.classList.contains('always-active')) continue;

        const input = el.querySelector('input');
        const textarea = el.querySelector('textarea');
        const activeClass = 'active';

        let inputItem;

        if (input) inputItem = input;
        if (textarea) inputItem = textarea;

        if (inputItem) {
          inputItem.addEventListener('focus', () => {
            el.classList.add(activeClass);
          });

          inputItem.addEventListener('blur', () => {
            if (inputItem.value === '') {
              el.classList.remove(activeClass);
            }
          });
        }
      }
    });
  }, []);

  return (
    <div ref={passRef} className="form-input">
      <label>{label}</label>
      <input ref={inputRef} type={type === 'password' && showPass ? 'text' : type} {...rest} />
      {type === 'password' && (
        <span className="show-password hlo" onClick={showPasswordToggle}>
          {(showPass) ? <VisibilityOffSvg /> : <VisibilityOnSvg /> }
        </span>
      )}
    </div>
  );
}

export default FormInput;
