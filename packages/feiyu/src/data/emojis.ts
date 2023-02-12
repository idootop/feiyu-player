import { pickOne } from '../utils/base';
import { configs } from './config/manager';

export const randomEmoji = () => {
  return pickOne(
    configs.current.randomEmojis ?? [
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
    ],
  );
};
