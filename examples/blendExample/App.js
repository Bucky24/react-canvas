import React, { useEffect, useState } from 'react';
import { Canvas, blendImage, Image, BLEND_TYPE } from 'react-canvas';

import sampleImage from './sampleImage.png';

const App = ({}) => {
	const [image, setImage] = useState(null);

	useEffect(() => {
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
		    setImage(newImg);
		});
	}, []);

	return (<div>
		<Canvas
			width={600}
			height={400}
		>
			<Image
				src={sampleImage}
				x={0}
				y={100}
				width={200}
				height={200}
            />
			{image && <Image
				src={image}
				x={200}
				y={100}
				width={200}
				height={200}
            />}
		</Canvas>
	</div>);
};

export default App;