import React, { useContext, createContext, useEffect, useState} from "react";
import { CanvasContext } from "./main";
import { createProgramFromSources, resizeCanvasToDisplaySize, m4, v3 } from "twgl.js";
import { degToRad, vectorMultiply } from "./utils";

export const CameraContext = createContext({});

export default function Camera({ children }) {
    const { context } = useContext(CanvasContext);
    const [colorLocation, setColorLocation] = useState(null);
    const [positionLocation, setPositionLocation] = useState(null);
    const [matrixLocation, setMatrixLocation] = useState(null);
    const [viewProjectionMatrix, setViewProjectionMatrix] = useState(null);
    const [setup, setSetup] = useState(false);

    useEffect(() => {
        if (!context) {
            return;
        }

        // taken heavily from https://webglfundamentals.org/webgl/lessons/webgl-3d-camera.html

        const vertexShader = `attribute vec4 a_position;
        attribute vec4 a_color;

        uniform mat4 u_matrix;

        varying vec4 v_color;

        void main() {
            // Multiply the position by the matrix.
            gl_Position = u_matrix * a_position;

            // Pass the color to the fragment shader.
            v_color = a_color;
        }`;

        const fragmentShader = `precision mediump float;

        // Passed in from the vertex shader.
        varying vec4 v_color;

        void main() {
            gl_FragColor = v_color;
        }`;

        // setup GLSL program
        var program = createProgramFromSources(context, [vertexShader, fragmentShader]);

        // look up where the vertex data needs to go.
        var positionLocation = context.getAttribLocation(program, "a_position");
        setPositionLocation(positionLocation);
        var colorLocation = context.getAttribLocation(program, "a_color");
        setColorLocation(colorLocation);

        // lookup uniforms
        var matrixLocation = context.getUniformLocation(program, "u_matrix");
        setMatrixLocation(matrixLocation);

        var cameraAngleRadians = degToRad(0);
        var fieldOfViewRadians = degToRad(60);

        resizeCanvasToDisplaySize(context.canvas);

        // Tell WebGL how to convert from clip space to pixels
        context.viewport(0, 0, context.canvas.width, context.canvas.height);

        // Clear the canvas AND the depth buffer.
        context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

        // Turn on culling. By default backfacing triangles
        // will be culled.
        context.enable(context.CULL_FACE);

        // Enable the depth buffer
        context.enable(context.DEPTH_TEST);

        // Tell it to use our program (pair of shaders)
        context.useProgram(program);

        // Turn on the position attribute
        context.enableVertexAttribArray(positionLocation);

        var radius = 200;

        // Compute the projection matrix
        var aspect = context.canvas.clientWidth / context.canvas.clientHeight;
        var zNear = 1;
        var zFar = 2000;
        var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

        // Compute a matrix for the camera
        var cameraMatrix = m4.rotationY(cameraAngleRadians);
        cameraMatrix = m4.translate(cameraMatrix, v3.create(0, 0, radius * 1.5));

        // Make a view matrix from the camera matrix
        var viewMatrix = m4.inverse(cameraMatrix);

        // Compute a view projection matrix
        var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
        setViewProjectionMatrix(viewProjectionMatrix);

        setSetup(true);
    }, [context]);

    if (!setup) {
        return;
    }

    const bindGeometry = (geometry) => {
        // Create a buffer to put positions in
        var positionBuffer = context.createBuffer();
        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
        // Put geometry data into buffer
        setGeometry(context, geometry);

        return positionBuffer;
    }

    const bindColors = (colors) => {
        // Create a buffer to put colors in
        var colorBuffer = context.createBuffer();
        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = colorBuffer)
        context.bindBuffer(context.ARRAY_BUFFER, colorBuffer);
        // Put geometry data into buffer
        setColors(context, colors);

        return colorBuffer;
    }

    const drawAtPosition = (geometry, colors, triangleCount, x, y, z) => {
        if (!geometry || !colors) {
            return;
        }
        context.bindBuffer(context.ARRAY_BUFFER, geometry);

        // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 3;          // 3 components per iteration
        var type = context.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        context.vertexAttribPointer(
            positionLocation, size, type, normalize, stride, offset);

        context.enableVertexAttribArray(colorLocation);
        // Bind the color buffer.
        context.bindBuffer(context.ARRAY_BUFFER, colors);

        // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
        var size = 3;                 // 3 components per iteration
        var type = context.UNSIGNED_BYTE;  // the data is 8bit unsigned values
        var normalize = true;         // normalize the data (convert from 0-255 to 0-1)
        var stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;               // start at the beginning of the buffer
        context.vertexAttribPointer(
            colorLocation, size, type, normalize, stride, offset);

        // starting with the view projection matrix
        // compute a matrix for the F
        var matrix = m4.translate(viewProjectionMatrix, v3.create(x, z, y));

        // Set the matrix.
        context.uniformMatrix4fv(matrixLocation, false, matrix);

        // Draw the geometry.
        var primitiveType = context.TRIANGLES;
        var offset = 0;
        var count = triangleCount * 6;

        context.drawArrays(primitiveType, offset, count);
    }

    // Fill the buffer with the values that define a letter 'F'.
    function setGeometry(context, geometry) {
        // Center the F around the origin and Flip it around. We do this because
        // we're in 3D now with and +Y is up where as before when we started with 2D
        // we had +Y as down.

        // We could do by changing all the values above but I'm lazy.
        // We could also do it with a matrix at draw time but you should
        // never do stuff at draw time if you can do it at init time.
        var matrix = m4.rotationX(Math.PI);
        matrix = m4.translate(matrix, v3.create(-50, -75, -15));

        for (var ii = 0; ii < geometry.length; ii += 3) {
            var vector = vectorMultiply([geometry[ii + 0], geometry[ii + 1], geometry[ii + 2], 1], matrix);
            geometry[ii + 0] = vector[0];
            geometry[ii + 1] = vector[1];
            geometry[ii + 2] = vector[2];
        }

        context.bufferData(context.ARRAY_BUFFER, geometry, context.STATIC_DRAW);
    }

    // Fill the buffer with colors for the 'F'.
    function setColors(context, colors) {
        context.bufferData(
            context.ARRAY_BUFFER,
            colors,
            context.STATIC_DRAW);
    }

    return <CameraContext.Provider value={{ bindColors, bindGeometry, drawAtPosition }}>
        {children}
    </CameraContext.Provider>
}