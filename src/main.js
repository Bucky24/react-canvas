import React, { useContext, useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import ReactDOM from 'react-dom';
import ReactDOMClient from 'react-dom/client';

import { AnimationProvider } from './contexts/AnimationContext';
import { RenderProvider } from './contexts/RenderContext';

export const EventTypes = {
	MOVE: 'mousemove',
	MOUSE_DOWN: 'mousedown',
	MOUSE_UP: 'mouseup',
	KEY_DOWN: 'keydown',
	KEY_UP: 'keyup',
	WHEEL: 'wheel',
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

// from https://stackoverflow.com/a/7616484/8346513
function hashString(str) {
	var hash = 0, i, chr;
	for (i = 0; i < str.length; i++) {
		chr   = str.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return (hash >>> 0);
}

function drawShape(x, y, context, points, color, fill, close) {
	context.save();
	context.fillStyle = color;
	context.strokeStyle = color;
	context.beginPath();
	context.moveTo(points[0].x + x,points[0].y + y);
	for (var i=1;i<points.length;i++) {
		context.lineTo(points[i].x + x,points[i].y + y);
	}
	if (close) {
		context.closePath();
	}
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
	[EventTypes.MOVE]: 'onMouseMove',
	[EventTypes.MOUSE_DOWN]: 'onMouseDown',
	[EventTypes.MOUSE_UP]: 'onMouseUp',
	[EventTypes.KEY_DOWN]: 'onKeyDown',
	[EventTypes.KEY_UP]: 'onKeyUp',
	[EventTypes.WHEEL]: 'onWheel',
};

const CanvasContext = React.createContext({
	context: null,
	registerListener: null,
	unregisterListener: null,
	triggerRender: null,
	getImage: null,
	loadPattern: null,
	forceRenderCount: null,
});

const CanvasClipContext = React.createContext({
	data: null,
});

const loadingMap = {};
const imageMap = {};

function loadImage(src, cb) {
	const hash = hashString(src);
	if (imageMap[hash]) {
		return imageMap[hash];
	}
	
    if (loadingMap[hash]) {
		// if we've already registered this function, don't register it again
  		if (loadingMap[hash].includes(cb)) {
  			return null;
		}
  	  	loadingMap[hash].push(cb);
  	  	return null;
    }
	
	// else load it
	const body = document.getElementsByTagName("body")[0];

	const img = document.createElement("img");
	img.src = src;
	img.onload = () => {
		imageMap[hash] = img;
		if (hash in loadingMap) {
			const list = loadingMap[hash];
			// this has to be done first, because we need to
			// finish this function call. Otherwise, if the cb
			// causes the image to be loaded again, this loops
			// forever.
			setTimeout(() => {
			  list.forEach((cb) => {
				cb(src, img);
			  });
			});
		}
		delete loadingMap[hash];
	};
	if (img.loaded) {
		imageMap[hash] = img;
		delete loadingMap[hash];
		return img;
	} else {
		if (!(hash in loadingMap)) {
			loadingMap[hash] = []
		}
		loadingMap[hash].push(cb);
	}
	img.style.display = 'none';
	body.append(img);
	
	return null;
}

function loadImagePromise(src) {
    return new Promise((resolve) => {
        loadImage(src, (src, img) => {
            resolve(img);
        });
    });
}

const patternMap = {};
const patternLoadingMap = {};

function loadPattern(src, context, cb) {
	const hash = hashString(src);
	if (patternMap[hash]) {
		return patternMap[hash];
	}

	const image = loadImage(src, (src, img) => {
		const pattern = context.createPattern(img, 'repeat');
		patternMap[hash] = pattern;
		patternLoadingMap[hash].forEach((cb) => {
			cb(src);
		});
	});

	if (image) {
		const pattern = context.createPattern(image, 'repeat');
		patternMap[hash] = pattern;
		return image;
	}
	
	if (!patternLoadingMap[hash]) {
		patternLoadingMap[hash] = [];
	}
	
	if (patternLoadingMap[hash].includes(cb)) {
		return null;
	}
	
	patternLoadingMap[hash].push(cb);

	return null;
}

const canvasProps = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	captureAllKeyEvents: PropTypes.bool,
	drawWidth: PropTypes.number,
	drawHeight: PropTypes.number,
}

const canvasDefaultProps = {
	captureAllKeyEvents: true,
	drawWidth: undefined,
	drawHeight: undefined,
}

class Canvas extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			context: null
		};
		
		this.indexList = [];
		
		this.reattachListeners = this.reattachListeners.bind(this);
		this.removeListeners = this.removeListeners.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.handleContextMenu = this.handleContextMenu.bind(this);
		this.handleWheel = this.handleWheel.bind(this);
		this.registerListener = this.registerListener.bind(this);
		this.unregisterListener = this.unregisterListener.bind(this);
		this.forceRerender = this.forceRerender.bind(this);
		
		// map of event to array of function callbacks
		this.listeners = {};

		// count of how many times we've force-rendered (generally used to determine if the only reason we're rendering is because an image loaded)
		this.forceRenderCount = 0;
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
	forceRerender() {
		this.forceRenderCount += 1;
		this.forceUpdate();
	}
	getMyContext() {
		let width = this.props.drawWidth;
		if (!width) {
			width = this.canvas ? this.canvas.width : this.props.width;
		}
		let height = this.props.drawHeight;
		if (!height) {
			height = this.canvas ? this.canvas.height : this.props.height;
		}
	    return {
			context: this.state.context,
			registerListener: this.registerListener,
			unregisterListener: this.unregisterListener,
			forceRerender: this.forceRerender,
			triggerRender: this.triggerRender,
			getImage: loadImage,
			loadPattern: loadPattern,
			forceRenderCount: this.forceRenderCount,
            width,
            height,
		};
	}
	UNSAFE_componentWillUpdate(newProps) {
		this.processChanges(newProps);
	}
	processChanges(props) {
		const useWidth = props.drawWidth || props.width;
		const useHeight = props.drawHeight || props.height;

		if (useWidth !== this.canvas.width) {
			this.canvas.width = useWidth;
		}
		if (useHeight !== this.canvas.height) {
			this.canvas.height = useHeight;
		}
		if (props.drawWidth !== props.width) {
			this.canvas.style.width = `${props.width}px`;
		}
		if (props.drawHeight !== props.height) {
			this.canvas.style.height = `${props.height}px`;
		}
	}
	componentWillUnmount() {
		this.removeListeners();
	}
	removeListeners() {
		this.canvas.removeEventListener('touchmove', this.handleMouseMove);
		this.canvas.removeEventListener('touchstart', this.handleMouseDown);
		this.canvas.removeEventListener('touchend', this.handleMouseUp);
		this.canvas.removeEventListener('mousemove', this.handleMouseMove);
		this.canvas.removeEventListener('mousedown', this.handleMouseDown);
		this.canvas.removeEventListener('mouseup', this.handleMouseUp);
		this.canvas.removeEventListener('contextmenu', this.handleContextMenu);
		window.removeEventListener('keydown', this.handleKeyDown);
		window.removeEventListener('keyup', this.handleKeyUp);
		this.canvas.removeEventListener('wheel', this.handleWheel);
	}
	reattachListeners() {
		// remove previous event handlers. this is so we avoid
		// double and triple triggering events
		this.removeListeners();

		this.canvas.addEventListener('touchmove', this.handleMouseMove);
		this.canvas.addEventListener('touchstart', this.handleMouseDown);
		this.canvas.addEventListener('touchend', this.handleMouseUp);
		this.canvas.addEventListener('mousemove', this.handleMouseMove);
		this.canvas.addEventListener('mousedown', this.handleMouseDown);
		this.canvas.addEventListener('mouseup', this.handleMouseUp);
		this.canvas.addEventListener('contextmenu', this.handleContextMenu);
		window.addEventListener('keydown', this.handleKeyDown);
		window.addEventListener('keyup', this.handleKeyUp);
		this.canvas.addEventListener('wheel', this.handleWheel);
	}
	getRealCoords(event) {
	    const rect = this.canvas.getBoundingClientRect();
		
		// if this is a touch event, handle it specially
		if (event.touches) {
			const handledTouches = [];
			for (const touch of event.touches) {
				handledTouches.push({
					x: touch.clientX - rect.left,
					y: touch.clientY - rect.top,
				});
			}
			
			if (handledTouches.length === 0) {
				// touchend only has changedTouches
				for (const touch of event.changedTouches) {
					handledTouches.push({
						x: touch.clientX - rect.left,
						y: touch.clientY - rect.top,
					});
				}
			}
			
			if (handledTouches.length === 0) {
				// shouldn't happen but just in case
				return {};
			}
			
			return {
				x: handledTouches[0].x,
				y: handledTouches[0].y,
				touches: handledTouches,
			}
		}
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
		const bodyEvent = event.target.tagName === 'BODY';
		if (!bodyEvent && !this.props.captureAllKeyEvents) {
			// if this event did not come from the body, check if
			// we want to capture all events. If we do, capture it
			// if not, ignore it
			return;
		}
		this.triggerEvent(EventTypes.KEY_DOWN, {
			char: getChar(event),
			code: getCode(event)
		});
		event.preventDefault();
	}
	handleKeyUp(event) {
		const bodyEvent = event.target.tagName === 'BODY';
		if (!bodyEvent && !this.props.captureAllKeyEvents) {
			// if this event did not come from the body, check if
			// we want to capture all events. If we do, capture it
			// if not, ignore it
			return;
		}
		this.triggerEvent(EventTypes.KEY_UP, {
			char: getChar(event),
			code: getCode(event)
		});
		event.preventDefault();
	}
	handleContextMenu(event) {
		event.preventDefault();
	}
	handleWheel(event) {
		// Firefox uses deltaY, but it's opposite of the normal wheel delta
		const delta = event.wheelDelta || -event.deltaY;
		this.triggerEvent(EventTypes.WHEEL, {
			...this.getRealCoords(event),
			up: delta > 0,
		});
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
		this.indexList = [];
		
		let newChildren = this.props.children;

		if (!Array.isArray(newChildren)) {
			newChildren = [newChildren];
		}

		const refFunc = (c) => {
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
		}

		return (
			<CanvasContext.Provider value={this.getMyContext()}>
				<canvas
					ref={refFunc}
				>
					{newChildren}
				</canvas>
			</CanvasContext.Provider>
		);
	}
};

Canvas.propTypes = canvasProps;
Canvas.defaultProps = canvasDefaultProps;

const Text = ({ children, x, y, color, font }) => {
	const withContext = useWithContext();

	return withContext((context) => {
		if (!color) {
			color = "#000";
		}
		if (!font) {
			font = "12px Arial";
		}
		context.save();
		context.font = font;
		context.fillStyle = color;
		if (!Array.isArray(children)) {
			children = [children];
		}
		context.fillText(children.join(''), x, y);
		context.restore();
	});
}

const Line = ({ x, y, x2, y2, color }) => {
	const withContext = useWithContext();

	return withContext((context) => {
		context.save();
		context.strokeStyle = color;
		context.beginPath();
		context.moveTo(x, y);
		context.lineTo(x2, y2);
		context.closePath();
		context.stroke();
		context.restore();
	});
}

const Shape = ({ x, y, points, color, fill, close }) => {
	const withContext = useWithContext();

	return withContext((context) => {
		if (close === undefined) {
			close = true;
		}

		drawShape(x, y, context, points, color, fill, close);
	});
}

const Rect = ({ x, y, x2, y2, color, fill}) => {
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

const imagePropTypes = {
	src: PropTypes.oneOfType([
		PropTypes.instanceOf(Element),
		PropTypes.string,
	]).isRequired,
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	clip: PropTypes.shape({
		x: PropTypes.number.isRequired,
		y: PropTypes.number.isRequired,
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired,
	}),
	flipX: PropTypes.bool,
	flipY: PropTypes.bool,
	onLoad: PropTypes.func,
};

const imageDefaultProps = {
	flipX: false,
	flipY: false,
};

function Image({
	src, x, y, width, height, clip, rot, onLoad, flipY, flipX,
}) {
	const { forceRerender, getImage } = useContext(CanvasContext);
	const withContext = useWithContext();

	return withContext((context) => {
		const isElement = src instanceof Element || src instanceof HTMLDocument;

		let img;

		if (isElement) {
			if (src.nodeName !== "CANVAS" && src.nodeName !== "IMG") {
				throw new Error("A DOM element was passed as a src to Image, but the element was not a canvas or an img.");
			}
			img = src;
		} else if (src instanceof Object) {
			throw new Error("An object was passed as a src to Image, but it was not a DOM element");
		} else {
			const loadFn = onLoad || forceRerender;

			img = getImage(src, loadFn);
		}
		
		if (!img) {
			return null;
		}

		context.save();
		
		if (clip) {
			const { x: sx, y: sy, width: sw, height: sh } = clip;
			const iw = img.width;
			const ih = img.height;
			
			// basically convert the clip coords from draw space to image space
			const rw = iw / width;
			const rh = ih / height;
			const finalX = sx * rw;
			const finalY = sy * rh;
			context.translate(x+width/2, y+height/2);
			if (rot) {
				const rotRad = rot * Math.PI/180;
				context.rotate(rotRad);
			}
			if (flipX || flipY) {
				context.scale(flipX ? -1 : 1, flipY ? -1 : 1);
			}
			context.translate(-x-width/2, -y-height/2);
			context.drawImage(img, finalX, finalY, sw * rw, sh * rh, x, y, width, height);
		} else {
			context.translate(x+width/2, y+height/2);
			if (rot) {
				const rotRad = rot * Math.PI/180;
				context.rotate(rotRad);
			}
			if (flipX || flipY) {
				context.scale(flipX ? -1 : 1, flipY ? -1 : 1);
			}
			context.translate(-x-width/2, -y-height/2);
			context.drawImage(img, x, y, width, height);
		}

		context.restore();
	});
};

Image.propTypes = imagePropTypes;
Image.defaultProps = imageDefaultProps;

const imagesPropTypes = {
	images: PropTypes.arrayOf(PropTypes.shape({
		src: PropTypes.string.isRequired,
		x: PropTypes.number.isRequired,
		y: PropTypes.number.isRequired,
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired,
		rot: PropTypes.number,
		clip: PropTypes.shape({
			x: PropTypes.number.isRequired,
			y: PropTypes.number.isRequired,
			width: PropTypes.number.isRequired,
			height: PropTypes.number.isRequired,
		}),
	})),
	onLoad: PropTypes.func,
}

const Images = ({ images, onLoad }) => {
	const { forceRerender, getImage } = useContext(CanvasContext);
	const withContext = useWithContext();
	
	return withContext((context) => {
		for (const image of images) {
			const { src, x, y, width, height, clip, rot } = image;

			const loadFn = onLoad || forceRerender;
			
			const img = getImage(src, loadFn);

			context.save();
			
			if (!img) {
				continue;
			}
			
			if (clip) {
				const { x: sx, y: sy, width: sw, height: sh } = clip;
				const iw = img.width;
				const ih = img.height;
				
				// basically convert the clip coords from draw space to image space
				const rw = iw / width;
				const rh = ih / height;
				const finalX = sx * rw;
				const finalY = sy * rh;
				context.translate(x+width/2, y+height/2);
				if (rot) {
					const rotRad = rot * Math.PI/180;
					context.rotate(rotRad);
				}
				context.translate(-x-width/2, -y-height/2);
				context.drawImage(img, finalX, finalY, sw * rw, sh * rh, x, y, width, height);
			} else {
				context.translate(x+width/2, y+height/2);
				if (rot) {
					const rotRad = rot * Math.PI/180;
					context.rotate(rotRad);
				}
				context.translate(-x-width/2, -y-height/2);
				context.drawImage(img, x, y, width, height);
			}

			context.restore();
			
		}
	});
};

Images.propTypes = imagesPropTypes;

const Arc = ({ x, y, radius, startAngle, endAngle, color, fill, sector, closed }) => {
	const withContext = useWithContext();

	return withContext((context) => {
		context.save();
		context.strokeStyle = color;
		context.fillStyle = color;
		context.beginPath();
		if (sector) {
			context.moveTo(x, y);
		}
		context.arc(x, y, radius, startAngle, endAngle);
		if (sector) {
			context.moveTo(x, y);
		}
		if (closed) {
			context.closePath();
		}
		if (!fill) {
			context.stroke();
		} else {
			context.fill();
		}
		context.restore();
	});
}

const Circle = ({ x, y, radius, color, fill }) => {
	return <Arc
		x={x}
		y={y}
		radius={radius}
		startAngle={0}
		endAngle={2 * Math.PI}
		color={color}
		fill={fill}
	/>;
}

const Raw = ({ drawFn }) => {
	const withContext = useWithContext();
	return withContext((context) => {
		context.save();
		drawFn(context);
		context.restore();
	});
}

const Pattern = ({ x, y, width, height, src }) => {
	const { forceRerender } = useContext(CanvasContext);
	const withContext = useWithContext();

	return withContext((context) => {
		const pattern = loadPattern(src, context, forceRerender);
		
		if (!pattern) {
			return null;
		}
		
		context.save();
		context.fillStyle = pattern;
		context.fillRect(x, y, width, height);
		context.restore();
	});
}

function useWithContext() {
	const { context } = useContext(CanvasContext);
	const clipContext = useContext(CanvasClipContext);

	return (cb) => {
		if (!context) {
			return null;
		}
		context.save();
		if (clipContext?.data) {
			const { data } = clipContext;
			context.beginPath();
			context.rect(data.x, data.y, data.width, data.height);
			context.clip();
		}
		const result = cb(context);

		context.restore();

		return result;
	}
}

const Clip = ({ x, y, width, height, children }) => {
	const { context } = useContext(CanvasContext);

	if (!context) {
		return null;
	}

	return <CanvasClipContext.Provider value={{ data: { x, y, width, height }}}>
		{children}
	</CanvasClipContext.Provider>
}

class CanvasComponent extends React.Component {
	static contextType = CanvasContext;

	constructor(props) {
		super(props);
		
		this.bounds = null;
		
		this.handleMove = this.handleMove.bind(this);
		this.handleUp = this.handleUp.bind(this);
		this.handleDown = this.handleDown.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);
		this.handleWheel = this.handleWheel.bind(this);
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
		this.context.registerListener(EventTypes.WHEEL, this.handleWheel);
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
	handleWheel(data) {
		let insideMe = this.insideMe(data.x, data.y);
		
		this.onWheel(data, insideMe);
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
		this.context.unregisterListener(EventTypes.WHEEL, this.handleWheel);
	}
	
	// stubs
	onMouseMove() {}
	onMouseUp() {}
	onMouseDown() {}
	onKeyDown() {}
	onKeyUp() {}
	onWheel() {}
}

CanvasComponent.contextType = CanvasContext;

function renderToCanvas(elements, context = {}, extraContextData = null) {
	let holderDiv = document.createElement("div");
	const canvas = document.createElement("canvas");
	const canvasContext = canvas.getContext("2d");
	const textHolder = document.createElement("div");
	// don't stretch past content
	textHolder.style.display = "inline-block";
	document.body.appendChild(textHolder);

	const value = {
		getImage: loadImage,
		loadPattern: loadPattern,
		registerListener: () => {},
		unregisterListener: () => {},
		forceRerender: () => {},
		triggerRender: () => {},
		// if we got a context from the outside, use that instead of defaults
		...context,
		context: canvasContext,
	};

	const old = canvasContext;

	let useMinX = null;
	let useMaxX = null;
	let useMinY = null;
	let useMaxY = null;

	const checkX = (x) => {
		if (x === null) {
			console.error(x);
		}
		if (useMinX === null) {
			useMinX = x;
		} else {
			useMinX = Math.min(x, useMinX);
		}
		if (useMaxX === null) {
			useMaxX = x;
		} else {
			useMaxX = Math.max(x, useMaxX);
		}
	}

	const checkY = (y) => {
		if (useMinY === null) {
			useMinY = y;
		} else {
			useMinY = Math.min(y, useMinY);
		}
		if (useMaxY === null) {
			useMaxY = y;
		} else {
			useMaxY = Math.max(y, useMaxY);
		}
	}

	value.context = {
		save: () => {},
		restore: () => {},
		beginPath: () => {},
		closePath: () => {},
		fill: () => {},
		stroke: () => {},
		rotate: () => {},
		scale: () => {},

		translate: (...args) => { },
		moveTo: (...args) => {
			checkX(args[0]);
			checkY(args[1]);
		},
		lineTo: (...args) => {
			checkX(args[0]);
			checkY(args[1]);
		},
		drawImage: (...args) => {
			if (args.length === 5) {
				checkX(args[1]);
				checkY(args[2]);
				// x + width
				checkX(args[1] + args[3]);
				// y + height
				checkY(args[2] + args[4]);
			} else {
				throw new Error("renderCanvas drawImage hook got unexpected count of arguments: " + args.length);
			}
		},
		arc: (...args) => {
			// the -1 and +1 is so the line fully shows up
			checkX(args[0] - args[2] - 1);
			checkY(args[1] - args[2] - 1);

			checkX(args[0] + args[2] + 1);
			checkY(args[1] + args[2] + 1);
		},
		fillText: (...args) => {
			const font = value.context.font;
			const [size, family] = font.split(" ");
			textHolder.style['font-size'] = size;
			textHolder.style['font-family'] = family;
			textHolder.innerText = args[0];
			const rect = textHolder.getBoundingClientRect();
			const { width, height } = rect;

			checkX(args[1]);
			checkX(args[1] + width);
			checkY(args[2]);
			checkY(args[2] + height);
		}
	};

	let root = ReactDOMClient.createRoot(holderDiv);
	ReactDOM.flushSync(() => {
		root.render(ReactDOM.createPortal(
			<CanvasContext.Provider value={value}>
				<RenderProvider data={extraContextData}>
					{elements}
				</RenderProvider>
			</CanvasContext.Provider>,
			canvas,
		));
	});

	// calculate real width and height and re-render
	const width = (useMaxX - useMinX);
	const height = (useMaxY - useMinY);
	// the +1 prevents the "image of size zero" issue if there aren't any children
	canvas.width = width + 1;
	canvas.height = height + 1;
	// use the old context since we don't need the hooks anymore
	value.context = old;

	canvasContext.save();
	// if negative, shifts camvas over so the negative is 0,0
	// if positive, does the same
	canvasContext.translate(-useMinX, -useMinY);

	holderDiv = document.createElement("div");
	root = ReactDOMClient.createRoot(holderDiv);
	ReactDOM.flushSync(() => {
		root.render(ReactDOM.createPortal(
			<CanvasContext.Provider value={value}>
				<RenderProvider data={extraContextData}>
					{elements}
				</RenderProvider>
			</CanvasContext.Provider>,
			canvas,
		));
	});
	
	canvasContext.restore();
	
	// cleanup
	textHolder.parentElement.removeChild(textHolder);

	return {
		canvas,
		dims: {
			x: useMinX,
			y: useMinY,
			width,
			height,
		},
	};
}

function renderToImage(elements, context = {}) {
	const { canvas } = renderToCanvas(elements, context);

	const image = canvas.toDataURL("image/png");
	return image;
}

async function blendImage(src, replacements = []) {
    if (replacements.length === 0) {
        // nothing to be done
        return src;
    }
    const img = await loadImagePromise(src);
    
	const canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	const canvasContext = canvas.getContext("2d");
    
	canvasContext.drawImage(img, 0, 0);
    
    const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
    
    const image = [];
    
    for (let i=0;i<imageData.width;i++) {
        for (let j=0;j<imageData.height;j++) {
            const index = i * (imageData.width * 4) + (j * 4);
            const r = imageData.data[index];
            const g = imageData.data[index+1];
            const b = imageData.data[index+2];
            
            image.push({
                red: r,
                green: g,
                blue: b,
            });
        }
    }
    
    // manipulation here
    for (let i=0;i<image.length;i++) {
        const pixel = image[i];
        const red = pixel.red.toString(16).padStart(2, '0');
        const green = pixel.green.toString(16).padStart(2, '0');
        const blue = pixel.blue.toString(16).padStart(2, '0');

        const hexCode = "#" + red + green + blue;
        for (const replacement of replacements) {
            if (replacement.type === BLEND_TYPE.COLOR_SWAP) {
                if (hexCode === replacement.from) {
                    const newRed = replacement.to.substr(1, 2);
                    const newGreen = replacement.to.substr(3, 2);
                    const newBlue = replacement.to.substr(5, 2);
                    
                    const newRedNum = parseInt(newRed, 16);
                    const newGreenNum = parseInt(newGreen, 16);
                    const newBlueNum = parseInt(newBlue, 16);
                    
                    pixel.red = newRedNum;
                    pixel.green = newGreenNum;
                    pixel.blue = newBlueNum;
                    // only run 1 modification on the pixel
                    break;
                }
            }
        }
    }
    
    // writing back

	const canvas2 = document.createElement("canvas");
	canvas2.width = imageData.width;
	canvas2.height = imageData.height;
	const canvasContext2 = canvas2.getContext("2d");
    const newImageData = canvasContext2.createImageData(imageData.width, imageData.height);
    for (let i=0;i<image.length;i++) {
        const index = i * 4;
        const pixel = image[i];
        newImageData.data[index] = pixel.red;
        newImageData.data[index+1] = pixel.green;
        newImageData.data[index+2] = pixel.blue;
        newImageData.data[index+3] = 255;
    }
    
    canvasContext2.putImageData(newImageData, 0, 0);
    
    return canvas2;
}

const BLEND_TYPE = {
    COLOR_SWAP: 'blend_type/color_swap',
};

const compoundPropTypes = {
	xOff: PropTypes.number,
	yOff: PropTypes.number,
};

const compoundDefaultProps = {
	xOff: 0,
	yOff: 0,
};

function getElementsForCompoundElement(children) {
	if (!Array.isArray(children)) {
		return [children];
	}

	const allResults = [];

	for (const child of children) {
		const recursedResult = getElementsForCompoundElement(child);
		for (const result of recursedResult) {
			allResults.push(result);
		}
	}

	return allResults;
}

function CompoundElement({ children, yOff, xOff, extraData }) {
	const canvasContext = useContext(CanvasContext);
	const prevPropsRef = useRef({});
	const renderRef = useRef(null);

	const withContext = useWithContext();

	return withContext((context) => {
		if (!context) {
			return null;
		}

		const checkProps = {
			children,
			extraData: {
				...extraData,
				forceRenderCount: null,
				xOff: null,
				yOff: null,
			},
		};
	
		if (!isEqual(prevPropsRef.current, checkProps)) {
			prevPropsRef.current = checkProps;
			renderRef.current = null;
	
			// re-render our image
			const elements = getElementsForCompoundElement(children);
	
			setTimeout(() => {
				const render = renderToCanvas(elements, {
					...canvasContext,
					forceRerender: () => {
						// we want to know if this happens because it's probably due to an image loading
						// in this case clear the previous props so the next time we render, we rebuild the image
						prevPropsRef.current = {};
						canvasContext.forceRerender();
					},
				}, extraData);
				renderRef.current = render;
				canvasContext.forceRerender();
			}, 1);
		}
	
		if (!renderRef.current) {
			return null;
		}
		return (
			<Image
				src={renderRef.current.canvas}
				width={renderRef.current.dims.width}
				height={renderRef.current.dims.height}
				x={xOff+renderRef.current.dims.x}
				y={yOff+renderRef.current.dims.y}
			/>
		);
	});
}

CompoundElement.propTypes = compoundPropTypes;
CompoundElement.defaultProps = compoundDefaultProps;

export {
	Canvas,
	Text,
	Shape,
	Image,
	CanvasComponent,
	Line,
	Rect,
	Circle,
	Arc,
	Raw,
	CanvasContext,
	Images,
	Pattern,
	Clip,
	renderToImage,
	renderToCanvas,
    blendImage,
    BLEND_TYPE,
	CompoundElement,
	useWithContext,
};