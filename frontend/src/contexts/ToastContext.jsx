import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import ProgressBar from '../components/toast/ProgressBar';
import './ToastContext.css';

const ToastContext = createContext();

export const useToast = () => {
    return useContext(ToastContext);
};

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ message: '', type: 'info', duration: 3000 });
    const [isVisible, setIsVisible] = useState(false); // This will control opacity and transform
    const [isMounted, setIsMounted] = useState(false); // This will control mounting in the DOM

    const showToast = useCallback((message, type = 'info', duration = 3000) => {
        setToast({ message, type, duration });
        setIsMounted(true); // Mount the component
        
        // Use a small delay to allow the element to be added to the DOM before starting the animation
        setTimeout(() => {
            setIsVisible(true);
        }, 50); 
        
        // Hide the toast after the specified duration
        const hideTimeout = setTimeout(() => {
            setIsVisible(false); // Start the fade-out animation
        }, duration);

        return () => clearTimeout(hideTimeout);
    }, []);

    // Effect to unmount the component after the hide animation finishes
    useEffect(() => {
        if (!isVisible && isMounted) {
            const unmountTimeout = setTimeout(() => {
                setIsMounted(false); // Unmount from DOM after transition
            }, 500); // This should match your CSS transition duration
            return () => clearTimeout(unmountTimeout);
        }
    }, [isVisible, isMounted]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {isMounted && (
                <div 
                    id="toast-notification" 
                    className={`${isVisible ? 'toast-visible' : 'toast-hidden'} toast-${toast.type}`}
                >
                    <div className="toast-content">{toast.message}</div>
                    <ProgressBar duration={toast.duration} type={toast.type} />
                </div>
            )}
        </ToastContext.Provider>
    );
};