import { CSSProperties, FC, ReactNode } from 'react';

// Generics

/**
 * `['name', 'email']` becomes `'name' | 'email'`
 */
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType[number];

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

// 此处放一些全局类型

export type LComponent<T = any> = FC<T>;

export type LNode = ReactNode;

export type LCSS = CSSProperties;

export type Callback<T = any> = () => T;

export type CallbackWith<T = any, R = any> = (v: T) => R;

export type VoidCallback = () => void;

export type AsyncVoidCallback = () => Promise<void>;

export type VoidCallbackWith<T> = (v: T) => void;

export type LNodeBuilder = () => LNode;
