import React, { useEffect, useState } from 'react';
import {
  useChannel,
  useParameter,
  useStorybookState,
  useStorybookApi,
} from '@storybook/api';

import SyntaxHighlighter from './SyntaxHighlighter';
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/github-gist';
import { format as prettierFormat } from 'prettier/standalone';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';

/**
 * Go through an object tree and convert repeat-args to an array
 * @param {Record<string, any> | undefined} item
 */
function searchTree(item) {
  let newObject = { ...item };
  if (item) {
    const keys = Object.keys(item);
    if (keys.length > 0) {
      if (keys.includes('repeat-count')) {
        newObject = [];
        // Put the object in the array `repeat-count` times
        const count = item['repeat-count'];
        for (let i = 0; i < count; i++) {
          delete item['repeat-count'];
          newObject.push(item);
        }
      }

      for (const key of keys) {
        if (typeof newObject[key] === 'object') {
          newObject[key] = searchTree(newObject[key]);
        }
      }
    }
  }
  return newObject;
}

const HTMLPanel = () => {
  const state = useStorybookState();
  // const api = useStorybookApi();

  const id = state.storyId;

  let importText = '';

  const story = state.storiesHash[id];
  if (story) {
    const componentParts = story.kind.split('/');
    const componentName = componentParts[componentParts.length - 1];

    // Turn args to a proper object
    const normalizedArgs = {};
    const entries = Object.entries(story.args);
    for (const [key, item] of entries) {
      // Don't include bookshop-reserved keys
      if (key !== 'framework') {
        if (key.includes('&&')) {
          const items = key.split('&&');
          normalizedArgs[items[0]] = {
            ...normalizedArgs[items[0]],
            [items[1]]: item,
          };
        } else {
          normalizedArgs[key] = item;
        }
      }
    }

    // Handle repeat-count in storybook
    const repeatedArgs = searchTree(normalizedArgs);

    importText = `component("${componentName.toLowerCase()}", ${JSON.stringify(
      repeatedArgs,
    )})`;
  }

  return (
    <SyntaxHighlighter
      language={'js'}
      copyable={true}
      padded={true}
      style={style}
      showLineNumbers={true}
      wrapLines={false}
    >
      {`<%- ${prettier
        .format(importText, { semi: false, parser: 'babel', plugins: [parser] })
        .replace(/[\r\n]+$/, '')} %>`}
    </SyntaxHighlighter>
  );
};

export default HTMLPanel;
