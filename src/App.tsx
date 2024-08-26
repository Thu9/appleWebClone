import { memo, useEffect, useRef } from "react";
import { sceneInfo } from "./Animation";
import "./App.css";

function App() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const scrollSection0 = useRef<HTMLElement>(null);
  const scrollSection1 = useRef<HTMLElement>(null);
  const scrollSection2 = useRef<HTMLElement>(null);
  const scrollSection3 = useRef<HTMLElement>(null);
  const canvasRef0 = useRef<HTMLCanvasElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);
  const canvasRef3 = useRef<HTMLCanvasElement>(null);
  const canvasCaptionRef = useRef<HTMLParagraphElement>(null);

  let yOffset = 0;
  let prevScrollHeight = 0;
  let currentScene = 0;
  let enterNewScene = false;

  //scroll 가속도
  let acc = 0.1;
  let delayedYOffset = 0;
  let rafId = 0;
  let rafState = false;

  useEffect(() => {
    setLayout();
    setCanvasImages();
    scrollTo({ top: 0 });
  }, []);

  const setCanvasImages = () => {
    let defaultImg = new Image();
    defaultImg.src = "src/assets/video/001/IMG_6727.JPG";
    defaultImg.onload = () => {
      canvasRef0.current &&
        canvasRef0.current.getContext("2d")?.drawImage(defaultImg, 0, 0);
    };

    sceneInfo[0].objs!.videosImages = [];
    for (let i = 0; i < sceneInfo[0].values.videoImagesCount; i++) {
      let imgElem = new Image();
      imgElem.src = `src/assets/video/001/IMG_${6727 + i}.JPG`;
      sceneInfo[0].objs!.videosImages.push(imgElem);
      imgElem.onload;

      imgElem.onerror = (err) => {
        console.log(err);
      };
    }

    sceneInfo[2].objs!.videosImages = [];
    for (let i = 0; i < sceneInfo[2].values.videoImagesCount; i++) {
      let imgElem2 = new Image();
      imgElem2.src = `src/assets/video/002/IMG_${7027 + i}.JPG`;
      sceneInfo[2].objs!.videosImages.push(imgElem2);
      imgElem2.onload;

      imgElem2.onerror = (err) => {
        console.log(err);
      };
    }

    sceneInfo[3].objs!.images = [];
    for (let i = 0; i < sceneInfo[3].objs!.imagesPath!.length; i++) {
      let imgElem3 = new Image();
      imgElem3.src = sceneInfo[3].objs!.imagesPath![i];
      sceneInfo[3].objs!.images.push(imgElem3);
      imgElem3.onload;

      imgElem3.onerror = (err) => {
        console.log(err);
      };
    }
  };

  const checkMenu = () => {
    if (yOffset > 44) {
      document.body.classList.add("local-nav-sticky");
    } else {
      document.body.classList.remove("local-nav-sticky");
    }
  };

  const setLayout = () => {
    for (let i = 0; i < sceneInfo.length; i++) {
      const element = document.querySelector(
        `#scrollSection${i}`
      ) as HTMLElement;

      if (sceneInfo[i].type === "sticky") {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else if (sceneInfo[i].type === "normal") {
        sceneInfo[i].scrollHeight = element.offsetHeight;
      }
      element.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    yOffset = window.scrollY;

    let totalScrollHeight = 0;
    for (let i = 0; sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }
    sceneRef.current?.setAttribute("id", `show-scene-${currentScene}`);

    const heightRatio = window.innerHeight / 1080;
    canvasRef0.current &&
      (canvasRef0.current.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`);
    canvasRef2.current &&
      (canvasRef2.current.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`);
  };

  const scrollLoop = async () => {
    enterNewScene = false;
    prevScrollHeight = 0;

    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (
      delayedYOffset >
      prevScrollHeight + sceneInfo[currentScene].scrollHeight
    ) {
      enterNewScene = true;
      currentScene++;
      sceneRef.current?.setAttribute("id", `show-scene-${currentScene}`);
      return;
    }

    if (delayedYOffset < prevScrollHeight) {
      enterNewScene = true;
      if (currentScene === 0) return;
      currentScene--;
      sceneRef.current?.setAttribute("id", `show-scene-${currentScene}`);
      return;
    }
    if (enterNewScene) return;

    playAnimation();
  };

  const loop = () => {
    delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

    rafId = requestAnimationFrame(loop);

    if (Math.abs(yOffset - delayedYOffset) < 1) {
      cancelAnimationFrame(rafId);
      rafState = false;
    }

    if (!enterNewScene) {
      if (currentScene === 0 || currentScene === 2) {
        const values = sceneInfo[currentScene].values;
        const objs = sceneInfo[currentScene].objs;
        let currentYOffset = delayedYOffset - prevScrollHeight;
        let sequence = Math.round(
          calcValues(values.imageSequence, currentYOffset)
        );

        if (objs!.videosImages![sequence]) {
          if (currentScene === 0) {
            canvasRef0.current &&
              canvasRef0.current
                .getContext("2d")
                ?.drawImage(sceneInfo[0].objs!.videosImages![sequence], 0, 0);
          }
          if (currentScene === 2) {
            canvasRef2.current &&
              canvasRef2.current
                .getContext("2d")
                ?.drawImage(sceneInfo[2].objs!.videosImages![sequence], 0, 0);
          }
        }
      }
    }
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

  const playAnimation = () => {
    let currentYOffset = yOffset - prevScrollHeight;
    const values = sceneInfo[currentScene].values!;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    switch (currentScene) {
      case 0:
        canvasRef0.current &&
          (canvasRef0.current.style.opacity = calcValues(
            values.canvas_opacity,
            currentYOffset
          ));

        const messageA = scrollSection0.current?.querySelector(
          ".main-message.a"
        ) as HTMLDivElement;

        const messageB = scrollSection0.current?.querySelector(
          ".main-message.b"
        ) as HTMLDivElement;

        const messageC = scrollSection0.current?.querySelector(
          ".main-message.c"
        ) as HTMLDivElement;

        const messageD = scrollSection0.current?.querySelector(
          ".main-message.d"
        ) as HTMLDivElement;

        if (messageA) {
          messageA.style.opacity = calcValues(
            scrollRatio <= 0.22
              ? values.messageA_opacity_in
              : values.messageA_opacity_out,
            currentYOffset
          );
          messageA.style.transform = `translate3d(0, ${calcValues(
            scrollRatio <= 0.22
              ? values.messageA_translateY_in
              : values.messageA_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (messageB) {
          messageB.style.opacity = calcValues(
            scrollRatio <= 0.42
              ? values.messageB_opacity_in
              : values.messageB_opacity_out,
            currentYOffset
          );
          messageB.style.transform = `translate3d(0, ${calcValues(
            scrollRatio <= 0.42
              ? values.messageB_translateY_in
              : values.messageB_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (messageC) {
          messageC.style.opacity = calcValues(
            scrollRatio <= 0.62
              ? values.messageC_opacity_in
              : values.messageC_opacity_out,
            currentYOffset
          );
          messageC.style.transform = `translate3d(0, ${calcValues(
            scrollRatio <= 0.62
              ? values.messageC_translateY_in
              : values.messageC_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (messageD) {
          messageD.style.opacity = calcValues(
            scrollRatio <= 0.82
              ? values.messageD_opacity_in
              : values.messageD_opacity_out,
            currentYOffset
          );
          messageD.style.transform = `translate3d(0, ${calcValues(
            scrollRatio <= 0.82
              ? values.messageD_translateY_in
              : values.messageD_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        break;

      case 2:
        const message2A = scrollSection2.current?.querySelector(
          ".a"
        ) as HTMLDivElement;
        const message2B = scrollSection2.current?.querySelector(
          ".b"
        ) as HTMLDivElement;
        const message2C = scrollSection2.current?.querySelector(
          ".c"
        ) as HTMLDivElement;

        const pinB = scrollSection2.current?.querySelector(
          ".b.pin"
        ) as HTMLDivElement;

        const pinC = scrollSection2.current?.querySelector(
          ".c.pin"
        ) as HTMLDivElement;
        if (message2A) {
          message2A.style.opacity = calcValues(
            scrollRatio <= 0.25
              ? values.messageA_opacity_in
              : values.messageA_opacity_out,
            currentYOffset
          );
          message2A.style.transform = `translate3d(0, ${calcValues(
            scrollRatio <= 0.25
              ? values.messageA_translateY_in
              : values.messageA_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (message2B) {
          message2B.style.opacity = calcValues(
            scrollRatio <= 0.57
              ? values.messageB_opacity_in
              : values.messageB_opacity_out,
            currentYOffset
          );
          message2B.style.transform = `translate3d(0, ${calcValues(
            scrollRatio <= 0.57
              ? values.messageB_translateY_in
              : values.messageB_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (pinB) {
          pinB.style.transform = `scaleY(${calcValues(
            values.pinB_scaleY,
            currentYOffset
          )})`;
        }

        if (message2C) {
          message2C.style.opacity = calcValues(
            scrollRatio <= 0.83
              ? values.messageC_opacity_in
              : values.messageC_opacity_out,
            currentYOffset
          );
          message2C.style.transform = `translate3d(0, ${calcValues(
            scrollRatio <= 0.83
              ? values.messageC_translateY_in
              : values.messageC_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (pinC) {
          pinC.style.transform = `scaleY(${calcValues(
            values.pinC_scaleY,
            currentYOffset
          )})`;
        }

        canvasRef2.current &&
          (canvasRef2.current.style.opacity = calcValues(
            scrollRatio <= 0.5
              ? values.canvas_opacity_in
              : values.canvas_opacity_out,
            currentYOffset
          ));

        // section3 미리 렌더링
        if (scrollRatio > 0.9) {
          if (!canvasRef3.current) return;

          const values = sceneInfo[3].values!;
          const widthRatio = window.innerWidth / canvasRef3.current.width;
          const heightRatio = window.innerHeight / canvasRef3.current.height;
          let canvasScaleRatio;

          if (widthRatio <= heightRatio) {
            canvasScaleRatio = heightRatio;
          } else {
            canvasScaleRatio = widthRatio;
          }

          canvasRef3.current.style.transform = `scale(${canvasScaleRatio})`;
          canvasRef3.current.getContext("2d")!.fillStyle = "white";
          canvasRef3.current
            .getContext("2d")
            ?.drawImage(sceneInfo[3].objs!.images![0], 0, 0);

          const recalcInnerWidth = document.body.offsetWidth / canvasScaleRatio;

          const whiteRectWidth = recalcInnerWidth * 0.15;
          values.rect1X[0] = (canvasRef3.current.width - recalcInnerWidth) / 2;
          values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
          values.rect2X[0] =
            values.rect1X[0] + recalcInnerWidth - whiteRectWidth;
          values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

          canvasRef3.current
            .getContext("2d")
            ?.fillRect(
              values.rect1X[0],
              0,
              whiteRectWidth,
              canvasRef3.current.height
            );
          canvasRef3.current
            .getContext("2d")
            ?.fillRect(
              values.rect2X[0],
              0,
              whiteRectWidth,
              canvasRef3.current.height
            );
        }

        break;

      case 3:
        if (!canvasRef3.current) return;
        let step = 0;

        const widthRatio = window.innerWidth / canvasRef3.current.width;
        const heightRatio = window.innerHeight / canvasRef3.current.height;
        let canvasScaleRatio;

        if (widthRatio <= heightRatio) {
          canvasScaleRatio = heightRatio;
        } else {
          canvasScaleRatio = widthRatio;
        }

        canvasRef3.current.style.transform = `scale(${canvasScaleRatio})`;
        canvasRef3.current.getContext("2d")!.fillStyle = "white";
        canvasRef3.current
          .getContext("2d")
          ?.drawImage(sceneInfo[3].objs!.images![0], 0, 0);

        if (!values.rectStartY) {
          values.rectStartY =
            canvasRef3.current.offsetTop +
            (canvasRef3.current.height -
              canvasRef3.current.height * canvasScaleRatio) /
              2;

          values.rect1X[2].start = window.innerHeight / 2 / scrollHeight; // 0.1;
          values.rect2X[2].start = window.innerHeight / 2 / scrollHeight;
          values.rect1X[2].end = values.rectStartY / scrollHeight;
          values.rect2X[2].end = values.rectStartY / scrollHeight;
        }

        const recalcInnerWidth = document.body.offsetWidth / canvasScaleRatio;

        const whiteRectWidth = recalcInnerWidth * 0.15;
        values.rect1X[0] = (canvasRef3.current.width - recalcInnerWidth) / 2;
        values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
        values.rect2X[0] = values.rect1X[0] + recalcInnerWidth - whiteRectWidth;
        values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

        canvasRef3.current
          .getContext("2d")
          ?.fillRect(
            calcValues(values.rect1X, currentYOffset),
            0,
            whiteRectWidth,
            canvasRef3.current.height
          );
        canvasRef3.current
          .getContext("2d")
          ?.fillRect(
            calcValues(values.rect2X, currentYOffset),
            0,
            whiteRectWidth,
            canvasRef3.current.height
          );

        if (scrollRatio < values.rect1X[2].end) {
          step = 1;
          canvasRef3.current.classList.remove("sticky");
        } else {
          step = 2;

          values.blendHeight[0] = 0;
          values.blendHeight[1] = canvasRef3.current.height;
          values.blendHeight[2].start = values.rect1X[2].end;
          values.blendHeight[2].end = values.blendHeight[2].start + 0.2;

          let blendHeight = calcValues(values.blendHeight, currentYOffset);
          canvasRef3.current
            .getContext("2d")
            ?.drawImage(
              sceneInfo[3].objs!.images![1],
              0,
              canvasRef3.current.height - blendHeight,
              canvasRef3.current.width,
              blendHeight,
              0,
              canvasRef3.current.height - blendHeight,
              canvasRef3.current.width,
              blendHeight
            );

          canvasRef3.current.classList.add("sticky");
          canvasRef3.current.style.top = `${
            -(
              canvasRef3.current.height -
              canvasRef3.current.height * canvasScaleRatio
            ) / 2
          }px`;

          if (scrollRatio > values.blendHeight[2].end) {
            values.canvas_scale[0] = canvasScaleRatio;
            values.canvas_scale[1] =
              document.body.offsetWidth / (1.5 * canvasRef3.current.width);
            values.canvas_scale[2].start = values.blendHeight[2].end;
            values.canvas_scale[2].end = values.canvas_scale[2].start + 0.2;

            canvasRef3.current.style.transform = `scale(${calcValues(
              values.canvas_scale,
              currentYOffset
            )})`;
            canvasRef3.current.style.marginTop = "0";
          }

          if (
            scrollRatio > values.canvas_scale[2].end &&
            values.canvas_scale[2].end > 0
          ) {
            canvasRef3.current.classList.remove("sticky");
            canvasRef3.current.style.marginTop = `${scrollHeight * 0.4}px`;

            values.canvasCaption_opacity[2].start = values.canvas_scale[2].end;
            values.canvasCaption_opacity[2].end =
              values.canvasCaption_opacity[2].start + 0.1;
            values.canvasCaption_translateY[2].start =
              values.canvas_scale[2].end;
            values.canvasCaption_translateY[2].end =
              values.canvasCaption_translateY[2].start + 0.1;

            if (!canvasCaptionRef.current) return;
            canvasCaptionRef.current.style.opacity = calcValues(
              values.canvasCaption_opacity,
              currentYOffset
            );
            canvasCaptionRef.current.style.transform = `translate3d(0, ${calcValues(
              values.canvasCaption_translateY,
              currentYOffset
            )}%, 0)`;
          }
        }

        break;
    }
  };

  window.addEventListener("scroll", () => {
    yOffset = window.scrollY;
    scrollLoop();
    checkMenu();
    if (!rafState) {
      rafId = requestAnimationFrame(loop);
      rafState = true;
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 600) {
      setLayout();
    }
    sceneInfo[3].values.rectStartY = 0;
  });
  window.addEventListener("load", () => {
    setLayout();
  });

  window.addEventListener("orientationchange", () => setLayout());

  return (
    <div ref={sceneRef}>
      {/* <nav>
        <div className="absolute top-0 left-0 w-full h-[48px] border-b-[1px] border-black text-center content-center text-[24px] font-semibold z-10">
          Header
        </div>
      </nav> */}
      <nav className="absolute top-0 left-0 z-10 w-full px-[1rem] h-[44px]">
        <div className="flex items-center max-w-[1000px] h-full mx-auto justify-between">
          <a href="#" className="global-nav-item">
            Rooms
          </a>
          <a href="#" className="global-nav-item">
            Ideas
          </a>
          <a href="#" className="global-nav-item">
            Stores
          </a>
          <a href="#" className="global-nav-item">
            Contact
          </a>
        </div>
      </nav>
      <nav className="local-nav absolute top-[45px] left-0 z-[11] w-full h-[52px] px-[1rem] border-b-[1px] border-[#ddd]">
        <div className="flex items-center max-w-[1000px] h-full mx-auto text-[0.8rem]">
          <a href="#" className="mr-auto text-[1.4rem] font-bold">
            AirMug Pro
          </a>
          <a href="#" className="ml-[2em]">
            개요
          </a>
          <a href="#" className="ml-[2em]">
            제품사양
          </a>
          <a href="#" className="ml-[2em]">
            구입하기
          </a>
        </div>
      </nav>
      <section id="scrollSection0" ref={scrollSection0} className="pt-[50vh]">
        <h1 className="text-[4rem] text-center lg:text-[9vw] font-bold relative z-[5] top-[-10vh]">
          AirMug Pro
        </h1>
        <div className="sticky-elem top-0 h-full">
          <canvas
            ref={canvasRef0}
            width={1920}
            height={1080}
            className="absolute top-1/2 left-1/2"
          />
        </div>
        <div className="sticky-elem main-message a lg:text-[4vw]">
          <p className="font-bold text-center leading-[1.2]">
            온전히 빠져들게 하는
            <br />
            최고급 세라믹
          </p>
        </div>
        <div className="sticky-elem main-message b lg:text-[4vw]">
          <p className="font-bold text-center leading-[1.2]">
            주변 맛을 느끼게 해주는
            <br />
            주변 맛 허용 모드
          </p>
        </div>
        <div className="sticky-elem main-message c lg:text-[4vw]">
          <p className="font-bold text-center leading-[1.2]">
            온종일 편안한
            <br />
            맞춤형 손잡이
          </p>
        </div>
        <div className="sticky-elem main-message d lg:text-[4vw]">
          <p className="font-bold text-center leading-[1.2]">
            새롭게 입가를
            <br />
            찾아온 매혹
          </p>
        </div>
      </section>

      <section id="scrollSection1" ref={scrollSection1} className="pt-[50vh]">
        <p className="text-[1.2rem] text-custom-gray px-[1rem] max-w-[1000px] mx-auto lg:text-[2rem]">
          <strong className="float-left mr-[0.2em] text-[3rem] text-custom-black lg:text-[6rem]">
            보통 스크롤 영역
          </strong>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus
          accusamus magni neque quam officiis voluptatibus quasi, minus ab natus
          repudiandae exercitationem consectetur consequuntur illo adipisci
          nostrum laboriosam. Nulla pariatur, consequatur iusto animi quidem
          itaque ea autem obcaecati? Accusantium optio ab totam magni nobis
          dolor quibusdam quidem fugiat fugit, consequuntur architecto
          doloremque pariatur tempore, eaque saepe porro perspiciatis nesciunt
          quod eos sapiente! Tenetur, eum placeat dignissimos saepe quod ratione
          mollitia quae ut itaque voluptas officia, illum quibusdam? Eos aperiam
          dicta harum veniam ea nobis laboriosam amet incidunt voluptates quas
          magni consequatur est labore dolorem dolores ipsam consequuntur iusto,
          suscipit iste, fugit optio. Eaque eveniet, officiis ullam quod
          obcaecati nemo id, voluptates vel minima hic quasi, quibusdam iusto
          rem soluta a illum quis dignissimos pariatur asperiores minus facilis?
          Culpa laborum dolorum, expedita facilis totam dignissimos libero, unde
          id perspiciatis autem deleniti cum, vero odio quae fugiat quidem
          reprehenderit? A saepe eaque velit!
        </p>
      </section>
      <section id="scrollSection2" ref={scrollSection2} className="pt-[50vh]">
        <div className="sticky-elem top-0 h-full">
          <canvas
            ref={canvasRef2}
            width={1920}
            height={1080}
            className="absolute top-1/2 left-1/2"
          />
        </div>
        <div className="a sticky-elem main-message text-[3.5rem] lg:text-[6vw]">
          <p className="font-bold text-center leading-[1.2]">
            <small className="block mb-[0.5em] text-[1.2rem] lg:text-[1.5vw]">
              편안한 촉감
            </small>
            입과 하나 되다
          </p>
        </div>
        <div className="b sticky-elem !w-[50%] font-bold top-[0%] left-[40%] lg:!w-[20%] lg:top-[20%] lg:left-[53%] opacity-0">
          <p>
            편안한 목넘김을 완성하는 디테일한 여러 구성 요소들, 우리는 이를
            하나하나 새롭게 살피고 재구성하는 과정을 거쳐 새로운 수준의 머그,
            AirMug Pro를 만들었습니다. 입에 뭔가 댔다는 감각은 어느새 사라지고
            오롯이 당신과 음료만 남게 되죠.
          </p>
          <div className="pin w-[1px] h-[100px] bg-custom-black"></div>
        </div>
        <div className="c sticky-elem !w-[50%] font-bold top-[15%] left-[45%] lg:!w-[20%] lg:left-[55%] opacity-0">
          <p>
            디자인 앤 퀄리티 오브 스웨덴,
            <br />
            메이드 인 차이나
          </p>
          <div className="pin w-[1px] h-[100px] bg-custom-black"></div>
        </div>
      </section>
      <section
        id="scrollSection3"
        ref={scrollSection3}
        className="pt-[50vh] flex flex-col items-center relative"
      >
        <p className="px-[1rem] text-[2rem] text-custom-gray max-w-[1000px] mx-auto lg:text-[4vw] lg:w-[1000px] lg:p-0">
          <strong className="text-custom-black">Retina 머그</strong>
          <br />
          아이디어를 광활하게 펼칠
          <br />
          아름답고 부드러운 음료공간
        </p>

        <canvas
          ref={canvasRef3}
          className="image-blend-canvas"
          width={1920}
          height={1080}
        ></canvas>

        <p
          ref={canvasCaptionRef}
          className="px-[1rem] text-[1.2rem] text-custom-gray max-w-[1000px] mx-auto mt-[-8em] lg:text-[2rem]"
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam
          assumenda perferendis ullam est quisquam numquam, consequuntur non
          excepturi dolores cum voluptatem magni quaerat quod accusantium,
          mollitia voluptatibus fuga quia nemo harum nam explicabo libero aut
          cumque. Qui, eos! Fuga esse ipsa neque reprehenderit voluptatem ex
          laudantium, aliquam est aspernatur quae aut reiciendis hic sit.
          Repellat officiis ea quod veniam ex! Quisquam laboriosam omnis
          aspernatur et a vitae rem voluptatum odit consequuntur ullam nesciunt,
          quas dolorum dolor provident possimus tempore harum earum nostrum
          atque dolorem quos amet? Repellat quae beatae corporis saepe sequi,
          suscipit sapiente nesciunt quam. Culpa fugiat officiis fugit quos
          error laboriosam, hic reiciendis quam ipsum necessitatibus
          voluptatibus cupiditate reprehenderit. Aut quibusdam veritatis in ut
          at et! Tempora aspernatur quod temporibus rem natus dolor velit
          officiis inventore dignissimos! Laborum sint at dolores excepturi
          aspernatur obcaecati incidunt similique temporibus ex, molestiae,
          ratione suscipit itaque voluptatum, repellendus quidem magni molestias
          beatae officia. Quas, aperiam minus, reprehenderit tempore placeat
          officiis deserunt veritatis porro deleniti facilis ad voluptas
          suscipit blanditiis! Officia, suscipit. Autem nemo ex molestias beatae
          eveniet ab voluptatem praesentium, vero totam at amet atque harum
          quidem qui rerum accusamus fugit eligendi dolorum possimus in porro
        </p>
      </section>
      <footer className="flex items-center justify-center h-[7rem] bg-orange-400 text-white">
        20240719
      </footer>
    </div>
  );
}

export default memo(App);
