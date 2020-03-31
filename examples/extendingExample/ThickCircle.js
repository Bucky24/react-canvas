import React from 'react';
import { CanvasContext } from 'react-canvas';

const ThickCircle = ({ x, y, radius, thickness, startAngle, endAngle }) => {
	return <CanvasContext.Consumer>
		{({ context }) => {
			if (!context) {
				return null;
			}
			context.save();
	
			context.fillStyle = "#0ff";
			context.beginPath();
			context.arc(x, y, radius, startAngle, endAngle, false);
			context.arc(x, y, radius - thickness, endAngle, startAngle, true);
			context.closePath();
			context.fill();
	
			context.restore();
		}}
	</CanvasContext.Consumer>
}

export default ThickCircle;
