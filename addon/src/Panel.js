import React, { useEffect, useState } from 'react';
import { useChannel, useParameter, useStorybookState, useStorybookApi } from '@storybook/api';

import SyntaxHighlighter from './SyntaxHighlighter';
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/github-gist';
import { format as prettierFormat } from 'prettier/standalone';
import prettier from "prettier";


import { EVENT_CODE_RECEIVED } from './shared';

const PARAM_KEY = 'html';

const HTMLPanel = () => {
  const [html, setHTML] = useState('');
  const [code, setCode] = useState('');

  const state = useStorybookState();
  const api = useStorybookApi();
  console.log('api')

  const id = state.storyId;

  const story = state.storiesHash[id];

  let importText = "";
  if (story) {
    console.log('story', story);
    const componentParts = story.kind.split('/');
    const componentName = componentParts[componentParts.length - 1];

    // Turn args to a proper object
    const normalizedArgs = {};
    const entries = Object.entries(story.args);
    for (const [key, item] of entries) {
      // Don't include bookshop-reserved keys
      if (key !== "framework" && !key.includes("repeat-count")) {
        if (key.includes('&&')) {
          const items = key.split('&&');
          normalizedArgs[items[0]] = { ...normalizedArgs[items[0]], [items[1]]: item }
        } else {
          normalizedArgs[key] = item;
        }
      }
    }

  
    importText = `component("${componentName.toLowerCase()}", ${JSON.stringify(normalizedArgs)}) %>`;
  }
  // console.log('state', state);



  // const parameters = useParameter(PARAM_KEY, {});
  // const {
  //   highlighter: { showLineNumbers = false, wrapLines = true } = {},
  //   prettier = {},
  // } = parameters;

  return (
    <SyntaxHighlighter
      language={'js'}
      copyable={true}
      padded={true}
      style={style}
      showLineNumbers={showLineNumbers}
      wrapLines={wrapLines}
    >
      {`<%- ${prettier.format("foo ( );", { semi: false, parser: "babel" })} %>`}
    </SyntaxHighlighter>
  );
};

export default HTMLPanel;
