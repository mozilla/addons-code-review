import * as React from 'react';
import { Store } from 'redux';
import { storiesOf } from '@storybook/react';

import { LinterMessage, actions } from '../src/reducers/linter';
import longFileSample from './fixtures/long-file-sample';
import CodeOverview from '../src/components/CodeOverview';
import CodeView from '../src/components/CodeView';
import configureStore from '../src/configureStore';
import { JS_SAMPLE } from './CodeView.stories';
import { createInternalVersion } from '../src/reducers/versions';
import {
  createFakeExternalLinterResult,
  fakeVersion,
  fakeVersionFile,
  fakeVersionEntry,
} from '../src/test-helpers';
import { newLinterMessageUID, renderWithStoreAndRouter } from './utils';

const render = ({
  content = JS_SAMPLE,
  messages = [],
  store = configureStore(),
}: {
  store?: Store;
  content?: string;
  messages?: Partial<LinterMessage>[];
} = {}) => {
  let version = createInternalVersion(fakeVersion);

  if (messages.length) {
    const path = 'background.js';
    version = createInternalVersion({
      ...fakeVersion,
      file: {
        ...fakeVersionFile,
        entries: { [path]: { ...fakeVersionEntry, path } },
        // eslint-disable-next-line @typescript-eslint/camelcase
        selected_file: path,
      },
    });

    const result = createFakeExternalLinterResult({
      messages: messages.map((msg) => {
        return { uid: newLinterMessageUID(), ...msg, file: path };
      }),
    });

    store.dispatch(actions.loadLinterResult({ versionId: version.id, result }));
  }

  return renderWithStoreAndRouter(
    <div className="CodeOverview-container">
      <div>
        <CodeView
          content={content}
          mimeType="application/javascript"
          version={version}
        />
      </div>
      <CodeOverview content={content} version={version} />
    </div>,
    store,
  );
};

storiesOf('CodeOverview', module)
  .add('short file', () => {
    return render({ content: JS_SAMPLE });
  })
  .add('long file', () => {
    return render({ content: longFileSample });
  })
  .add('long file with messages', () => {
    return render({
      content: longFileSample,
      messages: [
        {
          line: 27,
          type: 'warning',
          message: 'Use of console.log() detected',
          description: ['This call to console.log() is pretty much Okay.'],
        },
        {
          line: 66,
          type: 'notice',
          message: 'Bizarre use of undefined',
          description: ["...but I guess it's fine"],
        },
        {
          line: 151,
          type: 'error',
          message: 'Use of queryTabs() is not permitted',
          description: [
            'Calls to queryTabs() will not work in a future version',
          ],
        },
      ],
    });
  });
