import React from 'react';

export default function SpectrumToast({ message, visible }) {
    return (
        <div
            id="spectrum-toast"
            className={`spectrum-toast ${visible ? 'visible' : ''}`}
            role="status"
            aria-live="polite"
        >
            {message}
        </div>
    );
}
