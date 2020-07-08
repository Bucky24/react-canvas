import React from 'react';
import { Canvas, Shape, Image, Images, Pattern } from 'react-canvas';

import sampleImage from './sampleImage.png';

const App = ({}) => {
	return (<div>
		<Canvas
			width={600}
			height={400}
		>
			<Image
				src={sampleImage}
				x={0}
				y={0}
				width={200}
				height={200}
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