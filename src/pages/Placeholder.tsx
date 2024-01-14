import React, { useMemo } from 'react';
import { Blurhash } from 'react-blurhash';

type PlaceholderProps = {
  blur_hash: string;
  height: string;
};

function Placeholder({ blur_hash, height }: PlaceholderProps) {
  const placeholder = useMemo(() => {
    if (!blur_hash) {
      return <></>;
    }
    return (
      <Blurhash
        hash={blur_hash || ''}
        punch={1}
        height={height}
        style={{
          borderRadius: '15px',
          width: '100%',
          overflow: 'hidden',
        }}
      />
    );
  }, [blur_hash]);
  return <div>{placeholder}</div>;
}

export default Placeholder;
