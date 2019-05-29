import React from 'react';
import { Container, Text, Shape, EventTypes, Canvas } from 'react-canvas';
import PropTypes from 'prop-types';

const propTypes = {
	x: PropTypes.number,
	y: PropTypes.number,
	width: PropTypes.number,
	height: PropTypes.number
};

class Button extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			mouseOver: false
		};
		
		this.handleMove = this.handleMove.bind(this);
	}
	componentDidMount() {
		this.context.registerListener(EventTypes.MOVE, this.handleMove);
	}
	handleMove(data) {
		if (data.x > this.props.x && data.x < this.props.x + this.props.width && data.y > this.props.y && data.y < this.props.y + this.props.height) {
			this.setState({
				mouseOver: true
			});
		} else {
			this.setState({
				mouseOver: false
			});
		}
	}
	componentWillUnmount() {
		this.context.unregisterListener(EventTypes.MOVE, this.handleMove);
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

Button.contextTypes = Canvas.childContextTypes;
Button.propTypes = propTypes;

export default Button;