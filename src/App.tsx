import { useEffect, useRef, useState } from "react";
import "./App.css";
import { sceneInfo } from "./Animation";
import Canvas from "./components/Canvas";

export default function App() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const scrollSection0 = useRef<HTMLElement>(null);
  const scrollSection1 = useRef<HTMLElement>(null);
  const scrollSection2 = useRef<HTMLElement>(null);
  const scrollSection3 = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  let yOffset = 0;
  let prevScrollHeight = 0;
  let currentScene = 0;
  const [enterNewScene, setEnterNewScene] = useState(false);

  useEffect(() => {
    setLayout();
    // scrollTo({ top: 0 });
  }, []);

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
  };

  const scrollLoop = () => {
    setEnterNewScene(false);
    const prevScene = currentScene;
    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      currentScene++;

      sceneRef.current?.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (yOffset < prevScrollHeight) {
      if (currentScene === 0) return;
      currentScene--;
      sceneRef.current?.setAttribute("id", `show-scene-${currentScene}`);
    }
    if (enterNewScene) return;

    playAnimation(prevScene);
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

    return String(rv);
  };

  const playAnimation = (prevScene?: number) => {
    let currentYOffset =
      prevScene != currentScene ? 0 : yOffset - prevScrollHeight;

    const values = sceneInfo[currentScene].values!;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    switch (currentScene) {
      case 0:
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

      case 1:
        calcValues(0, currentYOffset);
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

        break;

      case 3:
        break;
    }
  };

  window.addEventListener("resize", setLayout);
  window.addEventListener("scroll", () => {
    yOffset = window.scrollY;
    scrollLoop();
  });

  return (
    <div ref={sceneRef}>
      <nav>
        <div className="absolute top-0 left-0 w-full h-[48px] border-b-[1px] border-black text-center content-center text-[24px] font-semibold z-10">
          Header
        </div>
      </nav>
      <section id="scrollSection0" ref={scrollSection0} className="pt-[50vh]">
        <h1 className="text-[4rem] text-center lg:text-[9vw] font-bold">
          AirMug Pro
        </h1>
        <div className="sticky-elem top-0 bg-gray-300">
          {/* <Canvas ref={canvasRef} /> */}
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
        <div className="a sticky-elem main-message text-[3.5rem] lg:text-[6vw]">
          <p className="font-bold text-center leading-[1.2]">
            <small className="block mb-[0.5em] text-[1.2rem] lg:text-[1.5vw]">
              편안한 촉감
            </small>
            입과 하나 되다
          </p>
        </div>
        <div className="b sticky-elem !w-[50%] font-bold top-[0%] left-[40%] lg:!w-[20%] lg:top-[20%] lg:left-[53%]">
          <p>
            편안한 목넘김을 완성하는 디테일한 여러 구성 요소들, 우리는 이를
            하나하나 새롭게 살피고 재구성하는 과정을 거쳐 새로운 수준의 머그,
            AirMug Pro를 만들었습니다. 입에 뭔가 댔다는 감각은 어느새 사라지고
            오롯이 당신과 음료만 남게 되죠.
          </p>
          <div className="pin w-[1px] h-[100px] bg-custom-black"></div>
        </div>
        <div className="c sticky-elem !w-[50%] font-bold top-[15%] left-[45%] lg:!w-[20%] lg:left-[55%]">
          <p>
            디자인 앤 퀄리티 오브 스웨덴,
            <br />
            메이드 인 차이나
          </p>
          <div className="pin w-[1px] h-[100px] bg-custom-black"></div>
        </div>
      </section>
      <section id="scrollSection3" ref={scrollSection3} className="pt-[50vh]">
        <p className="px-[1rem] text-[2rem] text-custom-gray max-w-[1000px] mx-auto lg:text-[4vw]">
          <strong className="text-custom-black">Retina 머그</strong>
          <br />
          아이디어를 광활하게 펼칠
          <br />
          아름답고 부드러운 음료공간
        </p>
        <p className="px-[1rem] text-[1.2rem] text-custom-gray max-w-[1000px] mx-auto lg:text-[2rem]">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam
          nobis asperiores, consequuntur incidunt veritatis dolore fuga cum
          aliquam tenetur tempore dignissimos dolores ratione neque placeat
          quod, atque iusto praesentium doloremque?
        </p>
      </section>
      <footer className="flex items-center justify-center h-[7rem] bg-orange-400 text-white">
        20240719
      </footer>
    </div>
  );
}
