import React, { useState } from 'react';

const AnimationContext = React.createContext({});
export default AnimationContext;

export function AnimationProvider({ children }) {
    const [frame, setFrame] = useState(0);

    const value = {
        frame,
        tick: () => {
            setFrame((frame) => {
                return frame + 1;
            });
        },
    };

    return (
        <AnimationContext.Provider value={value}>
            {children}
        </AnimationContext.Provider>
    );
}