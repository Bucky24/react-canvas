import React from 'react';
import { Container, Text, Shape, CanvasComponent } from 'react-canvas';

class Thing2 extends CanvasComponent {
    render() {
        const { x, y } = this.props;

        return (<Container>
            <Shape
                x={0}
                y={0}
                points={[
                    { x: 10 + x, y: 10 + y},
                    { x: 100 + x, y: 10 + y },
                    { x: 10 + x, y: 100 + y }
                ]}
                color="#f00"
                fill={true}
            />
            <Text
                x={5 + x}
                y={20 + y}
            >
                Blah blah
            </Text>
        </Container>);
    }
};

export default Thing2;