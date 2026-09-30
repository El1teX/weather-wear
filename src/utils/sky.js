// Цвета неба для каждой погоды: верх и низ градиента, цвет текста
// и тень текста на небе. На светлом небе текст тёмно-синий, на тёмном — белый.
const DARK_INK = { ink: '#13294B', shadow: '0 1px 10px rgba(255, 255, 255, 0.45)' };
const LIGHT_INK = { ink: '#FFFFFF', shadow: '0 1px 14px rgba(10, 16, 48, 0.3)' };

export const SKY = {
  clear: { top: '#2E9BEF', bottom: '#9FDBFF', ...DARK_INK },
  clouds: { top: '#6E9CC8', bottom: '#C3DDF2', ...DARK_INK },
  rain: { top: '#3D5A8C', bottom: '#5C7DB0', ...LIGHT_INK },
  snow: { top: '#6BB0E8', bottom: '#CFE8FB', ...DARK_INK },
  storm: { top: '#2E2A5C', bottom: '#5A4F95', ...LIGHT_INK },
  fog: { top: '#9DB0C2', bottom: '#DCE5EE', ...DARK_INK },
  night: { top: '#1B1F5E', bottom: '#4A3F8F', ...LIGHT_INK },
  idle: { top: '#3CA8F2', bottom: '#A7E0FF', ...DARK_INK },
};
