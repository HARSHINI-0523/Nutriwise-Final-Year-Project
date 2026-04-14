import React, { useEffect, useState } from 'react';
import '../../contexts/ToastContext.css';



const ProgressBar = ({ duration, type }) => {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prevProgress => {
                const newProgress = prevProgress - 1;
                if (newProgress <= 0) {
                    clearInterval(interval);
                    return 0;
                }
                return newProgress;
            });
        }, duration / 100); // Update every 10ms for a smooth animation

        return () => clearInterval(interval);
    }, [duration]);

    return (
        <div className={`progress-bar-container progress-bar-${type}`}>
            <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;