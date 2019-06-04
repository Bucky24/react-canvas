import React, { PropTypes } from 'react';
import { Canvas } from 'react-canvas';
import Button from '../Button';
import MyText from '../Text';

import styles from './styles.css';

class App extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (<div className={styles.appRoot}>
			<Canvas
				width={300}
				height={300}
				onMove={(data) => {
					console.log("mouse moved to", data);
				}}
			>
				<Button 
					x={100}
					y={100}
					width={100}
					height={50}
				/>
				<MyText
					x={100}
					y={200}
				/>
			</Canvas>
		</div>);
	}
};

export default App;