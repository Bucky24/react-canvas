## React-Canvas

This module is intended to be a library that allows an HTML5 &lt;canvas&gt; element to exist seamlessly with a React application, using React-like components to allow drawing onto the canvas using JSX.

## Installation

With NPM

    npm install --save @bucky24/react-canvas

With Yarn

    yarn add @bucky24/react-canvas

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
| captureAllKeyEvents | If this is set to false, any events not originating from the body (which is the default when no input field is selected) will be ignored. If this is set to true (default), all key events will be captured. You should set this to false if you have any dom elements outside of the canvas that need to handle key events.
| enable3d | If true, the canvas is configured as a webgl canvas, with a webgl context. Not all components will work in this mode. Default false. |
| drawWidth | The width, in pixels, that the canvas should use when drawing. Defaults to `width` |
| drawHeight | The height, in pixels, that the canvas should use when drawing. Defaults to `height` |

##### Children

Accepts multiple children. Children should be valid ReactCanvas elements.

##### Example

```
return (<div>
	<Canvas
		width={300}
		height={300}
	>
	    {reactCanvasElements}
	</Canvas>
</div>);
```

### Shape

The Shape element is simple-it draws a shape centered around a given point. Note that there have to be at least 3 entries in the `points` array

##### Parameters

| Parameter    | Description |
| ----------- | ----------- |
| x  | The origin x coord of the shape |
| y   | The origin y coord of the shape  |
| points | An array containing objects with x and y parameters. This will form the body of the shape. Note that all coords in this array are relative to the x and y given as top level params. |
| color | A hex color code, which determines the color of the shape |
| fill | a boolean value, which determines if the shape is drawn as an outline (false) or a filled in shape (true) |
| close | A boolean value (default true) which determines if the shape's path is closed before drawing, or left empty. Closing the path means a line will be drawn from the last point to the first point. |

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

The Image element takes care of loading and displaying an image asset to the canvas.

Images are cached after first load, so re-using the same src will not cause the image to be loaded a second time.

##### Parameters

| Parameter | Description |
| ----------- | ----------- |
| x  | The origin x coord to draw the image at |
| y   | The origin y coord to draw the image at |
| src | The URL that the image can be found at. This can also be base-64 encoded image data |
| width | The width to draw the image at |
| height | The height to draw the image at |
| clip | See Image Clipping below |
| rot | Rotation angle in degrees |
| flipX | Boolean, indicates if the image should be flipped on the X axis |
| flipY | Boolean, indicates if the image should be flipped on the Y axis |
| onLoad | Function that is called when the image loads. If the image is already loaded, the function will not be called (note, using this function can cause optimization issues) |

##### Example

```
<Canvas
	width={300}
	height={300}
>
	<Image
		src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
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

##### Image Clipping

The clip parameter allows drawing of only part of the image. It takes in the following parameters:

| Parameter | Description |
| ----------- | ----------- |
| x  | X coord of where to start the clip |
| y   | Y coord of where to start the clip |
| width | The width of the clip |
| height | The height of the clip |

Note that these parameters are all translated into image space from draw space. So for example, if I had an image that was 50x50, but I was drawing it like this:

```
	<Image
		src={src}
		x={40}
		y={50}
		width={200}
		height={200}
		clip={{
			x: 100,
			y: 100,
			width: 50,
			height: 50,
		}}
	/>
</Canvas>;
```

The x coordinate is 50% of the final width of the image, meaning that when it is translated, it translates into half of the image width, so it becomes 25. This is to avoid the developer needing to know the size of the image before it's loaded (and becomes important because the Image component does not expose the image data). So when using clip, just use the width and height that you're passing into the Image component to make your calculations about how much to clip.

You can also observe the imageExample in the source to see how this is used.

### Images

The Images element draws multiple images to the screen. This can be helpful when you need to draw a lot of images but don't want to have the overhead of a lot of React components. In general this component behaves exactly like the Image component.

##### Parameters

| Parameter | Description |
| ----------- | ----------- |
| images | A list containing objects that conform to the parameters for the Image component |
| onLoad | Function that is called when any images load. If all images are already loaded, the function will not be called. The callback function will be given a single param: the src of the image that was loaded. If the same image is listed multiple times in 'images', the callback will be called multiple times for the same src. Like Image, using this can cause slowness. |

##### Example

```
<Canvas
	width={300}
	height={300}
>
	<Images
		images={[
			{
				src:"https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
				x:40,
				y:50,
				width:50,
				height:50,
			},
		]}
	/>
</Canvas>
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

Draws a semi-circle between two angles with a specific position and radius.

##### Parameters

| Parameter    | Description |
| ----------- | ----------- |
| x | The x position of the arc center |
| y | The y position of the arc center |
| radius | The radius of the arc |
| startAngle | The start angle in radians of the arc |
| endAngle | The eng angle in radians of the arc |
| sector | Boolean, indicates if the drawn shape should be a slice of pie (true) or just the outer part of the circle (false) |
| color | A hex color code, which determines the color of the arc |
| fill | Boolean, indicates if the arc should be filled or an outline |
| closed | Boolean, determines if the arc should close its path (draw a line back to the start) or not |

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
		endAngle={Math.PI}
		color="#f00"
		fill={false}
		sector={false}
	/>
</Canvas>
```

### Raw

Sometimes the basic elements contained in react-canvas aren't enough. For example, if you need to do a very complex shape with semi-circles and lines, currently there's no way to to do that, except creating a custom component with access to the raw canvas context.

That's where the Raw component comes in. It takes in a single prop, which is a callback it will call with the context as the first parameter, allowing you to access any low level functions or complex operations you need to.


##### Parameters

| Parameter    | Description |
| ----------- | ----------- |
| drawFn | A callback that will be called on-render with a single param, which will be the context of the canvas. Note this is not a React context object. but rather an instance of [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) |

##### Example

```
<Canvas
	width={300}
	height={300}
>
	<Raw drawFn={(context) => {
		// do any low level canvas code here
	}} />
</Canvas>
```

### Clip

Clip takes in parameters that define a rectangle, and a list of children. It will use the canvas context clip method to ensure that any part of those children that falls outside the rectangle is not drawn. This is different from the clip in Image, which determines the section of the source image to display.

Clip uses a render method that bypasses React's render system. This is because the children have to finish rendering before Clip finishes rendering. React can sortof do this, but if any OTHER component renders during that time it will also be clipped, which we don't want (and this happens pretty frequently).

At this point, Clip should be able to handle anything a Canvas element can. This includes custom components. Because it uses the same custom rendering method that Canvas does when doing direct rendering, it is not recommended to use class components when using Clip (the direct rendering method does not handle them in a performant way). If you get any errors using Clip, then make a bug report-it's a bit fragile.

##### Children

Takes multiple children, see above for limitations and notes on this.

##### Parameters

| Parameter | Description |
| ----------- | ----------- |
| x | The start x of the clip rect |
| y | The start y of the clip rect |
| width | The width of the clip rect |
| height | The height of the clip rect |

##### Example

```
<Canvas
	width={300}
	height={300}
>
	<Clip
		x={100}
		y={100}
		width={100}
		height={100}
	>
		<Text
			x={150}
			y={130}
		>
			Clipped text
		</Text>
    </Clip>
</Canvas>
```

### Container

The Container element acts as a collector. Older versions of React did not allow returning an array of elements from the `render` function. Because of this, always returning a singular &lt;div&gt; tag was a standard practice. Container takes the place of the div tag for ReactCanvas elements.

For newer versions of React, returning an array or a React Fragment is perfectly acceptable and should work as expected. This component exists for backwards compatability only.

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

### Pattern

The Pattern element allows drawing an image in a repeated pattern in a rectangle.

##### Parameters

| Parameter    | Description |
| ----------- | ----------- |
| x | X position to start the draw at |
| y | Y position to start the draw at |
| width | Width of the rectangle |
| height | Height of the rectangle |
| src | Similar to image, a url, or raw image data to tile |

##### Example

```
<Canvas
	width={300}
	height={300}
>
	<Pattern
        x={100}
        y={100}
        width={200}
        height={200}
        src="https://website.com/path/to/image"
    />
</Canvas>
```

### CompoundElement

The `CompoundElement` is an attempt to improve rendering when there are a lot of objects on the screen. What it does is detect any time its children change. When this happens, it pre-renders its entire child list (using `renderToCanvas`) and then draws that rendered image moving forward. It can be given an x and y offset to move the drawn image around the screen. This component is very useful when you have a lot of objects all moving in the same direction that don't change very often (such as a background layer of a map).

Another note is that currently this does not do any sort of automatic scaling based on content, so make sure whatever width and height you pass encompass all your elements or they will be cut off. In the future, I would like to have this detected automatically, and not even require a width and height.

Lastely, this component is not well named and the name may change in the future.
##### Children

Takes multiple children, must be ReactCanvas elements. I have not tested it with many rendering scenarios but it uses the same rendering system under the hood that `Clip` does, so anything that works with `Clip` should work here.
##### Parameters

| Parameter    | Description |
| ----------- | ----------- |
| xOff | X position to offset the image draw at. Optional (defaults 0) |
| yOff | Y position to offset the image draw at. Optional (defaults 0) |
| width | Width of the rendering area |
| height | Height of the rendering area |

##### Example

```
<Canvas
	width={300}
	height={300}
>
	<CompoundElement}
		width={400}
		height={400}
	>
		{images.map((image) => {
			return <Image src={sampleImage} x={image.x} y={image.y} width={50} height={50} />
		})}
	</CompoundElement>
</Canvas>
```
## Events

### Event List

The following events are available:

| Event | Params |
|---|---|
| onMouseMove | Coords |
| onMouseDown | CoordsWithButton |
| onMouseUp | CoordsWithButton |
| onKeyDown | KeyData |
| onKeyUp | KeyData |
| onWheel | CoordsWithDirection |

#### Coords

Coords is simply an object containing x and y as integers.

#### CoordsWithButton

CoordsWithButton contains x and y coordinates, as well as a `button` field that is one of the following:

| Type |
| -- |
| ButtonTypes.LEFT |
| ButtonTypes.MIDDLE |
| ButtonTypes.RIGHT |

#### KeyData

KeyData is an object containing `char` which is the character of the key pressed, and `code` which is the key code.

#### CoordsWithDirection

CoordsWithDirection contains x and y coordinates, as well as an `up` field, which indicates if the scroll wheel was moved up (true) or down (false)

### Handling on the Canvas

The quickest way to handle canvas events is via event handlers directly on the Canvas object. Any component containing a Canvas can listen for any events it emits via callbacks.

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
				onMove={({ x, y, button }) => {
					console.log("mouse moved to", data.x, data.y);
				}}
				onMouseDown={({ x, y, button }) => {
				
				}}
				onMouseUp={({ x, y, button }) => {
				
				}}
			>
				{ /* some things here */ }
			</Canvas>
		</div>);
	}
};
```
### CanvasComponent

If your components extend `CanvasComponent` (see below sections), you can handle events as native functions inside the component as React lifecycle methods.

If `bounds` is set on the child object (containing x, y, width, and height), the second parameter of the callback for all mouse events will be a boolean indicating if the operation took place within those bounds. If no bounds are set, then this boolean is always false.

Note that if you make a component a CanvasComponent but it is not nested inside a Canvas element, it will throw an error to your console because the child context doesn't exist.

Another thing of note: CanvasComponent consumes `componentDidMount` to do event handling. If you are using `componentDidMount` in your custom component, be sure to call `super.componentDidMount()` or else event handling will not work.

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
	onWheel({ x, y, up }, overMe) {
		// take action
	}
	render() {
		// some rendering here
	}
}

export default MyElement;
```

### Raw Event Handling

It is possible to hook into canvas events for your component by using the `registerListener` and `unregisterListener` functions on the Canvas context.

Both `registerListener` and `unregisterListener` take in two parameters: an EventType, and a closure that will be passed a data object when the event is triggered.

It is recommended that your component call `registerListener` only once, and that you call `unregisterListener` when the component is about to unmount, similar to any other listeners in react.

| Event Type | Triggered by | Contents of Data |
| -- | -- | -- |
| EventTypes.MOVE | The mouse moving across the canvas | An object containing x and y of the mouse on the canvas. May also contain a "touches" key if on a multi-touch device, which contains the x and y of all touches detected | 
| EventTypes.MOUSE_UP | The mouse being released | An object containing x and y of the mouse on the canvas and a button corresponding to a ButtonType above |
| EventTypes.MOUSE_DOWN| The mouse being pressed | An object containing x and y of the mouse on the canvas and a button corresponding to a ButtonType above |
| EventTypes.KEY_DOWN | A key being pressed or repeated | An object containing the char value of the key and the key code |
| EventTypes.KEY_UP | A key being released | An object containing the char value of the key and the key code |
| EventTypes.WHEEL | The scroll wheel being spun | An object containing x and y of the mouse on the canvas, and a boolean "up" which indicates if the wheel is spinning up or down |

## Extending

You can easily create your own elements that have access to the canvas context.

### Context

The following properties are available from the CanvasContext:

| Name | Purpose |
| ---- | --- |
| context | The raw canvas context |
| registerListener | Function for event handling. See above for usage |
| unregisterListener | Function for event handling. See above for usage |
| loadImage | Function that takes in a src and a cb function. If the image is already loaded, it will return the img object. If not, the cb function is called when the image is loaded |
| loadPattern | Function that takes in a src and a cb function. If the pattern is already loaded, it will return the canvas pattern object. If not, the cb function is called when the pattern is loaded |
| forceRenderCount | This is the number of times the forceRerender function has been called. This can be used to determine if a render is taking place because an image has loaded (as image loads call forceRerender by default) |
| width | The width of the Canvas |
| height | The height of the Canvas |
| is3d | Boolean, indicate if the Canvas was configured for webgl |
| forceRerender | Forces the entire canvas to re-render |

##### Example

```
import React, { useContext } from 'react';
import { CanvasContext } from 'react-canvas';

const MyElement = (props) => {
    const { context } = useContext(CanvasContext);
			
    if (!context) {
		return null;
	}
	context.save();

	// do context things here

	context.restore();
}

export default MyElement;

```

##### Rerendering

The canvas context also provides a function `forceRerender` which will essentially call `this.forceUpdate()` on the top level canvas. This can be useful in some situations to force the canvas to redraw.

## Direct Render (Experimental)

In some cases, it's useful to completely bypass React's rendering (which, as described in the Z Index section, is not always great for Canvas). In order to do this, you can use the `customRender` flag on the Canvas object. This is experimental, and does not really work very well with Class components, but may be necessary for other experimental features.

```
	return <Canvas
		width={300}
		height={300}
		customRender={true}
	>
		{ children }
	</Canvas>;
```

## Z Index (Experimental)

Sometimes you can run into the situation where some parts of your canvas will redraw and others will not. For example, let's say you're drawing a map, but drawing parts of the UI on top of it. If you have the map in a specific CanvasComponent and UI pieces in other components, when your map redraws, you may find that your UI components do not. This is because React is trying to ease the load on the browser by only updating dom elements that have changed. While this works really well for a dom, where making sure dom elements are rerendered properly is taken care of by the browser, we're dealing with a canvas, where this is not the case.

In order to potentially fix this, you can use z-indexing on your components. What this will do is detect when a component has re-rendered, and at that point, force render every component with a higher z-index.

This feature bypasses React rendering and as such is experimental and may not work as expected. Use at your own risk. Also the feature only pays attention to z-index on the element that caused the redraw and the direct children of the Canvas. So if you have a grandchild that is z-index 5, the child on the Canvas is z-index 2, and the element that triggered the redraw is z-index 4, then that grandchild will not be redrawn.

To use, you must make two changes. First, add a z-index to the components to indicate which ones should be redrawn, as well as set the `enableExperimental` flag on the Canvas object.

```
	return <Canvas
		width={300}
		height={300}
		enableExperimental={true}
	>
		<Text
			x={5}
			y={60}
			zIndex={3}
		>
			Blah
		</Text>
		<Shape
			zIndex={2}
			points={[
				{ x: 10, y: 10},
				{ x: 100, y: 10 },
				{ x: 10, y: 100}
			]}
			color="#f00"
			fill={true}
		/>
	</Canvas>;
```

The following example sets up the Text to be redrawn whenever something with a z-index of less than 3 is redrawn, and the Shape to be redrawn whenever something with a z-index of less than 2 is redrawn. Note that the default z-index is 1

The second thing you must do is indicate which components should trigger a redraw. This can be done on CanvasComponents by calling `super.render()` inside the render function, and also by calling `triggerRedraw` on the CanvasContext object, if you have one.

See the `overlapExample` in the examples directory for more information on how to make this work.

## Double Buffering (Experimental)

Double Buffering is the process of rendering to an off-screen canvas, then drawing that canvas as an image onto the main screen.

To use double buffering, pass the `doubleBuffer` flag to the Canvas object.

Note: Direct Rendering must be enabled for double buffering to have any effect.

## renderToImage (Experimental)

React Canvas exports a method, `renderToImage`, that can take in a series of React Canvas components, and a width and height, then return a data string that represents the image from that canvas.

This bypasses React rendering, so it may not work as expected for some situations.

However, because of this, `renderToImage` does not need to be called from inside a component's render method.

`context` is not a required parameter, but it is recommended to pass in the context of the parent Cavas if possible. If you are trying to get the context from a top level component that exports the Canvas element, you can use a ref to the Canvas and call `getMyContext` to get the context object.

```
import React from 'react';
import {
    Line,
    renderToImage,
} from 'react-canvas';

const App() {
    const width = 300;
    const height = 100;

	const components = <>
		<Line
			x={10}
			y={10}
			x2={100}
			y2={10}
			color="#888"
		/>
		<Line
			x={10}
			y={10}
			x2={10}
			y2={100}
			color="#888"
		/>
	</>;

	const imageSource = renderToImage(components, width, height);

	return (<div>
		<img src={imageSource}>
	</div>);
};

export default App;
```

## renderToCanvas (Experimental)

React Canvas exports a method, `renderToCanvas`, that does basically the same thing as `renderToImage` (and takes the same parameters), but instead of a base-64 data string, returns a canvas dom element that has had the given elements rendered to it. This is useful if you have images that are loaded from outside of your domain, as the browser will not allow these to be rendered to an image, but it will allow them to be rendered to a canvas.

This canvas can be passed into the `src` attribute of an Image element to render it.

Like the above method, this bypasses React rendering, so it may not work as expected for some situations.

## blendImage

The `blendImage` function allows an existing image to be manipulated on the fly, generating a new image (as a Canvas) that can be drawn.

### Parameters

| Name | Description
| -- | -- |
| src | The source (url or base64 string) to blend |
| operations | An array of BlendOperations. If empty, the original src is returned |

### Usage

```
blendImage(sampleImage, [
    {
        type: BLEND_TYPE.COLOR_SWAP,
        from: '#ffffff',
        to: '#0000ff',
    },
    {
        type: BLEND_TYPE.COLOR_SWAP,
        from: '#000000',
        to: '#00ff00',
    },
]).then((newImg) => {
    // newImg is a Canvas containing the rendered image, and can now be stored for drawing.
});
```

### BlendOperation

Represents an operation that can be performed on an image

| Name | Type | Description
| -- | -- | -- |
| type | BLEND_TYPE | Describes what operation to perform |
| * | * | Other params determined by BLEND_TYPE, see below |

### BLEND_TYPE

#### COLOR_SWAP

`BLEND_TYPE.COLOR_SWAP` allows swapping one color in an image completely for another color. It expects the following parameers on the `BlendOperation`:

| Name | Type | Description
| -- | -- | -- |
| from | Hex Color | A string containing the RGB hex code to look for |
| to | Hex Color | A stirng containing the RGB hex code to use as a replacement