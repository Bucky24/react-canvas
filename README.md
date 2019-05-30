## React-Canvas

This module is intended to be a library that allows an HTML5 &lt;canvas&gt; element to exist seamlessly with a React application.

## Installation

With NPM

    npm install --save react-canvas

With Yarn

    yarn install react-canvas

ReactCanvas has a peer dependency on `react` and `prop-types` but should be able to use whatever you have installed for your main project.

## Usage

The module exports a series of components that can be used in JSX.

#### Warning

These modules **must** be inside a Canvas object to work properly, and normal HTML tags cannot be used inside them. So you can't nest ReactCanvas tags, then HTML tags, then more ReactCanvas tags.

#### Canvas

The root level element. This will actually create a &lt;canvas&gt; canvas tag on the page. However, it will also pass the 2D context object into React context of all its children. This allows the children to draw to the canvas object.

#### Parameters

| Parameter    | Description |
| ----------- | ----------- |
| width  | The width, in pixels, of the resulting canvas  |
| height   | The height, in pixels, of the resulting canvas  |

##### Children

Accepts multiple children. Children should be valid ReactCanvas elements.

##### Example

```
return (<div>
	<Canvas
		width={300}
		height={300}
	>
</div>;
```

#### Shape

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

#### Text

Draws text to the screen at the given coordinates.

##### Parameters

| Parameter | Description |
| ----------- | ----------- |
| x  | The origin x coord of the text |
| y   | The origin y coord of the text |

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
</Canvas>
```

#### Image

The Image element takes care of loading and displaying an image asset to the canvas. Currently it only takes in a src, similar to an &lt;img&gt; tag.

##### Parameters

| Parameter | Description |
| ----------- | ----------- |
| x  | The origin x coord to draw the image at |
| y   | The origin y coord to draw the image at |
| src | The URL that the image can be found at |
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

#### Container

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

#### CanvasComponent

The easiest way to hook into canvas events is by having your components extend `CanvasComponent`. `CanvasComponent` is a class that extends `React.Component`, but also wraps the events from the `Canvas` parent, providing helpful React-like lifecycle functions instead.

If `bounds` is set on the child object (containing x, y, width, and height), the second parameter of the callback will be a boolean indicating if the operation took place within those bounds. If no bounds are set, then this boolean is always false.

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

#### Raw Event Handling

It is possible to hook into canvas events for your component by using the `registerListener` and `unregisterListener` functions on the context.

Both `registerListener` and `unregisterListener` take in two parameters: an EventType, and a closure that will be passed a data object when the event is triggered.

It is recommended that your component call `registerListener` only once, and that you call `unregisterListener` when the component is about to unmount, similar to any other listeners in react.

| Event Type | Triggered by | Contents of Data |
| -- | -- | -- |
| EventTypes.MOVE | The mouse moving across the canvas | An object containing x and y of the mouse on the canvas | 
| EventTypes.MOUSE_UP | The mouse being released | An object containing x and y of the mouse on the canvas and a button corresponding to a ButtonType above |
| EventTypes.MOUSE_DOWN| The mouse being pressed | An object containing x and y of the mouse on the canvas and a button corresponding to a ButtonType above |

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
