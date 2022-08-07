import React from 'react';
import { Canvas, Camera, Shape3D } from 'react-canvas';

const App = ({}) => {
	return (<div>
		<Canvas
			width={400}
			height={300}
            enable3d={true}
		>
			<Camera x={10} y={10} z={10} lookX={0} lookY={0} lookZ={0}>
				<Shape3D
					triangles={
						{
							points: [
								{x: 0, y: 0, z: 0 },
								{x: 5, y: 5, z: 5 },
								{x: 5, y: 0, z: 0 },
							],
							color: "#f00",
						}
					}
				/>
			</Camera>
		</Canvas>
	</div>);
};

export default App;