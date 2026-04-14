import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation for active link styling
import { useSidebar } from '../../contexts/SidebarContext';
import './Sidebar.css';

// Inline SVG Icons from Lucide for easy integration without separate imports
const icons = {
    // Reports Icons
    'My Reports': <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>, // FileText
    'Upload Reports': <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>, // Upload
    
    // Diet Plans Icons
    'Generate Plan': <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 15h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z"/><path d="M17 9h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z"/><path d="M5 3h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M11 3h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/></svg>, // LayoutGrid
    'User Details Form': <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 10V6a2 2 0 0 0-2-2h-6"/><path d="M13 22H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10"/></svg>, // UserCog
    'Weekly Plan': <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>, // Calendar
};

const sidebarData = {
    Reports: [
        { name: 'My Reports', path: '/reports/my', icon: icons['My Reports'] },
        { name: 'Upload Reports', path: '/reports/upload', icon: icons['Upload Reports'] },

    ],
    DietPlans: [
        { name: 'Generate Plan', path: '/diet-plans/generate', icon: icons['Generate Plan'] },
        { name: 'User Details Form', path: '/user-details-form', icon: icons['User Details Form'] },
        { name: 'Weekly Plan', path: '/diet-plans/weekly', icon: icons['Weekly Plan'] },
    ],
    
};

const Sidebar = () => {
    const { activeSidebar, isCollapsed, toggleCollapse } = useSidebar();
    const location = useLocation();

    // Do not render if no sidebar is active
    if (!activeSidebar || !sidebarData[activeSidebar]) {
        return null;
    }

    const links = sidebarData[activeSidebar];
    const headerTitle = activeSidebar === 'Reports' ? 'Reports' : 'Diet Plans';

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
            <div className="sidebar-header">
                {!isCollapsed && <h3>{headerTitle}</h3>}
                <button 
                    onClick={toggleCollapse} 
                    className="collapse-btn" 
                    title={isCollapsed ? 'Expand' : 'Collapse'}
                >
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
                    </svg>
                </button>
            </div>
            
            <nav className="sidebar-nav">
                {links.map((link, index) => (
                    <Link
                        key={index}
                        to={link.path}
                        className={`sidebar-link ${location.pathname === link.path ? 'active' : ''}`}
                        title={link.name}
                    >
                        <span className="link-icon">
                            {link.icon}
                        </span>
                        {!isCollapsed && (
                             <span className="link-text">{link.name}</span>
                        )}
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
