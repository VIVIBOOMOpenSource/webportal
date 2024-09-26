import React, {
  useCallback, useContext, useMemo, useState,
} from 'react';

const noop = () => Promise.resolve();

// type WorkspaceContext = {
//   activeWorkspace: Workspace;
//   closeAdminPanel: () => void;
//   displayWorkspace: (w: Workspace) => void;
//   pinnedMessageListOpen: boolean;
//   togglePinnedMessageListOpen: () => void;
//   closePinnedMessageListOpen: () => void;
// }

const WorkspaceControllerContext = React.createContext({
  activeWorkspace: 'Chat',
  closeAdminPanel: noop,
  displayWorkspace: noop,
  pinnedMessageListOpen: false,
  togglePinnedMessageListOpen: noop,
  closePinnedMessageListOpen: noop,
});

export function WorkspaceController({ children }) {
  const [activeWorkspace, setActiveWorkspace] = useState('Chat');
  const [pinnedMessageListOpen, setPinnedMessageListOpen] = useState(false);

  const displayWorkspace = useCallback((workspace) => {
    setActiveWorkspace(workspace);
    setPinnedMessageListOpen(false);
  }, [setActiveWorkspace]);

  const closeAdminPanel = useCallback(() => {
    displayWorkspace('Chat');
  }, [displayWorkspace]);

  const togglePinnedMessageListOpen = useCallback(() => setPinnedMessageListOpen((prev) => !prev), []);
  const closePinnedMessageListOpen = useCallback(() => setPinnedMessageListOpen(false), []);

  const value = useMemo(() => ({
    activeWorkspace,
    closeAdminPanel,
    displayWorkspace,
    pinnedMessageListOpen,
    closePinnedMessageListOpen,
    togglePinnedMessageListOpen,
  }), [activeWorkspace, closeAdminPanel, closePinnedMessageListOpen, displayWorkspace, pinnedMessageListOpen, togglePinnedMessageListOpen]);

  return (
    <WorkspaceControllerContext.Provider value={value}>
      {children}
    </WorkspaceControllerContext.Provider>
  );
}

export const useWorkspaceController = () => useContext(WorkspaceControllerContext);
