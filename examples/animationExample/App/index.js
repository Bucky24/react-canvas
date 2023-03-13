import React, { useContext, useEffect } from 'react';
import {
	Canvas,
	Animate,
	AnimationContext,
	Rect,
} from '@bucky24/react-canvas';

import styles from './styles.css';

import SpriteSheet from '../SpriteSheet.png';

const App = ({}) => {
	const { tick } = useContext(AnimationContext);

	useEffect(() => {
		const interval = setInterval(() => {
			tick();
		}, 100);

		return () => {
			clearInterval(interval);
		}
	}, []);

	return (<div className={styles.appRoot}>
		<Canvas
			width={400}
			height={400}
		>
			<Rect
				color="#fff"
				x={0}
				y={0}
				x2={400}
				y2={400}
				fill={true}
			/>
			<Animate
				src={SpriteSheet}
				cellWidth={25}
				cellHeight={34}
				startX={0}
				startY={0}
				frameCount={12}
				rowWidth={4}
				x={100}
				y={100}
				width={100}
				height={100}
			/>
		</Canvas>
	</div>);
};

export default App;