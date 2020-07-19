import React from 'react';
import { Container, Text, Shape } from 'react-canvas';

const Thing = () => {
	const foo = 'bar';
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