import log from 'loglevel';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import ContentShell from '../../components/FullscreenGrid/ContentShell';
import { gettext } from '../../utils';
import styles from './styles.module.scss';

export type PublicProps = {};

export type DefaultProps = {
  _log: typeof log;
  allowErrorSimulation: boolean;
  showLocalDevLinks: boolean;
};

type Props = PublicProps & DefaultProps;

export class IndexBase extends React.Component<Props> {
  static defaultProps = {
    _log: log,
    allowErrorSimulation:
      process.env.REACT_APP_UNSAFE_ERROR_SIMULATION === 'true',
    showLocalDevLinks: process.env.REACT_APP_IS_LOCAL_DEV === 'true',
  };

  canSimulateErrors() {
    const { _log, allowErrorSimulation } = this.props;

    if (allowErrorSimulation) {
      return true;
    }

    _log.warn(
      'Not simulating errors because REACT_APP_UNSAFE_ERROR_SIMULATION=false.',
    );
    return false;
  }

  logAnError = () => {
    const { _log } = this.props;
    if (this.canSimulateErrors()) {
      _log.error('This is a simulated error message');
    }
  };

  throwAnError = () => {
    if (this.canSimulateErrors()) {
      throw new Error('This is a simulated error');
    }
  };

  render() {
    const { allowErrorSimulation, showLocalDevLinks } = this.props;

    const apiHost = process.env.REACT_APP_API_HOST;
    const repoUrl = 'https://github.com/mozilla/addons-code-manager';

    return (
      <ContentShell>
        <p>
          {gettext(
            'This is a tool for managing add-on source code that is used with the',
          )}{' '}
          <a href={`${apiHost}/reviewers/`}>{gettext('Reviewers Tools')}</a>.
        </p>
        <p>
          {gettext(`🚧 This project is under active development. If you find a
            bug, please`)}{' '}
          <a href={`${repoUrl}/issues/new`}>{gettext('file an issue')}</a>.
        </p>
        <p>{gettext('Other useful links:')}</p>
        <ul>
          <li>
            <a href={apiHost}>{gettext('AMO (frontend)')}</a>
          </li>
          <li>
            <a href={`${apiHost}/developers/`}>{gettext('Developer Hub')}</a>
          </li>
          <li>
            <a href={repoUrl}>{gettext('GitHub repository')}</a>
          </li>
        </ul>
        {showLocalDevLinks && (
          <React.Fragment>
            <hr />
            <p>{gettext('Dev links (only shown in local dev):')}</p>
            <ul>
              <li>
                <Link to="/en-US/browse/494431/versions/1532144/">
                  a browse page
                </Link>
              </li>
              <li>
                <Link to="/en-US/compare/502955/versions/1541794...1541798/">
                  a compare page
                </Link>
              </li>
              <li>
                <Link to="/en-US/browse/502955/versions/1000000/">
                  a browse page that will generate an error
                </Link>
              </li>
            </ul>
          </React.Fragment>
        )}
        {allowErrorSimulation && (
          <React.Fragment>
            <hr />
            <p>
              {gettext(
                'Error Simulation (REACT_APP_UNSAFE_ERROR_SIMULATION=true):',
              )}
            </p>
            <p>
              {gettext('💣 Click a button and check the developer console 💥')}
            </p>
            <div className={styles.errorSimulationButtons}>
              <Button
                className={styles.throwAnErrorButton}
                onClick={this.throwAnError}
                variant="danger"
              >
                {gettext('Throw an error')}
              </Button>
              <Button
                className={styles.logAnErrorButton}
                onClick={this.logAnError}
                variant="danger"
              >
                {gettext('Log an error')}
              </Button>
            </div>
          </React.Fragment>
        )}
      </ContentShell>
    );
  }
}

export default IndexBase;
