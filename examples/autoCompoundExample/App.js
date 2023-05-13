import React, { useState } from 'react';
import { Canvas, CompoundElement, Rect, Circle } from 'react-canvas';

const App = ({}) => {
	const [xOff, setXOff] = useState(0);
	const [yOff, setYOff] = useState(0);
	const [mouse, setMouse] = useState({ x: 0, y: 0});
	const [mouseDown, setMouseDown] = useState(false);

	return (<div>
		<Canvas
			width={600}
			height={400}
			onMouseDown={() => {
				setMouseDown(true);
			}}
			onMouseUp={() => {
				setMouseDown(false);
			}}
			onMouseMove={(event) => {
				if (mouseDown) {
					const diffX = mouse.x - event.x;
					const diffY = mouse.y - event.y;
					setXOff(xOff - diffX);
					setYOff(yOff - diffY);
				}
				setMouse({
					x: event.x,
					y: event.y,
				});
			}}
		>
			<Rect x={0} y={0} x2={600} y2={400} color="#fff" fill={true} />
			<CompoundElement
				yOff={yOff}
				xOff={xOff}
				autoDimensions
			>
				<Rect x={-50} y={100} x2={0} y2={50} color="#00f" fill={true} />
				<Rect x={50} y={100} x2={100} y2={50} color="#f00" fill={true} />
				<Rect x={150} y={100} x2={200} y2={50} color="#f00" fill={true} />
				<Rect x={250} y={100} x2={300} y2={50} color="#f00" fill={true} />
				<Rect x={350} y={100} x2={400} y2={50} color="#f00" fill={true} />
				<Rect x={450} y={100} x2={500} y2={50} color="#f00" fill={true} />
				<Rect x={550} y={100} x2={600} y2={50} color="#f00" fill={true} />
				<Rect x={650} y={100} x2={700} y2={50} color="#0f0" fill={true} />
				<Circle  x={100} y={100} radius={50} />
			</CompoundElement>
		</Canvas>
	</div>);
};

export default App;