import log from 'loglevel';
import * as React from 'react';

type PublicProps = {
  _btoa?: typeof btoa;
  _log?: typeof log;
  mimeType: string;
  content: string;
};

type ConvertImageDataParams = {
  _btoa?: typeof btoa;
  _log?: typeof log;
  content: string;
};

export const convertImageData = ({
  _btoa = btoa,
  _log = log,
  content,
}: ConvertImageDataParams): string | null => {
  try {
    return _btoa(content);
  } catch (error) {
    _log.debug('Error converting image data to ascii:', error);
    return null;
  }
};

const ImageViewBase = ({ _btoa, _log, content, mimeType }: PublicProps) => {
  const imageData = convertImageData({ _btoa, _log, content });
  return imageData ? (
    <img alt="" src={`data:${mimeType};base64,${imageData}`} />
  ) : null;
};

export default ImageViewBase;
