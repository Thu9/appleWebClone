import { useEffect, useRef } from "react";
import Loading from "../../components/Loading";
import "./Stroke.css";
import { sceneInfo } from "../../animation/StrokeAnimation";

export default function Stroke() {
  const sectionRef0 = useRef<HTMLElement>(null);
  let yOffset = 0;
  let prevScrollHeight = 0;
  let currentScene = 0;
  let enterNewScene = false;

  useEffect(() => {
    setLayout();
  }, []);

  const setLayout = () => {
    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === "sticky") {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else if (sceneInfo[i].type === "normal") {
      }
      sectionRef0.current &&
        (sectionRef0.current.style.height = `${sceneInfo[i].scrollHeight}px`);
    }

    yOffset = window.scrollY;

    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }

    document.body.setAttribute("id", `show-scene-${currentScene}`);
  };

  const calcValues = (values: any, currentYOffset: number) => {
    if (currentYOffset < 0) return String(0);
    let rv;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    if (values.length === 3) {
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if (
        currentYOffset >= partScrollStart &&
        currentYOffset <= partScrollEnd
      ) {
        rv =
          ((currentYOffset - partScrollStart) / partScrollHeight) *
            (values[1] - values[0]) +
          values[0];
      } else if (currentYOffset < partScrollStart) {
        rv = [values[0]];
      } else if (currentYOffset > partScrollEnd) {
        rv = [values[1]];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }
    return rv;
  };

  const scrollLoop = () => {
    enterNewScene = false;
    prevScrollHeight = 0;

    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (yOffset < prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      document.body.classList.remove("scroll-effect-end");
    }

    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      console.log(currentScene, sceneInfo.length - 1);
      enterNewScene = true;
      if (currentScene === sceneInfo.length - 1) {
        document.body.classList.add("scroll-effect-end");
      }

      if (currentScene < sceneInfo.length - 1) currentScene++;

      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (yOffset < prevScrollHeight) {
      enterNewScene = true;
      if (currentScene === 0) return;
      currentScene--;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }
    if (enterNewScene) return;

    playAnimation();
  };

  const playAnimation = () => {
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;
    // console.log(values, currentYOffset, scrollHeight, scrollRatio);

    switch (currentScene) {
      case 0:
        const messageA = sectionRef0.current?.querySelector(
          ".a"
        ) as HTMLDivElement;
        const messageB = sectionRef0.current?.querySelector(
          ".b"
        ) as HTMLDivElement;
        const pencilLogo = sectionRef0.current?.querySelector(
          ".pencil-logo"
        ) as HTMLObjectElement;
        const pencil = sectionRef0.current?.querySelector(
          ".pencil"
        ) as HTMLImageElement;

        const ribbon = sectionRef0.current?.querySelector(
          ".ribbon-path path"
        ) as HTMLSpanElement;

        if (!messageA) return;

        if (scrollRatio <= 0.25) {
          messageA.style.opacity = calcValues(
            values.messageA_opacity_in,
            currentYOffset
          );
          messageA.style.transform = `translate3d(0,${calcValues(
            values.messageA_translateY_in,
            currentYOffset
          )}%,0)`;
        } else {
          messageA.style.opacity = calcValues(
            values.messageA_opacity_out,
            currentYOffset
          );
          messageA.style.transform = `translate3d(0,${calcValues(
            values.messageA_translateY_out,
            currentYOffset
          )}%,0)`;
        }

        if (scrollRatio <= 0.55) {
          messageB.style.opacity = calcValues(
            values.messageB_opacity_in,
            currentYOffset
          );
        } else {
          messageB.style.opacity = calcValues(
            values.messageB_opacity_out,
            currentYOffset
          );
        }

        if (scrollRatio <= 0.4) {
          pencilLogo.style.width = `${calcValues(
            values.pencilLogo_width_in,
            currentYOffset
          )}vw`;
          pencilLogo.style.transform = `translate(${calcValues(
            values.pencilLogo_translateX_in,
            currentYOffset
          )}%, -50%)`;
        } else {
          pencilLogo.style.width = `${calcValues(
            values.pencilLogo_width_out,
            currentYOffset
          )}vw`;

          pencilLogo.style.transform = `translate(${calcValues(
            values.pencilLogo_translateX_out,
            currentYOffset
          )}%, -50%)`;
          console.log(pencilLogo.style.transform);
        }

        if (scrollRatio <= 0.5) {
          ribbon.style.strokeDashoffset = calcValues(
            values.path_dashoffset_in,
            currentYOffset
          );
        } else {
          ribbon.style.strokeDashoffset = calcValues(
            values.path_dashoffset_out,
            currentYOffset
          );
        }

        pencilLogo.style.opacity = calcValues(
          values.pencilLogo_opacity_out,
          currentYOffset
        );
        pencil.style.right = `${calcValues(
          values.pencil_right,
          currentYOffset
        )}%`;
        pencil.style.bottom = `${calcValues(
          values.pencil_bottom,
          currentYOffset
        )}%`;
        pencil.style.transform = `rotate(${calcValues(
          values.pencil_rotate,
          currentYOffset
        )}deg`;
    }
  };

  addEventListener("load", () => {
    document.body.classList.remove("before-load");
    setLayout();
  });

  addEventListener("scroll", () => {
    yOffset = window.scrollY;
    scrollLoop();
  });

  addEventListener("resize", () => {
    setLayout();
  });

  addEventListener("orientationchange", () => {
    setTimeout(setLayout, 500);
  });

  return (
    <>
      <Loading />
      <div className="containers">
        <section
          ref={sectionRef0}
          className="relative pt-[50vh] text-white"
          id="scroll-section-0"
        >
          <h1 className="relative top-[-10vh] z-[5] text-[3.5rem] text-center font-bold lg:text-[9vw]">
            Stroke Effect
          </h1>
          <object
            className="pencil-logo sticky-elem left-1/2 top-1/2 w-[1000vw] translate-x-[-10%] translate-y-[-50%]"
            data="src/assets/images/pencil-logo.svg"
          ></object>

          <div className="sticky-elem left-0 w-full top-[40vh] text-[2.5rem] lg:text-[4vw] a">
            <p className="font-bold text-center leading-[1.2]">여기에</p>
          </div>

          <span className="ribbon-path sticky-elem w-full left-1/2 top-1/2 min-w-[850px] translate-x-[-50%] translate-y-[-50%]">
            <svg
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 700 450"
            >
              <path d="M709,41.5c-194,38-387,122-455,159c-64.13,34.89-73.4,42.42,20,26c82.5-14.5,126.34-33.68,185-38 c47.5-3.5,69.22,7.98-11,39c-75,29-251,98-459,169"></path>
            </svg>
          </span>

          <div className="sticky-elem left-0 w-full top-[40vh] text-[3.5rem] b lg:text-[7vw]">
            <p className="font-bold text-center leading-[1.2]">옵션으로</p>
          </div>

          <img
            className="pencil sticky-elem w-[3.5vw] left-auto top-auto right-[-10%] bottom-[-80%] rotate-[-120deg]"
            src="src/assets/images/pencil.png"
          />
        </section>
        <div className="py-[20vh] px-0">
          <section>
            <p className="max-w-[1000px] my-0 mx-auto px-[1rem] text-[2rem] text-custom-gray lg:p-0 lg:text-[4vw]">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe
              repellat cupiditate necessitatibus soluta accusantium enim,
              aperiam eaque esse adipisci quae distinctio velit dolorem.
              Voluptatem, modi ab ipsa voluptate, quidem sapiente cupiditate
              possimus repudiandae nulla inventore nihil fuga eaque odio a? Unde
              labore enim dolorum dignissimos quisquam quo numquam nostrum
              molestias voluptas, maxime recusandae eius atque vitae in sed
              soluta sint excepturi. Officiis sapiente soluta minima inventore
              vel et vitae accusantium impedit quos, laboriosam laborum,
              assumenda illo odit, velit autem porro quis natus iste deserunt
              ad! Possimus nemo ipsa impedit, unde voluptate velit, alias rem
              illum omnis molestias cum enim quaerat?
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
