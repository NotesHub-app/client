import React from 'react';
import AceEditor from 'react-ace';
import * as _ from 'lodash';
import styles from './styles.module.scss';
import 'brace/mode/markdown';
import 'brace/theme/github';

export default class Editor extends React.Component {
    setContent = _.debounce(content => {
        const {
            input: { onChange },
        } = this.props;

        onChange(content);
    }, 100);

    handleChange = content => {
        if (this.fromSetValue) {
            return;
        }
        this.setContent(content);
    };

    shouldComponentUpdate(nextProps) {
        return nextProps.noteId !== this.props.noteId;
    }

    componentDidUpdate(prevProps) {
        const {
            input: { value },
        } = this.props;
        if (prevProps.noteId !== this.props.noteId) {
            this.fromSetValue = true;
            this.reactAceComponent.editor.setValue(value, 1);
            this.fromSetValue = false;
        }
    }

    componentDidMount() {
        const {editor} = this.reactAceComponent;
        editor.renderer.setScrollMargin(5, 5);
        editor.container.style.lineHeight = 1.5
        editor.renderer.updateFontSize()
    }

    render() {
        const {
            input: { value },
        } = this.props;

        return (
            <div className={styles.root}>
                <AceEditor
                    ref={i => {
                        this.reactAceComponent = i;
                    }}
                    width="100%"
                    height="100%"
                    defaultValue={value}
                    fontSize={14}
                    mode="markdown"
                    theme="github"
                    onChange={this.handleChange}
                    showGutter={false}
                    name="editor"
                    editorProps={{ $blockScrolling: true }}
                    setOptions={{
                        showPrintMargin: false,
                        fontFamily: 'Ubuntu Monospace',
                        fontSize: '12pt',
                        highlightActiveLine: false,
                    }}
                />
            </div>
        );
    }
}
