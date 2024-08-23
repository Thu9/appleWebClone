import { useRef } from "react";

export default function SmoothScroll() {
  const boxRef = useRef<HTMLDivElement>(null);
  //   const [yOffset, setYOffset] = useState(0);
  let acc = 0.1;
  let delayedYOffset = 0;
  let rafId = 0;
  let rafState = false;

  const loop = () => {
    delayedYOffset = delayedYOffset + (scrollY - delayedYOffset) * acc;
    boxRef.current && (boxRef.current.style.width = `${delayedYOffset}px`);
    console.log(scrollY, delayedYOffset, scrollY - delayedYOffset);

    rafId = requestAnimationFrame(loop);

    if (Math.abs(scrollY - delayedYOffset) < 1) {
      cancelAnimationFrame(rafId);
      rafState = false;
    }
  };

  addEventListener("scroll", () => {
    if (!rafState) {
      rafId = requestAnimationFrame(loop);
      rafState = true;
    }
  });

  loop();

  return (
    <div className="h-[500vh]">
      <div
        ref={boxRef}
        // style={{ width: `${yOffset}px` }}
        className="fixed top-[100px] left-0 w-0 h-[100px] bg-orange-400"
      ></div>
    </div>
  );
}
