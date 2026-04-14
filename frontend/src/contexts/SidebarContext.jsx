import React, { createContext, useContext, useState, useCallback } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => {
    return useContext(SidebarContext);
};

export const SidebarProvider = ({ children }) => {
    // 'Reports', 'DietPlans', or null/false if no category is active
    const [activeSidebar, setActiveSidebar] = useState(null); 
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = useCallback(() => {
        setIsCollapsed(prev => !prev);
    }, []);

    const setSidebarMode = useCallback((mode) => {
        setActiveSidebar(mode);
        setIsCollapsed(false); // Always expand when switching modes
    }, []);

    const contextValue = {
        activeSidebar,
        setSidebarMode,
        isCollapsed,
        toggleCollapse,
    };

    return (
        <SidebarContext.Provider value={contextValue}>
            {children}
        </SidebarContext.Provider>
    );
};
