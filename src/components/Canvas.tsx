import { forwardRef, useImperativeHandle, useRef } from "react";

const Canvas = forwardRef<{}>((props, ref) => {
  //   const canvasRef = useRef<HTMLCanvasElement>(null);

  return <canvas ref={ref} width={1920} height={1080}></canvas>;
});

export default Canvas;
