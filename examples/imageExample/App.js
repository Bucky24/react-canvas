import React from 'react';
import { Canvas, Shape, Image } from 'react-canvas';

import sampleImage from './sampleImage.png';

const App = ({}) => {
	return (<div>
		<Canvas
			width={300}
			height={300}
		>
			<Image
				src={sampleImage}
				x={0}
				y={0}
				width={300}
				height={300}
			/>
			<Shape
				x={40}
				y={0}
				points={[
					{ x: 10, y: 10},
					{ x: 100, y: 10 },
					{ x: 10, y: 100}
				]}
				color="#f00"
				fill={true}
			/>
		</Canvas>
	</div>);
};

export default App;