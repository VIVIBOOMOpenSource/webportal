import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import builderPalImg from 'src/css/imgs/builderpal-imgs/minichatavatar.png';
import soundGif from 'src/css/imgs/sound.gif';

import MyImage from 'src/components/common/MyImage';
import DefaultProfilePicture from 'src/css/imgs/boom-imgs/profile/default-profile-picture.png';
import { BuilderPalRoleType } from 'src/enums/BuilderPalRoleType';

const DEFAULT_PROFILE_IMAGE_SIZE = 128;

export default function ChatMessage({ message, setLoading }) {
  const user = useSelector((state) => state?.user);
  const [audio] = useState(new Audio(message.uri));

  const [content, setContent] = useState(message?.content || '');

  const [shouldAudioPlay, setShouldAudioPlay] = useState(false);

  const streamContent = useCallback(async () => {
    if (message?.streamReader) {
      const { streamReader } = message;
      try {
        let done;
        let value;
        const decoder = new TextDecoder();
        while (!done) {
          // eslint-disable-next-line no-await-in-loop
          ({ value, done } = await streamReader.read());
          if (done) {
            setLoading(false);
            break;
          }
          const newText = decoder.decode(value);
          setContent((prev) => `${prev}${newText}`);
        }
      } catch (err) {
        toast.error(err.response.data.message || err.message);
      }
    }
  }, [message, setLoading]);

  useEffect(() => {
    streamContent();
  }, [message]);

  useEffect(() => {
    if (message.uri) {
      audio.addEventListener('ended', () => setShouldAudioPlay(false));
    }
    return () => {
      audio?.removeEventListener('ended', () => setShouldAudioPlay(false));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (shouldAudioPlay) {
      if (audio) {
        audio.currentTime = 0;
        audio.play();
      }
    } else {
      audio.pause();
    }
  }, [audio, shouldAudioPlay]);

  const audioDuration = message.duration || (audio.duration !== Infinity ? Math.round(audio.duration || 0) : 0);
  const audioText = audioDuration ? `${audioDuration.toFixed()}''` : "''";

  return message.role === BuilderPalRoleType.ASSISTANT ? (
    <div className="assistant-message-container">
      <div className="avatar">
        <img className="image" alt="buiderpal" src={builderPalImg} />
      </div>
      <div className="chat-box">
        {!content ? <div className="dot-flashing" /> : content}
      </div>
    </div>
  ) : (
    <div className="user-message-container">
      <div className="avatar">
        <MyImage
          src={user?.profileImageUri}
          alt="profile"
          defaultImage={DefaultProfilePicture}
          width={DEFAULT_PROFILE_IMAGE_SIZE}
        />
      </div>
      {message?.uri ? (
        <button type="button" className="chat-box audio-button" style={{ width: `${audioDuration * 30}px`, minWidth: '80px', maxWidth: '200px' }} onClick={() => setShouldAudioPlay((b) => !b)}>
          {audioText}
          {shouldAudioPlay ? <img className="sound-gif" src={soundGif} alt="sound" /> : null}
        </button>
      ) : (
        <div className="chat-box">
          {content}
        </div>
      )}
    </div>
  );
}
