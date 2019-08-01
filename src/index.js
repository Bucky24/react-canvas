import React from 'react';
import PropTypes from 'prop-types';

export const EventTypes = {
	MOVE: 'mousemove',
	MOUSE_DOWN: 'mousedown',
	MOUSE_UP: 'mouseup',
	KEY_DOWN: 'keydown',
	KEY_UP: 'keyup'
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

function drawShape(x, y, context, points, color, fill) {
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
}

const okCodes = [
	'Space',
	'Backslash',
	'BracketLeft',
	'BracketRight',
	'Quote',
	'Semicolon',
	'Period',
	'Comma',
	'Slash',
	'Backquote',
	'Minus',
	'Equal'
];

function getChar({ key, code }) {
	if (code.indexOf('Key') === 0
		|| code.indexOf('Digit') === 0
		|| code.indexOf('Numpad') === 0
	) {
		// some though we don't want
		if (code !== 'NumpadEnter') {
			return key;
		}
	}
	
	if (okCodes.includes(code)) {
		return key;
	}
	// if not key and not [in map, then no char for it
}

function getCode({ code }) {
	return code;
}
const handlerToProps = {
	[EventTypes.MOVE]: 'onMove',
	[EventTypes.MOUSE_DOWN]: 'onMouseDown',
	[EventTypes.MOUSE_UP]: 'onMouseUp',
	[EventTypes.KEY_DOWN]: 'onKeyDown',
	[EventTypes.KEY_UP]: 'onKeyUp'
};
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
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.handleContextMenu = this.handleContextMenu.bind(this);
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
		this.canvas.removeEventListener('contextmenu', this.handleContextMenu);
		window.removeEventListener('keydown', this.handleKeyDown);
		window.removeEventListener('keyup', this.handleKeyUp);
		
		this.canvas.addEventListener('mousemove', this.handleMouseMove);
		this.canvas.addEventListener('mousedown', this.handleMouseDown);
		this.canvas.addEventListener('mouseup', this.handleMouseUp);
		this.canvas.addEventListener('contextmenu', this.handleContextMenu);
		window.addEventListener('keydown', this.handleKeyDown);
		window.addEventListener('keyup', this.handleKeyUp);
	}
	getRealCoords(event) {
	    const rect = this.canvas.getBoundingClientRect();
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
	}
	handleMouseMove(event) {
		this.triggerEvent(EventTypes.MOVE, this.getRealCoords(event));
		event.preventDefault();
	}
	handleMouseDown(event) {
		this.triggerEvent(EventTypes.MOUSE_DOWN, {
			...this.getRealCoords(event),
			button: ButtonMap[event.button]
		});
		event.preventDefault();
	}
	handleMouseUp(event) {
		this.triggerEvent(EventTypes.MOUSE_UP, {
			...this.getRealCoords(event),
			button: ButtonMap[event.button]
		});
		event.preventDefault();
	}
	handleKeyDown(event) {
		this.triggerEvent(EventTypes.KEY_DOWN, {
			char: getChar(event),
			code: getCode(event)
		});
		event.preventDefault();
	}
	handleKeyUp(event) {
		this.triggerEvent(EventTypes.KEY_UP, {
			char: getChar(event),
			code: getCode(event)
		});
		event.preventDefault();
	}
	handleContextMenu(event) {
		event.preventDefault();
	}
	triggerEvent(event, data) {
		if (this.listeners[event]) {
			this.listeners[event].forEach((fn) => {
				fn(data);
			});
		}
		
		if (handlerToProps[event]) {
			const propName = handlerToProps[event];
			const propFn = this.props[propName];
			if (propFn) {
				propFn(data);
			}
		}
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

const Text = ({ children, x, y, color, font }, { context }) => {
	if (!context) {
		return null;
	}
	if (!color) {
		color = "#000";
	}
	if (!font) {
		font = "12px Arial";
	}
	context.save();
	context.font = font;
	context.fillStyle = color;
	context.fillText(children, x, y);
	context.restore();
	return null;
}

Text.contextTypes = Canvas.childContextTypes;

const Line = ({ x, y, x2, y2, color }, { context }) => {
	if (!context) {
		return null;
	}
	context.save();
	context.strokeStyle = color;
	context.beginPath();
	context.moveTo(x, y);
	context.lineTo(x2, y2);
	context.closePath();
	context.stroke();
	context.restore();
	return null;
}

Line.contextTypes = Canvas.childContextTypes;

const Shape = ({ x, y, points, color, fill }, { context }) => {
	if (points.length < 3 || !context) {
		return null;
	}
	
	drawShape(x, y, context, points, color, fill);
	
	return null;
}

Shape.contextTypes = Canvas.childContextTypes;

const Rect = ({ x, y, x2, y2, color, fill}, { context }) => {
	const width = Math.abs(x2 - x);
	const height = Math.abs(y2 - y);
	return <Shape
		x={x}
		y={y}
		points={[
			{ x: 0, y: 0 },
			{ x: 0, y: height },
			{ x: width, y: height},
			{ x: width, y: 0 }
		]}
		color={color}
		fill={fill}
	/>;
}

Rect.contextTypes = Canvas.childContextTypes;

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
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);
	}
	componentDidMount() {
		if (!this.context.registerListener) {
			console.error('Unable to get child context for CanvasComponent-likely it is not nested inside a Canvas');
			return;
		}
		this.context.registerListener(EventTypes.MOVE, this.handleMove);
		this.context.registerListener(EventTypes.MOUSE_UP, this.handleUp);
		this.context.registerListener(EventTypes.MOUSE_DOWN, this.handleDown);
		this.context.registerListener(EventTypes.KEY_DOWN, this.onKeyDown);
		this.context.registerListener(EventTypes.KEY_DOWN, this.onKeyUp);
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
		if (!this.context.unregisterListener) {
			console.error('Unable to get child context for CanvasComponent-likely it is not nested inside a Canvas');
			return;
		}
		this.context.unregisterListener(EventTypes.MOVE, this.handleMove);
		this.context.unregisterListener(EventTypes.MOUSE_UP, this.handleUp);
		this.context.unregisterListener(EventTypes.MOUSE_DOWN, this.handleDown);
		this.context.unregisterListener(EventTypes.KEY_DOWN, this.onKeyDown);
		this.context.unregisterListener(EventTypes.KEY_DOWN, this.onKeyUp);
	}
	
	// stubs
	onMouseMove() {}
	onMouseUp() {}
	onMouseDown() {}
	onKeyDown() {}
	onKeyUp() {}
}

CanvasComponent.contextTypes = Canvas.childContextTypes;

export {
	Canvas,
	Container,
	Text,
	Shape,
	Image,
	CanvasComponent,
	Line,
	Rect
};