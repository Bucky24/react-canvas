import React from 'react';
import { Container, Rect, CanvasComponent } from 'react-canvas';

const colors = [
	"#f00",
	"#0f0",
	"#00f",
];

class Component2 extends CanvasComponent {
	constructor(props) {
		super(props);

		this.state = {
			color: colors[0],
		};
	}
	
	componentDidMount() {
		this.interval = setInterval(() => {
			const randomColor = Math.floor(Math.random() * (colors.length));
			this.setState({
				color: colors[randomColor],
			});
		}, 1000);
	}
	
	componentWillUnmount() {
		clearInterval(this.interval);
	}
	
	render() {
		super.render();

		const { x, y } = this.props;

		return (<Rect
			x={20}
			y={70}
			x2={360}
			y2={70+50}
			color={this.state.color}
			fill={true}
		/>);
	}
};

export default Component2;