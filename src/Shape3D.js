import { useContext, useEffect } from "react";
import { CameraContext } from "./Camera";

export default function Shape3D({ geometry, colors, x, y, z }) {
    const { bindGeometry, bindColors, drawAtPosition } = useContext(CameraContext);

    useEffect(() => {
        bindGeometry(geometry);
        bindColors(colors);
    }, []);

    //var numFs = 5;

    //console.log(x, y, z);

    //for (var ii = 0; ii < numFs; ++ii) {
        drawAtPosition(geometry, colors, x, y, z);
    //}
}