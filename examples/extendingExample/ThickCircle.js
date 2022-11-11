import React from 'react';
import { useWithContext } from 'react-canvas';

const ThickCircle = ({ x, y, radius, thickness, startAngle, endAngle }) => {
	const withContext = useWithContext();
	return withContext((context) => {
		context.save();

		context.fillStyle = "#0ff";
		context.beginPath();
		context.arc(x, y, radius, startAngle, endAngle, false);
		context.arc(x, y, radius - thickness, endAngle, startAngle, true);
		context.closePath();
		context.fill();

		context.restore();
	});
}

export default ThickCircle;
