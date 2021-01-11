import React from 'react';
import { AddonPanel } from '@storybook/components';
import { addons, types } from '@storybook/addons';
import prettier from 'prettier';
import { format as prettierFormat } from 'prettier/standalone';
import parser from 'prettier/parser-babel';

import Panel from './Panel';

const ADDON_ID = 'Bookshop';
const PANEL_ID = `${ADDON_ID}/panel`;

import {
  useChannel,
  useParameter,
  useStorybookState,
  useStorybookApi,
} from '@storybook/api';

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
        delete item['repeat-count'];
        for (let i = 0; i < count; i++) {
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

/**
 * A wrapper for the
 */
const LogicWrapper = (props) => {
  const state = useStorybookState();

  const id = state.storyId;

  let text = '';

  const story = state.storiesHash[id];
  console.log(story);
  if (story) {
    const componentParts = story.kind.replaceAll(' ', '-').split('/');
    const componentName = componentParts.slice(1).join('/');

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

    const importText = `component("${componentName.toLowerCase()}", ${JSON.stringify(
      repeatedArgs,
    )})`;

    text = prettier
      .format(importText, { semi: false, parser: 'babel', plugins: [parser] })
      .replace(/[\r\n]+$/, '');
  }

  return (
    <div>
      <AddonPanel active={props.active} key={props.key}>
        <Panel code={text} />
      </AddonPanel>
    </div>
  );
};

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    title: 'Bookshop',
    type: types.PANEL,
    render: ({ active, key }) => <LogicWrapper active={active} key={key} />,
  });
});
