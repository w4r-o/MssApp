import React, { createContext, useContext } from 'react';

export const SidebarContext = createContext({
  openSidebar: () => {},
  closeSidebar: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
} 