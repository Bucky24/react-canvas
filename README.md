## React-Canvas

This module is intended to be a library that allows an HTML5 &lt;canvas&gt; element to exist seamlessly with a React application, using React-like components to allow drawing onto the canvas using JSX.

## Installation

With NPM

    npm install --save react-canvas

With Yarn

    yarn install react-canvas

ReactCanvas has a peer dependency on `react` and `prop-types` but should be able to use whatever you have installed for your main project. It does require the use of the child context apis, so React 16 is recommended at minimum.

## Usage

The module exports a series of components that can be used in JSX. To use, declare a canvas of specific width and height inside your React app, then use the same nesting syntax as the rest of React to draw various elements. The components register and behave (with some exceptions) as normal React components, so most standard behaviors with components should work for them.

#### Warning

These modules **must** be inside a Canvas object to work properly, and normal HTML tags cannot be used inside them. So you can't nest ReactCanvas tags, then HTML tags, then more ReactCanvas tags.

## Available Elements

### Canvas

The root level element. This will actually create a &lt;canvas&gt; canvas tag on the page. However, it will also pass the 2D context object into React context of all its children. This allows the children to draw to the canvas object.

#### Parameters

| Parameter    | Description |
| ----------- | ----------- |
| width  | The width, in pixels, of the resulting canvas  |
| height   | The height, in pixels, of the resulting canvas  |
| captureAllKeyEvents | If this is set to false, any events not originating from the body (which is the default when no input field is selected) will be ignored. If this is set to true or not given, all key events will be captured. You should set this to true if you have any dom elements outside of the canvas that need to handle key events.

##### Children

Accepts multiple children. Children should be valid ReactCanvas elements.

##### Example

```
return (<div>
	<Canvas
		width={300}
		height={300}
	>
	
	</Canvas>
</div>;
```

### Shape

The Shape element is simple-it draws a shape centered around a given point. Note that there have to be at least 3 entries in the `points` array

##### Parameters

| Parameter    | Description |
| ----------- | ----------- |
| x  | The origin x coord of the shape |
| y   | The origin y coord of the shape  |
| points | An array containing objects with x and y parameters. This will form the body of the shape. |
| color | A hex color code, which determines the color of the shape |
| fill | a boolean value, which determines if the shape is drawn as an outline (false) or a filled in shape (true) |

##### Example

```
<Canvas
	width={300}
	height={300}
>
	<Shape
		x={40}
		y={0}
		points={[
			{ x: 10, y: 10},
			{ x: 100, y: 10 },
			{ x: 10, y: 100}
		]}
		color="#f00"
		fill={true}
	/>
</Canvas>
```

### Text

Draws text to the screen at the given coordinates.

##### Parameters

| Parameter | Description |
| ----------- | ----------- |
| x  | The origin x coord of the text |
| y   | The origin y coord of the text |
| color | the color for the text (default black) |
| font | the font for the text (default 12px Arial) |

##### Children

Accepts a single child, which is the text to be displayed

##### Example

```
<Canvas
	width={300}
	height={300}
>
	<Text
		x={5}
		y={60}
	>
		Some text here
	</Text>
	<Text
		x={5}
		y={80}
		color="#00f"
		font="18px Times New Roman"
	>
		Blue Text
	</Text>
</Canvas>
```

### Image

The Image element takes care of loading and displaying an image asset to the canvas. Currently it only takes in a src, similar to an &lt;img&gt; tag.

Images are cached after first load, so re-using the same src will not cause the image to be loaded from the server again.

##### Parameters

| Parameter | Description |
| ----------- | ----------- |
| x  | The origin x coord to draw the image at |
| y   | The origin y coord to draw the image at |
| src | The URL that the image can be found at. This can also be base-64 encoded image data |
| width | The width to draw the image at |
| height | The height to draw the image at |

##### Example

```
<Canvas
	width={300}
	height={300}
>
	<Image
		src="http://solumcraft.com/favicon.ico"
		x={40}
		y={50}
		width={50}
		height={50}
	/>
</Canvas>
```

##### Base64 Encoded Example

```
const imageData = "data:image/png;base64,<some base 64 encoded data here>";
return <Canvas
	width={300}
	height={300}
>
	<Image
		src={imageData}
		x={40}
		y={50}
		width={50}
		height={50}
	/>
</Canvas>;
```

### Line

The Line element draws a line of a specific color between two given points.

##### Parameters

| Parameter    | Description |
| ----------- | ----------- |
| x | The origin x coord of the line |
| y | The origin y coord of the line  |
| x2 | The destination x coord of the line |
| y2 | The destination y coord of the line  |
| color | A hex color code, which determines the color of the line |

##### Example

```
<Canvas
	width={300}
	height={300}
>
	<Line
		x={40}
		y={0}
		x2={100}
		y2={150}
		color="#f00"
	/>
</Canvas>
```

### Rect

The Rect element is just a wrapper around Shape that returns a rectangle drawn between two points.

##### Parameters

| Parameter    | Description |
| ----------- | ----------- |
| x | The first x coord of the rectangle |
| y | The second y coord of the rectangle |
| x2 | The second x coord of the rectangle |
| y2 | The second y coord of the rectangle |
| color | A hex color code, which determines the color of the rectangle |
| fill | Boolean, indicates if the rectangle should be filled or an outline |

##### Example

```
<Canvas
	width={300}
	height={300}
>
	<Rect
		x={40}
		y={0}
		x2={100}
		y2={150}
		color="#f00"
		fill={false}
	/>
</Canvas>
```

### Circle

Draws a circle with a specific position and radius.

##### Parameters

| Parameter    | Description |
| ----------- | ----------- |
| x | The x position of the circle center |
| y | The y position of the circle center |
| radius | The radius of the circle |
| color | A hex color code, which determines the color of the circle |
| fill | Boolean, indicates if the circle should be filled or an outline |

##### Example

```
<Canvas
	width={300}
	height={300}
>
	<Circle
		x={40}
		y={0}
		radius={10}
		color="#f00"
		fill={false}
	/>
</Canvas>
```

### Arc

Draws a semi-circle between to angles with a specific position and radius.

##### Parameters

| Parameter    | Description |
| ----------- | ----------- |
| x | The x position of the arc center |
| y | The y position of the arc center |
| radius | The radius of the arc |
| startAngle | The start angle in radians of the arc |
| endAngle | The eng angle in radians of the arc
| color | A hex color code, which determines the color of the arc |
| fill | Boolean, indicates if the arc should be filled or an outline |

##### Example

```
<Canvas
	width={300}
	height={300}
>
	<Arc
		x={40}
		y={0}
		radius={10}
		startAngle={0}
		endAngl={Math.PI}
		color="#f00"
		fill={false}
	/>
</Canvas>
```

### Container

The Container element acts as a collector. Some versions of React did not allow returning an array of elements from the `render` function. Because of this, always returning a singular &lt;div&gt; tag was a standard practice. Container takes the place of the div tag for ReactCanvas elements.

##### Children

Takes multiple children, must be ReactCanvas elements.

##### Example

```
	return <Container>
		<Text
			x={5}
			y={60}
		>
			Blah
		</Text>
		<Shape
			points={[
				{ x: 10, y: 10},
				{ x: 100, y: 10 },
				{ x: 10, y: 100}
			]}
			color="#f00"
			fill={true}
		/>
	</Container>;
```

## Events

### CanvasComponent

The easiest way to hook into canvas events is by having your components extend `CanvasComponent`. `CanvasComponent` is a class that extends `React.Component`, but also wraps the events from the `Canvas` parent, providing helpful React-like lifecycle functions instead.

If `bounds` is set on the child object (containing x, y, width, and height), the second parameter of the callback will be a boolean indicating if the operation took place within those bounds. If no bounds are set, then this boolean is always false.

Note that if you make a component a CanvasComponent but it is not nested inside a Canvas element, it will throw an error to your console because the child context doesn't exist.

##### Example

```
import React from 'react';
import { CanvasComponent } from 'react-canvas';

class MyElement extends CanvasComponent {
	constructor(props) {
		super(props);
		
		this.bounds = {
			x: 100,
			y: 100,
			width: 20,
			height: 20
		};
	}
	onMouseMove({ x, y }, overMe) {
		// take some action
	}
	onMouseDown({ x, y, button }, overMe) {
		// take some action
	}
	onMouseUp({ x, y, button }, overMe) {
		// take some action
	}
	onKeyDown({ char, code }) {
		// do something
	}
	onKeyUp({ char, code }) {
		// do something
	}
	render() {
		// some rendering here
	}
}

export default MyElement;
```

Note in the above example, the button will be an instance of the ButtonTypes, shown below

| Type |
| -- |
| ButtonTypes.LEFT |
| ButtonTypes.MIDDLE |
| ButtonTypes.RIGHT |

### Raw Event Handling

It is possible to hook into canvas events for your component by using the `registerListener` and `unregisterListener` functions on the context.

Both `registerListener` and `unregisterListener` take in two parameters: an EventType, and a closure that will be passed a data object when the event is triggered.

It is recommended that your component call `registerListener` only once, and that you call `unregisterListener` when the component is about to unmount, similar to any other listeners in react.

| Event Type | Triggered by | Contents of Data |
| -- | -- | -- |
| EventTypes.MOVE | The mouse moving across the canvas | An object containing x and y of the mouse on the canvas | 
| EventTypes.MOUSE_UP | The mouse being released | An object containing x and y of the mouse on the canvas and a button corresponding to a ButtonType above |
| EventTypes.MOUSE_DOWN| The mouse being pressed | An object containing x and y of the mouse on the canvas and a button corresponding to a ButtonType above |
| EventTypes.KEY_DOWN | A key being pressed or repeated | An object containing the char value of the key and the key code |
| EventTypes.KEY_UP | A key being released | An object containing the char value of the key and the key code |

### Handling on the Canvas

Any component containing a Canvas object can listen for any events it emits via callbacks. The callbacks are given the same data as examples above.

```
class MyComponent extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (<div className={styles.appRoot}>
			<Canvas
				width={300}
				height={300}
				onMove={(data) => {
					console.log("mouse moved to", data.x, data.y);
				}}
				onMouseDown={() => {
				
				}}
				onMouseUp={() => {
				
				}}
			>
				{ /* some things here */ }
			</Canvas>
		</div>);
	}
};
```

## Extending

You can easily create your own elements that have access to the canvas context.

##### Example

```
import React from 'react';
import { Canvas } from 'react-canvas';

const MyElement = (props, { context }) => {
	if (!context) {
		return null;
	}
	context.save();
	
	// take some actions with the context
	
	context.restore();
	return null;
}

MyElement.contextTypes = Canvas.childContextTypes;

export default MyElement;
```

##### Rerendering

The canvas context also provides a function `forceRerender` which will essentially call `this.forceUpdate()` on the top level canvas. This can be useful in some situations to force the canvas to redraw.