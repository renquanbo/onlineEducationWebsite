export const programLanguageColors: string[] = [
    'magenta',
    'volcano',
    'orange',
    'gold',
    'green',
    'cyan',
    'geekblue',
    'purple',
    'red',
    'lime',
  ];

  export enum SkillDes {
    'Know' = 1,
    'Practiced',
    'Comprehend',
    'Expert',
    'Master',
  }

  export const skillDes = new Array(5).fill(0).map((_, index) => SkillDes[index + 1]);