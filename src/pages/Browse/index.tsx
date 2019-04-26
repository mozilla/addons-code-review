import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import log from 'loglevel';

import { ApplicationState } from '../../reducers';
import { ConnectedReduxProps } from '../../configureStore';
import { ApiState } from '../../reducers/api';
import CodeOverview from '../../components/CodeOverview';
import { ContentShell } from '../../components/FullscreenGrid';
import FileTree from '../../components/FileTree';
import {
  Version,
  VersionFile,
  fetchVersion,
  fetchVersionFile,
  getVersionFile,
  getVersionInfo,
  isFileLoading,
  viewVersionFile,
} from '../../reducers/versions';
import { gettext, getPathFromQueryString } from '../../utils';
import Loading from '../../components/Loading';
import CodeView from '../../components/CodeView';
import FileMetadata from '../../components/FileMetadata';
import ImageView from '../../components/ImageView';
import styles from './styles.module.scss';

export type PublicProps = {};

export type DefaultProps = {
  _fetchVersion: typeof fetchVersion;
  _fetchVersionFile: typeof fetchVersionFile;
  _log: typeof log;
  _viewVersionFile: typeof viewVersionFile;
};

type PropsFromRouter = {
  addonId: string;
  versionId: string;
};

type PropsFromState = {
  apiState: ApiState;
  file: VersionFile | null | void;
  fileIsLoading: boolean;
  version: Version | void | null;
};

export type Props = RouteComponentProps<PropsFromRouter> &
  PropsFromState &
  PublicProps &
  DefaultProps &
  ConnectedReduxProps;

export class BrowseBase extends React.Component<Props> {
  static defaultProps = {
    _fetchVersion: fetchVersion,
    _fetchVersionFile: fetchVersionFile,
    _log: log,
    _viewVersionFile: viewVersionFile,
  };

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate() {
    this.loadData();
  }

  loadData() {
    const {
      _fetchVersion,
      _fetchVersionFile,
      dispatch,
      file,
      fileIsLoading,
      history,
      match,
      version,
    } = this.props;

    const path = getPathFromQueryString(history);

    if (version === null) {
      // An error has occured when fetching the version.
      return;
    }

    if (version === undefined) {
      const { addonId, versionId } = match.params;

      dispatch(
        _fetchVersion({
          addonId: parseInt(addonId, 10),
          versionId: parseInt(versionId, 10),
          path: path || undefined,
        }),
      );
      return;
    }

    if (version.selectedPath && !fileIsLoading && file === undefined) {
      dispatch(
        _fetchVersionFile({
          addonId: parseInt(match.params.addonId, 10),
          versionId: version.id,
          path: version.selectedPath,
        }),
      );
    }
  }

  viewVersionFile = (path: string) => {
    const { _viewVersionFile, dispatch, match } = this.props;
    const { versionId } = match.params;

    dispatch(
      _viewVersionFile({
        versionId: parseInt(versionId, 10),
        selectedPath: path,
        // When selecting a new file to view, we do not want to preserve the
        // hash in the URL (this hash highlights a specific line of code).
        preserveHash: false,
      }),
    );
  };

  render() {
    const { file, version } = this.props;

    if (!version) {
      return (
        <ContentShell>
          <Loading message={gettext('Loading version...')} />
        </ContentShell>
      );
    }

    const getContent = () => {
      if (!file) {
        return <Loading message={gettext('Loading content...')} />;
      }
      if (file.type === 'image') {
        return <ImageView content={file.content} mimeType={file.mimeType} />;
      }
      return (
        <CodeView
          mimeType={file.mimeType}
          content={file.content}
          version={version}
        />
      );
    };

    return (
      <ContentShell
        mainSidePanel={
          <React.Fragment>
            <FileTree onSelect={this.viewVersionFile} versionId={version.id} />
            {file && (
              <Row>
                <Col className={styles.metadata}>
                  <FileMetadata file={file} />
                </Col>
              </Row>
            )}
          </React.Fragment>
        }
        altSidePanel={
          file ? (
            <CodeOverview content={file.content} version={version} />
          ) : null
        }
      >
        {getContent()}
      </ContentShell>
    );
  }
}

const mapStateToProps = (
  state: ApplicationState,
  ownProps: RouteComponentProps<PropsFromRouter>,
): PropsFromState => {
  const { match } = ownProps;
  const versionId = parseInt(match.params.versionId, 10);
  const version = getVersionInfo(state.versions, versionId);

  return {
    apiState: state.api,
    file: version
      ? getVersionFile(state.versions, versionId, version.selectedPath)
      : null,
    fileIsLoading: version
      ? isFileLoading(state.versions, versionId, version.selectedPath)
      : false,
    version,
  };
};

export default connect(mapStateToProps)(BrowseBase);
