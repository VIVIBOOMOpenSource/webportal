import React, { useCallback, useState } from 'react';
import { ChatAutoComplete, EmojiPicker, useMessageInputContext } from 'stream-chat-react';
import { usePopper } from 'react-popper';

import { GiphyBadge } from './GiphyBadge';
import { MessageInputControlButton } from './MessageInputControls';
import { SendButtonIcon } from './SendButtonIcon';

import { useGiphyInMessageContext } from '../../context/GiphyInMessageFlagContext';

// eslint-disable-next-line import/prefer-default-export
export function ThreadMessageInput() {
  const { isComposingGiphyReply, clearGiphyFlagThread, setComposeGiphyReplyFlag } = useGiphyInMessageContext();

  const messageInput = useMessageInputContext();
  const { openEmojiPicker, closeEmojiPicker, emojiPickerIsOpen } = messageInput;
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'top-end',
  });

  const onChange = useCallback(
    (event) => {
      const deletePressed = event.nativeEvent instanceof InputEvent
        && event.nativeEvent.inputType === 'deleteContentBackward';

      if (messageInput.text.length === 1 && deletePressed) {
        clearGiphyFlagThread();
      }

      if (messageInput.text.startsWith('/giphy') && !isComposingGiphyReply()) {
        console.log('replacing');
        event.target.value = event.target.value.replace('/giphy', '');
        setComposeGiphyReplyFlag();
      }

      messageInput.handleChange(event);
    },
    [clearGiphyFlagThread, messageInput, setComposeGiphyReplyFlag, isComposingGiphyReply],
  );

  return (
    <div className="thread-message-input__wrapper">
      <div className="thread-message-input__input">
        {isComposingGiphyReply() && <GiphyBadge />}
        <ChatAutoComplete
          onChange={onChange}
          placeholder="Reply"
        />
        <MessageInputControlButton type="emoji" onClick={emojiPickerIsOpen ? closeEmojiPicker : openEmojiPicker} ref={setReferenceElement} />
        <button
          className="thread-message-input__send-button"
          disabled={!messageInput.numberOfUploads && !messageInput.text.length}
          onClick={messageInput.handleSubmit}
        >
          <SendButtonIcon />
        </button>
      </div>
      {emojiPickerIsOpen && (
        <div
          className="str-chat__message-textarea-emoji-picker-container"
          style={styles.popper}
          {...attributes.popper}
          ref={setPopperElement}
        >
          <EmojiPicker />
        </div>
      )}
    </div>
  );
}
