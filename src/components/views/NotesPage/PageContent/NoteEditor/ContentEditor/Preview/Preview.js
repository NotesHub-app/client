import React from 'react';
import marked from 'marked';
import prism from 'prismjs';
import classNames from 'classnames';
import styles from './styles.module.scss';

export default class NotePreview extends React.Component {
    render() {
        const {
            input: { value },
        } = this.props;

        let htmlContent = '';
        if (value) {
            htmlContent = marked(value, {
                highlight: (code, lang) => {
                    const language = prism.languages[lang || 'markup'] || prism.languages.markup;
                    return prism.highlight(code, language);
                },
            });
        }

        return (
            <div
                className={classNames('markdown-body', styles.root)}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        );
    }
}
