import React from 'react';
import { Text, Shape } from 'react-canvas';

export default function Elem({ x, y }) {
	return (<>
		<Shape
            x={x}
            y={y}
			points={[
				{ x: 10, y: 10},
				{ x: 100, y: 10 },
				{ x: 10, y: 100}
			]}
			color="#f00"
			fill={true}
		/>
		<Text
			x={x+5}
			y={y+20}
		>
			Blah blah
		</Text>
	</>);
};
