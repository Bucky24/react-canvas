import React, { useContext } from 'react';
import { RenderContext, Text } from '@bucky24/react-canvas';

export default function Component({x, y}) {
    const data = useContext(RenderContext);

    return <Text x={x} y={y}>Data is: {data}</Text>
}