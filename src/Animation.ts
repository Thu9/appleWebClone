interface SceneInfo {
  type: string;
  heightNum: number;
  scrollHeight: number;
  objs?: Objs;
  values?: any;
}

interface Objs {
  videosImages?: HTMLImageElement[];
  imagesPath?: string[];
  images?: HTMLImageElement[];
}

export const sceneInfo: SceneInfo[] = [
  {
    //0
    type: "sticky",
    heightNum: 5, //브라우저 높이의 5배
    scrollHeight: 0,
    objs: {
      videosImages: new Array(300),
    },
    values: {
      videoImagesCount: 300,
      imageSequence: [0, 299],
      canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
      messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
      messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
      messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
      messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
      messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
      messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
      messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
      messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
      messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
      messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
      messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
      messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
      messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
      messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
      messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
      messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
    },
  },
  {
    //1
    type: "normal",
    heightNum: 0,
    scrollHeight: 0,
  },
  {
    //2
    type: "sticky",
    heightNum: 5,
    scrollHeight: 0,
    objs: {
      videosImages: new Array(960),
    },
    values: {
      videoImagesCount: 960,
      imageSequence: [0, 959],
      canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
      canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
      messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
      messageB_translateY_in: [30, 0, { start: 0.5, end: 0.55 }],
      messageC_translateY_in: [30, 0, { start: 0.72, end: 0.77 }],
      messageA_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
      messageB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
      messageC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
      messageA_translateY_out: [0, -20, { start: 0.3, end: 0.35 }],
      messageB_translateY_out: [0, -20, { start: 0.58, end: 0.63 }],
      messageC_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
      messageA_opacity_out: [1, 0, { start: 0.3, end: 0.35 }],
      messageB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
      messageC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
      pinB_scaleY: [0.5, 1, { start: 0.5, end: 0.55 }],
      pinC_scaleY: [0.5, 1, { start: 0.72, end: 0.77 }],
      pinB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
      pinC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
      pinB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
      pinC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
    },
  },
  {
    //3
    type: "sticky",
    heightNum: 5,
    scrollHeight: 0,
    objs: {
      imagesPath: [
        "src/assets/images/blend-image-1.jpg",
        "src/assets/images/blend-image-2.jpg",
      ],
      images: [],
    },
    values: {
      rect1X: [0, 0, { start: 0, end: 0 }],
      rect2X: [0, 0, { start: 0, end: 0 }],
      blendHeight: [0, 0, { start: 0, end: 0 }],
      canvas_scale: [0, 0, { start: 0, end: 0 }],
      canvasCaption_opacity: [0, 1, { start: 0, end: 0 }],
      canvasCaption_translateY: [20, 0, { start: 0, end: 0 }],
      rectStartY: 0,
    },
  },
];
