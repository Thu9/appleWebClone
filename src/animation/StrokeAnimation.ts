type AnimationValue =
  | number
  | [number, number]
  | [number, number, { start: number; end: number }];

interface SceneInfo {
  type: string;
  heightNum: number;
  scrollHeight: number;
  values: { [key: string]: AnimationValue };
}

export const sceneInfo: SceneInfo[] = [
  {
    type: "sticky",
    heightNum: 3,
    scrollHeight: 0,
    values: {
      messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
      messageB_opacity_in: [0, 1, { start: 0.4, end: 0.5 }],
      messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
      messageA_opacity_out: [1, 0, { start: 0.3, end: 0.4 }],
      messageB_opacity_out: [1, 0, { start: 0.6, end: 0.7 }],
      messageA_translateY_out: [0, -20, { start: 0.3, end: 0.4 }],
      pencilLogo_width_in: [1000, 200, { start: 0.1, end: 0.4 }],
      pencilLogo_width_out: [200, 50, { start: 0.4, end: 0.8 }],
      pencilLogo_translateX_in: [-10, -20, { start: 0.2, end: 0.4 }],
      pencilLogo_translateX_out: [-20, -50, { start: 0.4, end: 0.8 }],
      pencilLogo_opacity_out: [1, 0, { start: 0.8, end: 0.9 }],
      pencil_right: [-10, 70, { start: 0.3, end: 0.8 }],
      pencil_bottom: [-80, 100, { start: 0.3, end: 0.8 }],
      pencil_rotate: [-120, -200, { start: 0.3, end: 0.8 }],
      path_dashoffset_in: [1401, 0, { start: 0.2, end: 0.4 }],
      path_dashoffset_out: [0, -1401, { start: 0.6, end: 0.8 }],
    },
  },
];
