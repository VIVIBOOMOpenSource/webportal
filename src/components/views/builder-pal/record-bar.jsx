import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from 'src/components/common/button/button';
import { ReactComponent as RecordSVG } from 'src/css/imgs/icon-record.svg';

const mimeType = 'audio/mp3';

const MAX_AUDIO_LENGTH = 60 * 1000;

export default function RecordBar({ sendMessage }) {
  const { t } = useTranslation();

  const mediaRecorder = useRef(null);
  const interval = useRef(null);
  const forceStopTimeout = useRef(null);

  const [duration, setDuration] = useState(0);

  const [recording, setRecording] = useState(false);

  const [shouldForceStop, setShouldForceStop] = useState(false);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const media = new MediaRecorder(stream, { type: mimeType });
    mediaRecorder.current = media;

    setRecording(true);
    const startTime = new Date().getTime();

    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === 'undefined') return;
      const audioBlob = new Blob([event.data], { type: mimeType });
      const audioDuration = Math.round((new Date().getTime() - startTime) / 1000);
      sendMessage(null, null, audioBlob, audioDuration);
    };

    mediaRecorder.current.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());

      clearInterval(interval.current);
      clearTimeout(forceStopTimeout.current);
      setDuration(0);
      setShouldForceStop(false);
    };

    mediaRecorder.current.start();
    // set start time
    // interval timer for display of audio length
    interval.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    // force stop timeout
    forceStopTimeout.current = setTimeout(() => {
      setShouldForceStop(true);
    }, MAX_AUDIO_LENGTH);
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorder.current?.stop();
  };

  const discardRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.ondataavailable = null;
      mediaRecorder.current.stop();
      setRecording(false);
    }
  };

  useEffect(() => {
    if (shouldForceStop) {
      stopRecording();
    }
  }, [shouldForceStop]);

  useEffect(() => {
    window.addEventListener('blur', discardRecording);
    return () => {
      window.removeEventListener('blur', discardRecording);
      clearInterval(interval.current);
      clearTimeout(forceStopTimeout.current);
    };
  }, []);

  return (
    <Button parentClassName="record-bar" onMouseDown={startRecording} onMouseUp={stopRecording} onMouseLeave={discardRecording} onMouseOut={discardRecording}>
      <RecordSVG />
      {recording ? `${duration}''  ${t('Move Away to Discard')}` : t('Hold to Talk')}
    </Button>
  );
}
