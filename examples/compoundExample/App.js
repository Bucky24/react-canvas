import React, { useState, useRef } from 'react';
import { Canvas, CompoundElement, Image, Rect } from 'react-canvas';

import sampleImage from './sampleImage.png';
import Component from './Component';

function useRender() {
	const [count, setCount] = useState(0);

	return () => {
		setCount((count) => {
			return count + 1;
		});
	};
}

// https://stackoverflow.com/a/29246176
function randomInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const App = ({}) => {
	const [images, setImages] = useState([
		{
			x: 20,
			y: 20,
		},
		{
			x: 200,
			y: 100,
		},
		{
			x: 50,
			y: 70,
		},
	]);
	const yOffRef = useRef(0);
	const rerender = useRender();
	const zoomRef = useRef(1);
	const MAX_ZOOM = 2;

	return (<div>
		<Canvas
			width={600}
			height={400}
		>
			<Rect x={0} y={0} x2={600} y2={400} color="#fff" fill={true} />
			<CompoundElement
				yOff={yOffRef.current}
				extraData={'foo'}
				zoom={zoomRef.current}
				maxZoom={2}
				zoomAffectOffset={true}
			>
				<Rect x={-50*MAX_ZOOM} y={0} x2={0} y2={50*MAX_ZOOM} color="#f00" fill={true} />
				{images.map((image, index) => {
					return <Image key={index} src={sampleImage} x={image.x*MAX_ZOOM} y={image.y*MAX_ZOOM} width={50*MAX_ZOOM} height={50*MAX_ZOOM} />
				})}
				<Component x={50*MAX_ZOOM} y={50*MAX_ZOOM} />
			</CompoundElement>
		</Canvas>
		<br/>
		<input
			type="button"
			onClick={() => {
				setImages((images) => {
					// shift everything down, then shift over, to make it look like nothing has moved when we add the new image
					for (const image of images) {
						image.y += yOffRef.current;
					}
					yOffRef.current = 0;
					return [
						...images,
						{
							x: randomInteger(20, 380),
							y: 0,
						},
					];
				});
			}}
			value={`Add Image (${images.length})`}
		/>
		<input
			type="button"
			onClick={() => {
				yOffRef.current += 5;
				setImages((images) => {
					for (const image of images) {
						if (image.y + yOffRef.current > 400) {
							image.dead = true;
						}
					}
					images = images.filter((image) => !image.dead);
					return [
						...images,
					];
				});
				rerender();
			}}
			value={`Move Down (${yOffRef.current})`}
		/>
		<input type="button" onClick={() => {
			zoomRef.current -= 0.1;

			if (zoomRef.current < 0.2) {
				zoomRef.current = 0.2;
			}
			rerender();
		}} value="Zoom Out" />
		<input type="button" onClick={() => {
			zoomRef.current += 0.1;

			if (zoomRef.current > 2) {
				zoomRef.current = 2;
			}
			rerender();
		}} value="Zoom In" />
	</div>);
};

export default App;