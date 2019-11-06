import React from 'react';
import { Container, Text, Shape } from 'react-canvas';

const Thing = () => {
	const foo = 'bar';
	return (<Container>
		<Text
			x={5}
			y={20}
		>
			Blah {foo}
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
	</Container>);
};

export default Thing;