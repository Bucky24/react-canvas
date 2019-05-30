import React from 'react';
import PropTypes from 'prop-types';

export const EventTypes = {
	MOVE: 'move',
	MOUSE_DOWN: 'down',
	MOUSE_UP: 'up'
};

export const ButtonTypes = {
	LEFT: 'left',
	MIDDLE: 'middle',
	RIGHT: 'right'
}

// 0=left, 1=middle, 2=right
const ButtonMap = [
	ButtonTypes.LEFT,
	ButtonTypes.MIDDLE,
	ButtonTypes.RIGHT
];

class Canvas extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			context: null
		};
		
		this.reattachListeners = this.reattachListeners.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.registerListener = this.registerListener.bind(this);
		this.unregisterListener = this.unregisterListener.bind(this);
		
		// map of event to array of function callbacks
		this.listeners = {};
	}
	registerListener(event, fn) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(fn);
	}
	unregisterListener(event, fn) {
		if (!this.listeners[event]) {
			return;
		}
		
		const index = this.listeners[event].indexOf(fn);
		
		if (index < 0) return;
		this.listeners[event].splice(index, 1);
	}
	getChildContext() {
	    return {
			context: this.state.context,
			registerListener: this.registerListener,
			unregisterListener: this.unregisterListener
		};
	}
	componentWillUpdate(newProps) {
		if (newProps.width !== this.canvas.width) {
			this.canvas.width = newProps.width;
		}
		if (newProps.height !== this.canvas.height) {
			this.canvas.height = newProps.height;
		}
	}
	componentDidMount() {
		if (this.props.width !== this.canvas.width) {
			this.canvas.width = this.props.width;
		}
		if (this.props.height !== this.canvas.height) {
			this.canvas.height = this.props.height;
		}
	}
	reattachListeners() {
		// remove previous event handlers. this is so we avoid
		// double and triple triggering events
		this.canvas.removeEventListener('mousemove', this.handleMouseMove);
		this.canvas.removeEventListener('mousedown', this.handleMouseDown);
		this.canvas.removeEventListener('mouseup', this.handleMouseDown);
		
		this.canvas.addEventListener('mousemove', this.handleMouseMove);
		this.canvas.addEventListener('mousedown', this.handleMouseDown);
		this.canvas.addEventListener('mouseup', this.handleMouseUp);
	}
	handleMouseMove(event) {
		this.triggerEvent(EventTypes.MOVE, {
			x: event.clientX,
			y: event.clientY
		});
	}
	handleMouseDown(event) {
		this.triggerEvent(EventTypes.MOUSE_DOWN, {
			x: event.clientX,
			y: event.clientY,
			button: ButtonMap[event.button]
		});
	}
	handleMouseUp(event) {
		this.triggerEvent(EventTypes.MOUSE_UP, {
			x: event.clientX,
			y: event.clientY,
			button: ButtonMap[event.button]
		});
	}
	triggerEvent(event, data) {
		if (!this.listeners[event]) {
			return;
		}
		
		this.listeners[event].forEach((fn) => {
			fn(data);
		})
	}
	render() {
		return <canvas
			ref={(c) => {
				if (c) {
					const newContext = c.getContext('2d');
					if (this.state.context !== newContext) {
						this.canvas = c;
						this.setState({
							context: newContext
						}, () => {
							this.reattachListeners();
						});
					}
				}
			}}
		>
			{this.props.children}
		</canvas>;
	}
};

Canvas.childContextTypes = {
 	context: PropTypes.object,
	registerListener: PropTypes.func,
	unregisterListener: PropTypes.func
};

const Container = ({ children }) => {
	if (Array.isArray(children)) {
		return [...children];
	} else {
		return children;
	}
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

const imageMap = {};

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
		
		let img;

		const finishLoading = () => {
			const image = imageMap[src];
			context.drawImage(image, x,y, width, height);
		}
		
		if (imageMap[src]) {
			finishLoading(imageMap[src]);
		} else {
			const body = document.getElementsByTagName("body")[0];
		
			const img = document.createElement("img");
			img.src = src;
			img.onload = () => {
				imageMap[src] = img;
				finishLoading();
			};
			if (img.loaded) {
				imageMap[src] = img;
				finishLoading();
			}
			img.style.display = 'none';
			body.append(img);
		}
		
		return null;
	}
};

Image.contextTypes = Canvas.childContextTypes;

class CanvasComponent extends React.Component {
	constructor(props) {
		super(props);
		
		this.bounds = null;
		
		this.handleMove = this.handleMove.bind(this);
		this.handleUp = this.handleUp.bind(this);
		this.handleDown = this.handleDown.bind(this);
	}
	componentDidMount() {
		this.context.registerListener(EventTypes.MOVE, this.handleMove);
		this.context.registerListener(EventTypes.MOUSE_UP, this.handleUp);
		this.context.registerListener(EventTypes.MOUSE_DOWN, this.handleDown);
	}
	insideMe(x, y) {
		if (!this.bounds) {
			return false;
		}
		return x > this.bounds.x && x < this.bounds.x + this.bounds.width && y > this.bounds.y && y < this.bounds.y + this.bounds.height
	}
	handleMove(data) {
		let insideMe = this.insideMe(data.x, data.y);
		
		this.onMouseMove(data, insideMe);
	}
	handleUp(data) {
		let insideMe = this.insideMe(data.x, data.y);
		
		this.onMouseUp(data, insideMe);
	}
	handleDown(data) {
		let insideMe = this.insideMe(data.x, data.y);
		
		this.onMouseDown(data, insideMe);
	}
	componentWillUnmount() {
		this.context.unregisterListener(EventTypes.MOVE, this.handleMove);
		this.context.unregisterListener(EventTypes.MOUSE_UP, this.handleUp);
		this.context.unregisterListener(EventTypes.MOUSE_DOWN, this.handleDown);
	}
	
	// stubs
	onMouseMove() {}
	onMouseUp() {}
	onMouseDown() {}
}

CanvasComponent.contextTypes = Canvas.childContextTypes;

export {
	Canvas,
	Container,
	Text,
	Shape,
	Image,
	CanvasComponent
};