import React from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import classNames from 'classnames';
import config from '../../../../../../../config';
import CodeRenderer from './CodeRenderer';
import LinkRenderer from './LinkRenderer';
import mainStyles from '../styles.module.scss';
import styles from './styles.module.scss';

export class NotePreview extends React.Component {
    componentDidMount() {
        window.addEventListener('app:scrollEditor', this.scrollPreview);
    }

    componentWillUnmount() {
        window.removeEventListener('app:scrollEditor', this.scrollPreview);
    }

    scrollPreview = e => {
        const { autoScroll } = this.props;
        if (!autoScroll) {
            return;
        }

        const { position } = e.detail;
        if (!this.areaMainContainer) {
            return;
        }

        let nearDistance = Infinity;
        let nearestElement;

        // Отслеживаем самый близкий к верху элемент с атрибутом data-sourcepos
        document.querySelectorAll('[data-sourcepos]').forEach(node => {
            const nodePosition = node.dataset.sourcepos.match(/[\d]+/)[0];

            const distance = Math.abs(nodePosition - position);
            if (distance < nearDistance) {
                nearestElement = node;
                nearDistance = distance;
            }
        });
        if (nearestElement) {
            this.areaMainContainer.scrollTop = nearestElement.offsetTop - 30;
        }
    };

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
            <div className={mainStyles.areaInner}>
                <div className={mainStyles.toolbar}>
                    <div className="toolbarFiller" />
                </div>
                <div
                    className={mainStyles.areaMainContainer}
                    ref={i => {
                        this.areaMainContainer = i;
                    }}
                >
                    <ReactMarkdown
                        className={classNames('markdown-body', styles.previewArea)}
                        source={value}
                        transformImageUri={this.transformUri}
                        transformLinkUri={this.transformUri}
                        renderers={{
                            code: CodeRenderer,
                            codeBlock: CodeRenderer,
                            link: LinkRenderer,
                        }}
                        sourcePos
                    />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        fileToken: state.user.get('fileToken'),
        autoScroll: state.uiSettings.get('autoScroll'),
    };
}

export default connect(
    mapStateToProps,
    {},
)(NotePreview);
