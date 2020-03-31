import React from 'react';
import { Canvas, Shape, Image } from 'react-canvas';

import ThickCircle from './ThickCircle';

const App = ({}) => {
	return (<div>
		<Canvas
			width={300}
			height={300}
		>
			<ThickCircle
				x={100}
				y={100}
				radius={40}
				thickness={10}
				startAngle={0}
				endAngle={Math.PI/2}
			/>
		</Canvas>
	</div>);
};

export default App;