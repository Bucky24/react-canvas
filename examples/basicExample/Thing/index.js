import React, { useContext } from 'react';
import { CanvasContext, Text, Shape } from 'react-canvas';

const Thing = () => {
	const foo = 'bar';
	const { forceRenderCount } = useContext(CanvasContext);

	console.log(forceRenderCount);
	return (<>
		<Shape
            x={200}
            y={200}
			points={[
				{ x: 10, y: 10},
				{ x: 100, y: 10 },
				{ x: 10, y: 100}
			]}
			color="#f00"
			fill={true}
		/>
		<Text
			x={205}
			y={220}
		>
			Blah {foo}
		</Text>
	</>);
};

export default Thing;