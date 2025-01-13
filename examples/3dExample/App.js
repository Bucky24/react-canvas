import React, { useEffect, useState } from 'react';
import { Canvas, Camera, Shape3D } from 'react-canvas';
import { FVertex } from './fdata';

const App = ({}) => {
	const [z, setZ] = useState(0);
	const [y, setY] = useState(20);

	useEffect(() => {
		setInterval(() => {
			setZ((z) => Math.min(100, z + 1));
			setY((y) => Math.min(100, y + 1));
		}, 100);
	}, []);

	return (<div>
		<Canvas
			width={400}
			height={300}
            enable3d={true}
		>
			<Camera x={10} y={10} z={10} lookX={0} lookY={0} lookZ={0}>
				<Shape3D
					geometry={FVertex}
					x={10}
					y={y}
					z={z}
				/>
			</Camera>
		</Canvas>
	</div>);
};

export default App;