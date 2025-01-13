import { useContext, useEffect, useState } from "react";
import { CameraContext } from "./Camera";

export default function Shape3D({ geometry, x, y, z }) {
    const { bindGeometry, bindColors, drawAtPosition } = useContext(CameraContext);
    const [geometryHandle, setGeometryHandle] = useState(null);
    const [colorsHandle, setColorsHandle] = useState(null);
    const [triangleCount, setTriangleCount] = useState(0);

    useEffect(() => {
        // convert geometry from points into array
        const pointsArray = [];
        const colorsArray = [];
        for (let i=0;i<geometry.length;i++) {
            const { points, colors } = geometry[i];
            for (let j=0;j<points.length;j++) {
                const point = points[j];
                const color = colors[j % colors.length];

                pointsArray.push(point.x, point.y, point.z);
                colorsArray.push(color.r, color.g, color.b);
            }
        }
        console.log(pointsArray, colorsArray);
        const pointsAsFloat = new Float32Array(pointsArray);
        const colorsAsFloat = new Uint8Array(colorsArray);
        console.log(pointsAsFloat);
        setGeometryHandle(bindGeometry(pointsAsFloat));
        setColorsHandle(bindColors(colorsAsFloat));
        // we assume 3 points per vertex
        setTriangleCount(pointsArray.length / 9);

    }, []);

    drawAtPosition(geometryHandle, colorsHandle, triangleCount / 2, x, y, z);
}