import './style.css';

import { Image } from '@arco-design/web-react';
import { useState } from 'react';
import LazyLoad from 'react-lazy-load';

import { AspectRatio } from '../AspectRatio';

interface LazyImageProps {
  src: string;
  width?: string;
  height?: string;
  aspectRatio?: number;
  onload?: () => void;
}

export const LazyImage = (props: LazyImageProps) => {
  const {
    src,
    width = '100%',
    height = '182px',
    aspectRatio = 80 / 112,
  } = props;
  const [loaded, setLoaded] = useState(false);
  const onload = () => {
    props.onload?.();
    setLoaded(true);
  };
  return (
    <AspectRatio aspectRatio={aspectRatio} width={width} height={height}>
      {({ isSupport, ...size }) => (
        <LazyLoad
          width={isSupport ? (loaded ? '100%' : width) : size.width}
          height={isSupport ? (loaded ? '100%' : height) : size.height}
          onContentVisible={onload}
        >
          <Image
            preview={false}
            className={isSupport ? 'fill-img' : undefined}
            src={src}
            style={{
              ...size,
              objectFit: 'cover',
            }}
            referrerPolicy="no-referrer"
          />
        </LazyLoad>
      )}
    </AspectRatio>
  );
};
