import React from 'react';
import {
	Canvas,
    Line,
    renderToImage,
    renderToCanvas,
    Image
} from 'react-canvas';

import styles from '../styles.css';
import { Rect } from '../../src';

import SampleImage from "./sampleImage.png";

// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            canvas: null,
            x: [10, 10, 10, 10, 10, 10, 10],
        };
    }
    componentDidMount() {
        this.interval = setInterval(() => {
            const newX = this.state.x.map((x) => {
                let newX = x + getRandomInt(1, 20);
                if (newX > 200) {
                    newX = 0;
                }

                return newX;
            });

            this.setState({
                x: newX,
            });
        }, 200);
    }
    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
    render() {
        const width = 300;
        const height = 200;

        const components = <>
            <Rect
                x={0}
                y={0}
                x2={width}
                y2={height}
                color="#fff"
                fill={true}
            />
            { this.state.x.map((x, index) => {
                return <Line
                    key={index}
                    x={x}
                    y={10*index+10}
                    x2={x+100}
                    y2={10*index+10}
                    color="#888"
                />
            })}
            <Image
                src={SampleImage}
                x={10}
                y={100}
                width={50}
                height={50}
            />
        </>;

        return (<div className={styles.appRoot}>
            Canvas:<br/>
            <div style={{display: 'flex'}}>
                <Canvas
                    width={width}
                    height={height}
                    customRender={true}
                    doubleBuffer={true}
                    ref={(c) => {
                        this.canvas = c;
                    }}
                >
                    { components }
                </Canvas>
                <Canvas
                    width={width}
                    height={height}
                >
                    {this.state.canvas && <Image
                        src={this.state.canvas}
                        x={width/4}
                        y={width/4}
                        width={width/2}
                        height={height/2}
                    />}
                </Canvas>
            </div>
            <br/>
            <input type="button" value="Capture Image" onClick={() => {
                const newImage = renderToImage(components, width, height, this.canvas.getMyContext());
                const newCanvas = renderToCanvas(components, width, height, this.canvas.getMyContext());

                this.setState({
                    image: newImage,
                    canvas: newCanvas,
                });
            }}/><br/>
            Image:<br/>
            <img src={this.state.image}/>
        </div>);
    }
};

export default App;