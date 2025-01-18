import React from 'react';
import {
	Canvas,
	Text,
	Shape,
	Image,
	Line,
	Rect,
	Circle,
	Arc,
	Raw,
} from 'react-canvas';
import Thing from '../Thing';
import Thing2 from '../Thing2';

import sampleImage from '../sampleImage.png';

import styles from './styles.css';

const App = ({}) => {
	return (<div className={styles.appRoot}>
		<Canvas
			width={400}
			height={300}
			onWheel={({x, y}) => {
				console.log('wheel', x, y);
			}}
			debug={true}
		>
			<>
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
				<Shape
					x={300}
					y={0}
					points={[
						{ x: 10, y: 10},
						{ x: 100, y: 10 },
						{ x: 10, y: 100}
					]}
					color="#f00"
					fill={false}
					close={false}
				/>
				<Text
					x={5}
					y={60}
				>
					Some text here
				</Text>
			</>
			<Text
				x={5}
				y={80}
				font="24px Times New Roman"
				color="#00f"
			>
				Big Text
			</Text>
			<Image
				src="http://solumcraft.com/favicon.ico"
				x={40}
				y={50}
				width={50}
				height={50}
			/>
			<Image
				src={sampleImage}
				x={100}
				y={50}
				width={50}
				height={50}
			/>
			<Line
				x={0}
				y={0}
				x2={300}
				y2={10}
				color="#555"
			/>
			<Rect
				x={200}
				y={50}
				x2={250}
				y2={100}
				color="#bcd"
				fill={false}
			/>
			<Thing />
			<Thing2
				x={0}
				y={200}
			/>
			<Circle
				x={130}
				y={85}
				radius={50}
				color="#0f0"
				fill={false}
			/>
			<Arc
				x={230}
				y={70}
				radius={20}
				color="#0f0"
				startAngle={120*Math.PI/180}
				endAngle={240*Math.PI/180}
				fill={true}
				sector={false}
			/>
			<Arc
				x={230}
				y={70}
				radius={20}
				color="#0f0"
				startAngle={0}
				endAngle={120*Math.PI/180}
				fill={true}
				sector={true}
			/>
			<Raw drawFn={(context) => {
				context.fillStyle = "#0ff";
				context.beginPath();
				context.arc(300, 100, 40, 0, Math.PI/2, false);
				context.arc(300, 100, 30, Math.PI/2, 0, true);
				context.closePath();
				context.fill();
			}}/>
		</Canvas>
	</div>);
};

export default App;