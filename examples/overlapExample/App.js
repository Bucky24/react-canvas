import React, { useState, useEffect } from 'react';
import {
	Canvas,
	Rect,
} from 'react-canvas';
import Component from './Component';
import Component2 from './Component2';

import styles from './styles.css';

const App = ({}) => {
	return (<div className={styles.appRoot}>
		<Canvas
			width={400}
			height={300}
		>
			<Component2/>
			<Rect
				x={200}
				y={50}
				x2={300}
				y2={150}
				color="#bcd"
				fill={true}
				zIndex={2}
			/>
			<Component
				x={50}
				y={50}
				zIndex={7}
			/>
			null,
		</Canvas>
	</div>);
};

export default App;