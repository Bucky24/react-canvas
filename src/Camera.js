import { useContext } from "react";
import { CanvasContext } from "./main";
import { m4 } from "twgl.js";

export default function Camera() {
    const { context } = useContext(CanvasContext);

    if (!context) {
        return;
    }

    // https://webglfundamentals.org/webgl/lessons/webgl-3d-camera.html
    var aspect = context.canvas.clientWidth / context.canvas.clientHeight;
    var zNear = 1;
    var zFar = 2000;
    var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);
}