import React from 'react';
import PropTypes from 'prop-types';

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
	[EventTypes.MOVE]: 'onMove',
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
});

const canvasProps = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	captureAllKeyEvents: PropTypes.bool
}

const canvasDefaultProps = {
	captureAllKeyEvents: true
}

const loadingMap = {};
const imageMap = {};

function loadImage(src, cb) {
	if (imageMap[src]) {
		return imageMap[src];
	}
	
    if (loadingMap[src]) {
		// if we've already registered this function, don't register it again
  		if (loadingMap[src].includes(cb)) {
  			return null;
  	  	}
  	  	loadingMap[src].push(cb);
  	  	return null;
    }
	
	// else load it
	const body = document.getElementsByTagName("body")[0];

	const img = document.createElement("img");
	img.src = src;
	img.onload = () => {
		imageMap[src] = img;
		if (src in loadingMap) {
			loadingMap[src].forEach((cb) => {
				cb(img);
			});
		}
		delete loadingMap[src];
	};
	if (img.loaded) {
		imageMap[src] = img;
		return img;
	} else {
		if (!(src in loadingMap)) {
			loadingMap[src] = []
		}
		loadingMap[src].push(cb);
	}
	img.style.display = 'none';
	body.append(img);
	
	return null;
}

const patternMap = {};
const patternLoadingMap = {};

function loadPattern(src, context, cb) {
	const hash = hashString(src);
	if (patternMap[hash]) {
		return patternMap[hash];
	}
	
	if (!patternLoadingMap[hash]) {
		patternLoadingMap[hash] = [];
	}
	
	if (patternLoadingMap[hash].includes(cb)) {
		return null;
	}
	
	patternLoadingMap[hash].push(cb);

	loadImage(src, (img) => {
		const pattern = context.createPattern(img, 'repeat');
		patternMap[hash] = pattern;
		patternLoadingMap[hash].forEach((cb) => {
			cb(img);
		});
	});
	
	return null;
}

function isClass(func) {
	if (typeof func !== 'function') {
		return false;
	}
	const funcStr = Function.prototype.toString.call(func);
	// not sure if this is best, but classes seem to have this
	return funcStr.includes("_classCallCheck");
}

const doRender = (element,  context) => {
	if (!element) {
		return;
	}
	let children = [];
	if (Array.isArray(element)) {
		children = element;
	} else if (element.type.length === 1) {
		children = element.type(element.props);
	} else if (element.type._context) {
		// in this case the only child is the function to call with context
		children = element.props.children(context);
	} else if (isClass(element.type)) {
		// we've got a class component
		// this is kinda awful for a variety of reasons
		// and I imagine will cause a lot of bugs.
		const inst = new element.type(element.props);
		children = inst.render();
	} else if (element.type instanceof Function) {
		children = element.type(element.props);
	} else if (typeof element.type === "symbol") {
		// this is the react <> thing
		children = element.props.children;
	} else {
		console.log(element.type.valueOf(), element.type.valueOf() == "react.fragment")
		console.error("No idea how to handle", element);
		return;	
	}

	if (!Array.isArray(children)) {
		children = [children];
	}
	
	children.forEach((child) => {
		if (!child) {
			return;
		}
		doRender(child, context);
	});
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
		this.triggerRender = this.triggerRender.bind(this);
		
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
	forceRerender() {
		this.forceUpdate();
	}
	getMyContext() {
	    return {
			context: this.state.context,
			registerListener: this.registerListener,
			unregisterListener: this.unregisterListener,
			forceRerender: this.forceRerender,
			triggerRender: this.triggerRender,
			getImage: loadImage,
			loadPattern: loadPattern,
		};
	}
	componentDidUpdate() {
		this.processChanges();
	}
	componentDidMount() {
		this.processChanges();
	}
	processChanges() {
		if (this.props.width !== this.canvas.width) {
			this.canvas.width = this.props.width;
			if (this.secondCanvas) {
				this.secondCanvas.width = this.props.width;
			}
		}
		if (this.props.height !== this.canvas.height) {
			this.canvas.height = this.props.height;
			if (this.secondCanvas) {
				this.secondCanvas.height = this.props.height;
			}
		}

		if (this.props.doubleBuffer && !this.secondCanvas) {
			this.secondCanvas = document.createElement("canvas");
		} else if (!this.props.doubleBuffer) {
			// should auto-delete the canvas element because of
			// garbage collector
			this.secondCanvas = null;
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
	triggerRender(component) {
		if (!component || !component.props || component.props.zIndex === undefined) {
			return;
		}
		const zIndex = component.props.zIndex;
		
		for (let i=zIndex+1;i<this.indexList.length;i++) {
			const list = this.indexList[i];
			if (!list) {
				// this can happen if we have a gap in the zindex
				continue;
			}
			this.handleRender(list);
		}
	}
	handleRender(elements, reRender=true) {
		const context = this.getMyContext();
		const primaryContext = context.context;
		if (this.props.doubleBuffer) {
			context.context = this.secondCanvas.getContext("2d");
		}

		if (reRender) {
			elements.forEach((element) => {
				doRender(element, context);
			});
		}

		if (this.props.doubleBuffer) {
			primaryContext.save();
			primaryContext.fillStyle = "#fff";
			primaryContext.beginPath();
			primaryContext.rect(0, 0, this.canvas.width, this.canvas.height);
			primaryContext.fill();
			primaryContext.restore();
			primaryContext.drawImage(
				this.secondCanvas,
				0,
				0,
			);
		}
	}
	render() {
		this.indexList = [];
		
		let newChildren = this.props.children;

		if (this.props.enableExperimental) {
			const handleChild = (child) => {
	       	 	if (!child || typeof child !== "object" || Array.isArray(child)) {
					return child;
				}
				const props = child.props || {};
				const workingIndex = props.zIndex === undefined ? 1 : props.zIndex;
				const newProps = {
					...props,
					zIndex: workingIndex,
				};
				if (!this.indexList[workingIndex]) {
					this.indexList[workingIndex] = [];
				}
				this.indexList[workingIndex].push(child);
				return React.cloneElement(child, newProps);
			}
		
			newChildren = this.props.children.map((child) => {
				if (Array.isArray(child)) {
					return child.map((innerChild) => {
						return handleChild(innerChild);
					});
				}
			
				return handleChild(child);
			});
		}

		if (!Array.isArray(newChildren)) {
			newChildren = [newChildren];
		}

		const finishRender = () => {
			if (this.props.customRender) {
				this.handleRender(newChildren);
			}
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
						finishRender();
					});
				} else {
					finishRender();
				}
			}
		}

		this.lastChildren = newChildren;

		if (this.props.customRender) {
			return <canvas
				ref={refFunc}
			/>
		}

		return <CanvasContext.Provider value={this.getMyContext()}>		
			<canvas
				ref={refFunc}
			>
				{newChildren}
			</canvas>
		</CanvasContext.Provider>;
	}
};

Canvas.propTypes = canvasProps;
Canvas.defaultProps = canvasDefaultProps;

const Container = ({ children }) => {
	if (Array.isArray(children)) {
		return [...children];
	} else {
		return children;
	}
}

const Text = ({ children, x, y, color, font }) => {
	return <CanvasContext.Consumer>
		{({ context }) => {
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
			if (!Array.isArray(children)) {
				children = [children];
			}
			context.fillText(children.join(''), x, y);
			context.restore();
		}}
	</CanvasContext.Consumer>;
}

const Line = ({ x, y, x2, y2, color }) => {
	return <CanvasContext.Consumer>
		{({ context }) => {
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
		}}
	</CanvasContext.Consumer>;
}

const Shape = ({ x, y, points, color, fill, close }) => {
	if (close === undefined) {
		close = true;
	}
	return <CanvasContext.Consumer>
		{({ context }) => {
			if (!context) {
				return null;
			}

			drawShape(x, y, context, points, color, fill, close);
		}}
	</CanvasContext.Consumer>;
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
	src: PropTypes.string.isRequired,
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
}

const Image = ({ src, x, y, width, height, clip, rot }) => {
	return <CanvasContext.Consumer>
		{({ context, forceRerender, getImage }) => {
			if (!context) {
				return null;
			}
			
			const img = getImage(src, forceRerender);
			
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
			
			return null;
		}}
	</CanvasContext.Consumer>
};

Image.propTypes = imagePropTypes;

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
}

const Images = ({ images }) => {
	return <CanvasContext.Consumer>
		{({ context, forceRerender, getImage }) => {
			if (!context) {
				return null;
			}
			
			for (const image of images) {
				const { src, x, y, width, height, clip, rot } = image;
				
				const img = getImage(src, forceRerender);

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

			return null;
		}}
	</CanvasContext.Consumer>
};

Images.propTypes = imagesPropTypes;

const Arc = ({ x, y, radius, startAngle, endAngle, color, fill, sector, closed }) => {
	return <CanvasContext.Consumer>
		{({ context }) => {
			if (!context) {
				return null;
			}

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
		}}
	</CanvasContext.Consumer>;
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
	return <CanvasContext.Consumer>
		{({ context }) => {
			if (!context) {
				return null;
			}

			context.save();
			drawFn(context);
			context.restore();
		}}
	</CanvasContext.Consumer>;
}

const Pattern = ({ x, y, width, height, src }) => {
	return <CanvasContext.Consumer>
		{({ context, forceRerender }) => {
			if (!context) {
				return null;
			}
			
			const pattern = loadPattern(src, context, forceRerender);
			
			if (!pattern) {
				return null;
			}
			
			context.save();
			context.fillStyle = pattern;
			context.fillRect(x, y, width, height);
			context.restore();
		}}
	</CanvasContext.Consumer>;
}

const Clip = ({ x, y, width, height, children }) =>{
	return <CanvasContext.Consumer>
		{(canvasContext) => {
			const { context } = canvasContext;
			if (!context) {
				return null;
			}
			
			context.save();
			context.beginPath();
			context.rect(x, y, width, height);
			context.clip();

			const childList = [];
			if (!Array.isArray(children)) {
				childList.push(children);
			} else {
				children.forEach((child) => {
					if (Array.isArray(child)) {
						child.forEach((subChild) => {
							childList.push(subChild);
						})
					} else {
						childList.push(child);
					}
				})
			}

			for (const child of childList) {
				const { type, props } = child;
				const result = type(props);
				if (result.type._context) {
					if (!result.props.children || !(result.props.children instanceof Function)) {
						throw new Exception("Child of Clip did not return a CanvasContext.consumer as expected. Clip can currently only handle bottom level React Canvas components");
					}
					result.props.children(canvasContext);
				} else {
					throw new Exception("Child of Clip did not return a CanvasContext.consumer as expected. Clip can currently only handle bottom level React Canvas components");
				}
			}

			context.restore();
			return null;
		}}
	</CanvasContext.Consumer>;
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
	
	render() {
		if (this.context.triggerRender) {
			setTimeout(() => {
				this.context.triggerRender(this);
			},0);
		}
	}
}

CanvasComponent.contextType = CanvasContext;

function renderToImage(elements, width=300, height=300) {
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const context = canvas.getContext("2d");

	let resolvedElements = elements;
	if (!Array.isArray(resolvedElements)) {
		resolvedElements = [resolvedElements];
	}

	for (const element of resolvedElements) {
		doRender(element, {
			context,
			getImage: loadImage,
			loadPattern: loadPattern,
			registerListener: () => {},
			unregisterListener: () => {},
			forceRerender: () => {},
			triggerRender: () => {},
		});
	}

	const image = canvas.toDataURL("image/png");
	return image;
}

export {
	Canvas,
	Container,
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
};