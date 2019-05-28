import React, { PropTypes } from 'react';
import { Canvas, Text, Shape, Image } from 'react-canvas';
import Thing from '../Thing';

import styles from './styles.css';

const App = ({}) => {
	return (<div className={styles.appRoot}>
		<Canvas
			width={300}
			height={300}
		>
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
			<Text
				x={5}
				y={60}
			>
				Some text here
			</Text>
			<Image
				src="http://solumcraft.com/favicon.ico"
				x={40}
				y={50}
				width={50}
				height={50}
			/>
			<Thing />
		</Canvas>
	</div>);
};

export default App;