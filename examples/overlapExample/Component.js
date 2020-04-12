import React from 'react';
import { Container, Text, Shape } from 'react-canvas';

class Component extends React.Component {
	render() {
	 	const { x, y } = this.props;
		return (<Shape
			x={x}
			y={y}
			points={[
				{ x: 0, y: 0},
				{ x: 100, y: 0 },
				{ x: 100, y: 100 },
				{ x: 0, y: 100},
			]}
			color="#ff0"
			fill={true}
		/>);
	}
};

export default Component;