import React from 'react';

const RenderContext = React.createContext();
export default RenderContext;

export function RenderProvider({ children, data }) {
    return <RenderContext.Provider value={data}>
        {children}
    </RenderContext.Provider>
}