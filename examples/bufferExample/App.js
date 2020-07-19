import React, { useState, useEffect } from 'react';
import {
	Canvas,
	Line,
} from 'react-canvas';

import styles from './styles.css';

const App = ({}) => {
	return (<div className={styles.appRoot}>
		<Canvas
			width={400}
            height={300}
            customRender={true}
            doubleBuffer={true}
		>
			<Line
                x={10}
                y={10}
                x2={100}
                y2={10}
                color="#888"
            />
            <Line
                x={10}
                y={20}
                x2={100}
                y2={20}
                color="#888"
            />
		</Canvas>
	</div>);
};

export default App;