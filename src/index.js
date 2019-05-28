import React from 'react';
import PropTypes from 'prop-types';

class Canvas extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			context: null
		};
	}
	getChildContext() {
	    return { context: this.state.context };
	}
	
	render() {
		return <canvas
			ref={(c) => { 
				if (this.canvas !== c && c) {
					this.canvas = c; 
					this.setState({ context: c ? c.getContext("2d") : null });
				}
			}}
			width={this.props.width}
			height={this.props.height}
		>
			{this.props.children}
		</canvas>;
	}
};

Canvas.childContextTypes = {
  context: PropTypes.object
};

const Container = ({ children }) => {
	return ({...children});
}

Container.contextTypes = Canvas.childContextTypes;

const Text = ({ children, x, y }, { context }) => {
	if (!context) {
		return null;
	}
	context.save();
	context.fillText(children, x, y);
	context.restore();
	return null;
}

Text.contextTypes = Canvas.childContextTypes;

const Shape = ({ x, y, points, color, fill }, { context }) => {
	if (points.length < 3 || !context) {
		return null;
	}
	
	context.save();
	context.fillStyle = color;
	context.strokeStyle = color;
	context.beginPath();
	context.moveTo(points[0].x + x,points[0].y + y);
	for (var i=1;i<points.length;i++) {
		context.lineTo(points[i].x + x,points[i].y + y);
	}
	context.closePath();
	if (fill) context.fill();
	context.stroke();
	context.restore();
	
	return null;
}

Shape.contextTypes = Canvas.childContextTypes;

class Image extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			imageHandle: null
		};
	}
	
	render() {
		const { src, x, y, width, height } = this.props;
		const { context } = this.context;
		
		if (!context) {
			return null;
		}
		
		const finishLoading = () => {
			context.drawImage(img, x,y, width, height);
		}
		
		const body = document.getElementsByTagName("body")[0];
		
		const img = document.createElement("img");
		img.src = src;
		img.onload = finishLoading;
		if (img.loaded) {
			finishLoading();
		}
		body.append(img);
		
		return null;
	}
};

Image.contextTypes = Canvas.childContextTypes;

export {
	Canvas,
	Container,
	Text,
	Shape,
	Image
};