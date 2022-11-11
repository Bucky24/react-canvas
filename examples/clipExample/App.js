import React from 'react';
import {
    Canvas,
	Text,
    Line,
    Clip,
    Rect,
    Image,
} from 'react-canvas';
import Elem from './Elem';

const App = ({}) => {
    const lines = [
        <Line
            x={150}
            y={170}
            x2={150}
            y2={300}
            color="#f00"
            key="line1"
        />
    ]
	return (<div>
		<Canvas
			width={400}
			height={300}
		>
            <Rect
                x={100}
                y={100}
                x2={200}
                y2={200}
            />
            <Clip
                x={100}
                y={100}
                width={100}
                height={100}
            >
                { lines }
                <>
                    <Text
                        x={150}
                        y={130}
                    >
                        Clipped text
                    </Text>
                    <>
                        <Line
                            x={150}
                            y={170}
                            x2={300}
                            y2={170}
                            color="#f00"
                        />
                    </>
                    {false && <Text
                        x={200}
                        y={200}
                    >
                        Other text
                    </Text>}
                </>
                <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Right-pointing_white_arrow_in_blue_rounded_square.svg/1024px-Right-pointing_white_arrow_in_blue_rounded_square.svg.png"
                    x={90}
                    y={110}
                    width={30}
                    height={30}
                />
				<Elem x={75} y={160} />
            </Clip>
            <Line
                x={150}
                y={150}
                x2={300}
                y2={150}
                color="#f00"
            />
            <Text
                x={70}
                y={150}
            >
                Non clipped text
            </Text>
		</Canvas>
	</div>);
};

export default App;