import React, { useEffect, useState } from 'react';
import { Canvas, Shape, Image, Images, Pattern } from 'react-canvas';

import sampleImage from './sampleImage.png';

const App = ({}) => {
	const [rot, setRot] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			let newRot = rot + 10;
			if (newRot >= 360) {
				newRot -= 360;
			}

			setRot(newRot);
		}, 500);

		return () => {
			clearInterval(interval);
		}
	})

	return (<div>
		<Canvas
			width={600}
			height={400}
		>
			<Image
				src={sampleImage}
				x={0}
				y={200}
				width={200}
				height={200}
				rot={rot}
			/>
			<Image
				src={sampleImage}
				x={200}
				y={0}
				width={200}
				height={200}
				clip={{
					x: 100,
					y: 100,
					width: 50,
					height: 100,
				}}
			/>
			<Image
				src={sampleImage}
				x={400}
				y={200}
				width={200}
				height={200}
				rot={rot}
				clip={{
					x: 100,
					y: 100,
					width: 50,
					height: 100,
				}}
				onLoad={() => {
					console.log('sample image loaded');
				}}
			/>
			<Images
				images={[
					{
						src: sampleImage,
						x: 400,
						y: 0,
						width: 100,
						height: 100,
						clip: {
							x: 50,
							y: 50,
							height: 50,
							width: 50,
						},
					},
					{
						src: sampleImage,
						x: 500,
						y: 0,
						width: 100,
						height: 100,
						rot,
						clip: {
							x: 0,
							y: 50,
							height: 50,
							width: 50,
						},
					},
					{
						src: sampleImage,
						x: 400,
						y: 100,
						width: 100,
						height: 100,
						clip: {
							x: 50,
							y: 0,
							height: 50,
							width: 50,
						},
					},
					{
						src: sampleImage,
						x: 500,
						y: 100,
						width: 100,
						height: 100,
						clip: {
							x: 0,
							y: 0,
							height: 50,
							width: 50,
						},
					},
				]}
				onLoad={(src) => {
					console.log("loaded", src);
				}}
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
			<Pattern
				x={200}
				y={200}
				width={200}
				height={200}
				src={sampleImage}
			/>
		</Canvas>
	</div>);
};

export default App;