import React from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import classNames from 'classnames';
import styles from './styles.module.scss';
import config from '../../../../../../../config';
import CodeRenderer from './CodeRenderer';
import LinkRenderer from './LinkRenderer';

export class NotePreview extends React.Component {
    transformUri = uri => {
        const { fileToken } = this.props;

        // Трансформируем file:// урлы на директСсылка к атаченным файлам
        if (uri && uri.startsWith('file://')) {
            const matchRes = uri.match(/file:\/\/(.*)/);
            if (matchRes) {
                uri = `${config.apiUrl}/directDownload/${matchRes[1]}?token=${fileToken}`;
            }
        }
        return uri;
    };

    render() {
        const {
            input: { value },
        } = this.props;

        return (
            <ReactMarkdown
                className={classNames('markdown-body', styles.root)}
                source={value}
                transformImageUri={this.transformUri}
                transformLinkUri={this.transformUri}
                renderers={{
                    code: CodeRenderer,
                    codeBlock: CodeRenderer,
                    link: LinkRenderer,
                }}
            />
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        fileToken: state.user.get('fileToken'),
    };
}

export default connect(
    mapStateToProps,
    {},
)(NotePreview);
