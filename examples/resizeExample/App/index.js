import React, { PropTypes } from 'react';
import { Canvas, Text, Shape, Image } from 'react-canvas';
import Thing from '../Thing';

import styles from './styles.css';

class App extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			width: 50
		};
		
		setInterval(() => {
			let newWidth = this.state.width + 10;
			if (newWidth > 300) {
				newWidth = 50;
			}
			this.setState({
				width: newWidth
			});
		}, 100);
	}
	render() {
		return (<div className={styles.appRoot}>
			<Canvas
				width={this.state.width}
				height={300}
			>
				<Shape
					x={40}
					y={0}
					points={[
						{ x: 10, y: 10},
						{ x: 260, y: 10 },
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
	}
};

export default App;