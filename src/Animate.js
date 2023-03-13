import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

import AnimationContext from './contexts/AnimationContext';
import ImageStrip from './ImageStrip';

const propTypes = {
    src: PropTypes.string.isRequired,
    cellWidth: PropTypes.number.isRequired,
    cellHeight: PropTypes.number.isRequired,
    startX: PropTypes.number.isRequired,
    startY: PropTypes.number.isRequired,
    frameCount: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    rowWidth: PropTypes.number.isRequired,
};

export default function Animate({ src, cellWidth, cellHeight, startX, startY, frameCount, rowWidth, x, y, width, height }) {
    const animContext = useContext(AnimationContext);

    if (!animContext) {
        throw new Error("Animate must be called within an AnimationProvider");
    }

    const { frame } = animContext;
    // know what frame we initially started on so we know at what image frame we are on now
    const [firstFrame, _] = useState(frame);

    const currentFrame = (frame - firstFrame) % frameCount;

    const row = Math.floor(currentFrame / rowWidth);
    const column = currentFrame - (row * rowWidth);

    const currentX = startX + column;
    const currentY = startY + row;

    return <ImageStrip
        src={src}
        cellWidth={cellWidth}
        cellHeight={cellHeight}
        cellX={currentX}
        cellY={currentY}
        x={x}
        y={y}
        width={width}
        height={height}
    />;
}

Animate.propTypes = propTypes;