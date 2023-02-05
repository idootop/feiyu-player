import { BoxProps } from '../Box';

export type AlignTypes =
  | 'center'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'centerLeft'
  | 'centerRight'
  | 'topCenter'
  | 'bottomCenter';

export interface PositionProps {
  top: number | string;
  left: number | string;
  right: number | string;
  bottom: number | string;
  align: AlignTypes;
}

export const Position = (p: BoxProps & Partial<PositionProps>) =>
  p.children as any;
