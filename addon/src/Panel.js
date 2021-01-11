import React, { useEffect, useState } from 'react';

import SyntaxHighlighter from './SyntaxHighlighter';
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/github-gist';

const HTMLPanel = (props) => {
  return (
    <SyntaxHighlighter
      language={'js'}
      copyable={true}
      padded={true}
      style={style}
      showLineNumbers={true}
      wrapLines={false}
    >
      {`<%- ${props.code} %>`}
    </SyntaxHighlighter>
  );
};

export default HTMLPanel;
