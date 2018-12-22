import React from 'react';
import prism from 'prismjs';

export default class CodeRenderer extends React.PureComponent {
    render() {
        const { value } = this.props;
        let { language } = this.props;

        language = prism.languages[language || 'markup'] || prism.languages.markup;

        if(value === undefined){
            return <span />
        }
        return (
            <pre>
                <code dangerouslySetInnerHTML={{ __html: prism.highlight(value, language) }} />
            </pre>
        );
    }
}
