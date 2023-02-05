import { pickOne } from '../utils/base';

export const randomEmoji = () => {
  return pickOne([
    '🐹',
    '🐮',
    '🐯',
    '🐰',
    '🐲',
    '🐍',
    '🦄',
    '🐏',
    '🐵',
    '🐣',
    '🐶',
    '🐷',
  ]);
};
