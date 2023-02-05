import { Fragment } from 'react';

export const flattenChildren = (children: any) => {
  return Array.isArray(children)
    ? [].concat(
        ...children.map((c) =>
          c?.type === Fragment
            ? flattenChildren(c.props.children)
            : flattenChildren(c),
        ),
      )
    : [children];
};
