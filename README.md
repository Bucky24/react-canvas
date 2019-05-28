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

## Extending

You can easily create your own elements that have access to the canvas context.

##### Example

```
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
