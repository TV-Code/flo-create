import { alpha } from '@mui/system';

export const lightenColor = (color, amount) => {
  return alpha(color, 1 - amount);
};
