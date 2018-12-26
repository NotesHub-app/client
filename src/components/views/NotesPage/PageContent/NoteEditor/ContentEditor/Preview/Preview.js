import React from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import classNames from 'classnames';
import config from '../../../../../../../config';
import CodeRenderer from './CodeRenderer';
import LinkRenderer from './LinkRenderer';
import mainStyles from '../styles.module.scss';
import styles from './styles.module.scss';
import AutoScrollButton from '../AutoScrollButton';

export class NotePreview extends React.Component {
    componentDidMount() {
        window.addEventListener('app:scrollEditor', this.handleScrollPreview);
    }

    handleScrollPreview = e => {
        const { position } = e.detail;
        // console.log(`I have to scroll to ${  position}`);

        let nearDistance = Infinity;
        let nearestElement;
        const markdownBodyEl = this.areaMainContainer.childNodes[0];

        // Отслеживаем самый близкий к верху элемент с атрибутом data-sourcepos
        markdownBodyEl.childNodes.forEach(node => {
            if (node.dataset.sourcepos) {
                const nodePosition = node.dataset.sourcepos.match(/[\d]+/)[0];

                const distance = Math.abs(nodePosition - position);
                if (distance < nearDistance) {
                    nearestElement = node;
                    nearDistance = distance;
                }
            }
        });
        if (nearestElement) {
            // console.log(nearestElement);
            this.areaMainContainer.scrollTop = nearestElement.offsetTop;
        }
    };

    componentWillUnmount() {
        window.removeEventListener('app:scrollEditor', this.handleScrollPreview);
    }

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

    handleScroll = e => {
        const { autoScroll } = this.props;
        // Должна быть включена кнопка авто-скрола
        if (!autoScroll) {
            return;
        }

        const { scrollTop } = e.currentTarget;

        let nearDistance = Infinity;
        let nearestElement;
        const markdownBodyEl = this.areaMainContainer.childNodes[0];

        // Отслеживаем самый близкий к верху элемент с атрибутом data-sourcepos
        markdownBodyEl.childNodes.forEach(node => {
            if (node.dataset.sourcepos) {
                const distance = Math.abs(scrollTop - node.offsetTop);

                if (distance < nearDistance) {
                    nearestElement = node;
                    nearDistance = distance;
                }
            }
        });

        if (nearestElement && nearestElement.dataset.sourcepos) {
            const event = new CustomEvent('app:scrollPreview', {
                detail: {
                    position: Number(nearestElement.dataset.sourcepos.match(/[\d]+/)[0]),
                },
            });
            window.dispatchEvent(event);
        }
    };

    render() {
        const {
            input: { value },
        } = this.props;

        return (
            <div className={mainStyles.areaInner}>
                <div className={mainStyles.toolbar}>
                    <div className="toolbarFiller" />
                    <div>
                        <AutoScrollButton />
                    </div>
                </div>
                <div
                    className={mainStyles.areaMainContainer}
                    onScroll={this.handleScroll}
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
