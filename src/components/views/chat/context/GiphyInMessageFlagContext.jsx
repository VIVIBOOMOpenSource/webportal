import React, { useCallback, useContext, useMemo, useState } from 'react';

export const GiphyInMessageFlagContext = React.createContext({});

export function GiphyInMessageFlagProvider({ children }) {
  const [giphyState, setGiphyState] = useState({
    'main-input': false,
    'thread-input': false,
  });

  const clearGiphyFlag = useCallback((isReply) => {
    setGiphyState((prev) => (isReply
      ? { ...prev, 'thread-input': false }
      : { ...prev, 'main-input': false }));
  }, []);

  const clearGiphyFlagMainInput = useCallback(() => {
    setGiphyState((prev) => ({ ...prev, 'main-input': false }));
  }, []);

  const clearGiphyFlagThread = useCallback(() => {
    setGiphyState((prev) => ({ ...prev, 'thread-input': false }));
  }, []);

  const inputHasGiphyMessage = useCallback((isReply) => (
    isReply ? giphyState['thread-input'] : giphyState['main-input']
  ), [giphyState]);

  const isComposingGiphyMessage = useCallback(() => giphyState['main-input'], [giphyState]);

  const isComposingGiphyReply = useCallback(() => giphyState['thread-input'], [giphyState]);

  const setComposeGiphyMessageFlag = useCallback(() => {
    setGiphyState((prev) => ({ ...prev, 'main-input': true }));
  }, []);

  const setComposeGiphyReplyFlag = useCallback(() => {
    setGiphyState((prev) => ({ ...prev, 'thread-input': true }));
  }, []);

  const value = useMemo(() => ({
    clearGiphyFlag,
    clearGiphyFlagMainInput,
    clearGiphyFlagThread,
    inputHasGiphyMessage,
    isComposingGiphyMessage,
    isComposingGiphyReply,
    setComposeGiphyMessageFlag,
    setComposeGiphyReplyFlag,
  }), [clearGiphyFlag, clearGiphyFlagMainInput, clearGiphyFlagThread, inputHasGiphyMessage, isComposingGiphyMessage, isComposingGiphyReply, setComposeGiphyMessageFlag, setComposeGiphyReplyFlag]);

  return (
    <GiphyInMessageFlagContext.Provider value={value}>
      {children}
    </GiphyInMessageFlagContext.Provider>
  );
}

export const useGiphyInMessageContext = () => useContext(GiphyInMessageFlagContext);
