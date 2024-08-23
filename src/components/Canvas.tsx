import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { sceneInfo } from "../Animation";

interface CanvasProps {
  section?: number;
  sequence: number;
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
  ({ section, sequence }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useImperativeHandle(ref, () => canvasRef.current!);

    const [imegesLoading, setImegesLoading] = useState<number>(0);
    const [loaded, setLoaded] = useState(false);

    // console.log(section, sequence);

    const setLayout = () => {
      const heightRatio = window.innerHeight / 1080;
      canvasRef.current &&
        (canvasRef.current.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`);
    };

    const setCanvasImages = () => {
      sceneInfo[0].objs!.videosImages = [];

      for (let i = 0; i < sceneInfo[0].values.videoImagesCount; i++) {
        let imgElem = new Image();
        imgElem.src = `src/assets/video/001/IMG_${6727 + i}.JPG`;
        sceneInfo[0].objs!.videosImages.push(imgElem);
        imgElem.onload = () => {
          setImegesLoading((prev) => prev + 1);
        };
      }
    };

    useEffect(() => {
      setLayout();
      setCanvasImages();
    }, []);

    useEffect(() => {
      if (imegesLoading === sceneInfo[0].values.videoImagesCount) {
        setLoaded(true);
      }
    }, [imegesLoading]);

    useEffect(() => {
      if (loaded) {
        canvasRef.current &&
          canvasRef.current
            .getContext("2d")
            ?.drawImage(sceneInfo[0].objs!.videosImages[sequence], 0, 0);
      }
    });

    // window.addEventListener("resize", setLayout);

    return (
      <>
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className="absolute top-1/2 left-1/2"
        ></canvas>
      </>
    );
  }
);

export default memo(Canvas);
