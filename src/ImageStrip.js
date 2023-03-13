import React from 'react';
import PropTypes from 'prop-types';

import { Image } from './main';

const propTypes = {
    src: PropTypes.string.isRequired,
    cellWidth: PropTypes.number.isRequired,
    cellHeight: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    cellX: PropTypes.number.isRequired,
    cellY: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
};

export default function ImageStrip({ src, width, height, cellWidth, cellHeight, cellX, cellY, x, y }) {
    const xPos = cellX * cellWidth;
    const yPos = cellY * cellHeight;
    return <Image
        src={src}
        width={width}
        height={height}
        x={x}
        y={y}
        clip={{
            x: xPos,
            y: yPos,
            width: cellWidth,
            height: cellHeight,
        }}
    />;
}

ImageStrip.propTypes = propTypes;