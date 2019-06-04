import { CanvasComponent, Container, Text, Shape } from 'react-canvas';
import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	x: PropTypes.number,
	y: PropTypes.number
};

class MyText extends CanvasComponent {
	constructor(props) {
		super(props);
		
		this.state = {
			text: ''
		};
	}
	onKeyDown({ char }) {
		if (char) {
			this.setState({
				text: `${this.state.text}${char}`
			});
		}
	}
	onKeyUp({ code }) {
		if (code === 'Backspace') {
			this.setState({
				text: this.state.text.substr(0,
					this.state.text.length-1)
			});
		}
	}
	render() {
		return (<Container>
		<Shape
			x={this.props.x}
			y={this.props.y-10}
			points={[
				{ x: 0, y: 0 },
				{ x: 400, y: 0 },
				{ x: 400, y: 20 },
				{ x: 0, y: 20 }
			]}
			color="#fff"
			fill={true}
		/>
			<Text x={this.props.x} y={this.props.y}>
				{ this.state.text }
			</Text>
		</Container>);
	}
};

Text.propTypes = propTypes;

export default MyText;