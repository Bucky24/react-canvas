import { CanvasComponent, Container, Text, Shape } from 'react-canvas';
import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	x: PropTypes.number,
	y: PropTypes.number,
	width: PropTypes.number,
	height: PropTypes.number
};

class Button extends CanvasComponent {
	constructor(props) {
		super(props);
		
		this.state = {
			mouseOver: false
		};
		
		this.bounds = {
			x: this.props.x,
			y: this.props.y,
			width: this.props.width,
			height: this.props.height
		};
	}
	onMouseMove(data, overMe) {
		console.log('mouse moved');
		this.setState({
			mouseOver: overMe
		});
	}
	onMouseUp(data, overMe) {
		console.log('mouse up');
		if (overMe) {
			alert('clicked!');
		}
	}
	onMouseDown(data) {
		console.log('mouse down');
	}
	render() {
		const color = this.state.mouseOver ? '#0f0' : '#f00';
		return (<Container>
			<Shape
				x={this.props.x}
				y={this.props.y}
				points={[
					{ x: 0, y: 0 },
					{ x: this.props.width, y: 0 },
					{ x: this.props.width, y: this.props.height },
					{ x: 0, y: this.props.height }
				]}
				color={color}
				fill={true}
			/>
			<Text x={this.props.x + 10} y={this.props.y + 20}>
				Button
			</Text>
		</Container>);
	}
};

Button.propTypes = propTypes;

export default Button;