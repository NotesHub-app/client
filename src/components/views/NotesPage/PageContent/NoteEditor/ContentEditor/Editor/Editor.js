import React from 'react';
import AceEditor from 'react-ace';
import * as _ from 'lodash';
import 'brace/mode/markdown';
import 'brace/theme/github';
import { Button } from '@blueprintjs/core';
import SizeMe from '@avinlab/react-size-me';
import styles from './styles.module.scss';
import { getNoteFileLink } from '../../../../../../../utils/data';

class CodeEditor extends React.Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        // Ресайзим вручную
        if (this.props.width !== nextProps.width || this.props.height !== nextProps.height) {
            const { editor } = this.aceEditorComponent;

            const editorEl = document.getElementById('editor');

            editorEl.style.width = `${nextProps.width}px`;
            editorEl.style.height = `${nextProps.height}px`;

            editor.resize();

            return false;
        }

        return true;
    }

    componentDidMount() {
        const { onEditorMount } = this.props;
        onEditorMount();
    }

    render() {
        const { width, height, onEditorMount, editorRef, ...editorProps } = this.props;

        return (
            <AceEditor
                {...editorProps}
                width={`${width}px`}
                height={`${height}px`}
                ref={i => {
                    this.aceEditorComponent = i;
                    editorRef(i);
                }}
            />
        );
    }
}

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
        if (nextProps.noteId === this.props.noteId) {
            // Ререндим только если обновился внешний индекс изменений
            return nextProps.externalChangesIndex !== this.props.externalChangesIndex;
        }
        return true;
    }

    handleEditorMount = () => {
        const { editor } = this.reactAceComponent;
        editor.renderer.setScrollMargin(5, 5);

        document.querySelector('.ace_editor').addEventListener('paste', this.handleContentPasteClick);
    };

    componentWillUnmount() {
        document.querySelector('.ace_editor').removeEventListener('paste', this.handleContentPasteClick);
    }

    handleContentPasteClick = async event => {
        const { noteId, uploadNoteFile } = this.props;
        const { editor } = this.reactAceComponent;

        const { items } = event.clipboardData || event.originalEvent.clipboardData;
        for (const item of items) {
            if (item.kind === 'file') {
                const fileObj = item.getAsFile();

                // Добавляем в имя файла цифровой идентификатор для уникальности имени
                const fileName = fileObj.name.replace(/(\.[\w\d_-]+)$/i, `_${new Date().getTime()}$1`);

                const uploadedFile = await uploadNoteFile({ noteId, fileObj, fileName });

                // Вставляем в редактор ссылку на файл
                editor.session.insert(editor.getCursorPosition(), getNoteFileLink(uploadedFile));
            }
        }
    };

    handleFocusEditor = () => {
        const { editor } = this.reactAceComponent;
        editor.focus();
    };

    handleToolbarContentAction = actionType => {
        const { editor } = this.reactAceComponent;

        let selectedText = editor.getSelectedText();
        const isSeleted = !!selectedText;
        let startSize = 2;
        let initText = '';
        const range = editor.selection.getRange();
        switch (actionType) {
            case 'bold':
                initText = 'Bold Text';
                selectedText = `**${selectedText || initText}**`;
                break;
            case 'italic':
                initText = 'Italic Text';
                selectedText = `*${selectedText || initText}*`;
                startSize = 1;
                break;
            case 'underline':
                initText = 'Italic Text';
                selectedText = `<u>${selectedText || initText}</u>`;
                startSize = 1;
                break;
            case 'strikethrough':
                initText = 'Italic Text';
                selectedText = `~~${selectedText || initText}~~`;
                startSize = 1;
                break;
            case 'header':
                initText = 'Heading';
                selectedText = `# ${selectedText || initText}`;
                break;
            case 'quote':
                initText = 'quote';
                selectedText = `> ${selectedText || initText}`;
                break;
            case 'link':
                selectedText = `[${selectedText || ''}](http://)`;
                startSize = 1;
                break;
            case 'image':
                selectedText = `![${selectedText || ''}](http://)`;
                break;
            case 'list':
                selectedText = `- ${selectedText || initText}`;
                break;
            case 'numbered-list':
                selectedText = `1. ${selectedText || initText}`;
                startSize = 3;
                break;
            case 'code':
                initText = 'Source Code';
                selectedText = `\`\`\`language\r\n${selectedText || initText}\r\n\`\`\``;
                startSize = 3;
                break;
            default:
        }
        editor.session.replace(range, selectedText);
        if (!isSeleted) {
            range.start.column += startSize;
            range.end.column = range.start.column + initText.length;
            editor.selection.setRange(range);
        }
        editor.focus();
    };

    render() {
        const {
            input: { value },
        } = this.props;

        return (
            <div className={styles.root}>
                <div className={styles.toolbar}>
                    <div>
                        <Button
                            minimal
                            small
                            icon="bold"
                            className="margin-right-5"
                            onClick={() => this.handleToolbarContentAction('bold')}
                        />
                        <Button
                            minimal
                            small
                            icon="italic"
                            className="margin-right-5"
                            onClick={() => this.handleToolbarContentAction('italic')}
                        />
                        <Button
                            minimal
                            small
                            icon="underline"
                            className="margin-right-5"
                            onClick={() => this.handleToolbarContentAction('underline')}
                        />
                        <Button
                            minimal
                            small
                            icon="strikethrough"
                            className="margin-right-5"
                            onClick={() => this.handleToolbarContentAction('strikethrough')}
                        />
                    </div>
                    <div className="separator" />
                    <div>
                        <Button
                            minimal
                            small
                            icon="header"
                            className="margin-right-5"
                            onClick={() => this.handleToolbarContentAction('header')}
                        />
                        <Button
                            minimal
                            small
                            icon="properties"
                            className="margin-right-5"
                            onClick={() => this.handleToolbarContentAction('list')}
                        />
                        <Button
                            minimal
                            small
                            icon="numbered-list"
                            className="margin-right-5"
                            onClick={() => this.handleToolbarContentAction('numbered-list')}
                        />
                    </div>
                    <div className="separator" />
                    <div>
                        <Button
                            minimal
                            small
                            icon="citation"
                            className="margin-right-5"
                            onClick={() => this.handleToolbarContentAction('quote')}
                        />
                        <Button
                            minimal
                            small
                            icon="code"
                            className="margin-right-5"
                            onClick={() => this.handleToolbarContentAction('code')}
                        />
                    </div>
                    <div className="separator" />
                    <div>
                        <Button
                            minimal
                            small
                            icon="media"
                            className="margin-right-5"
                            onClick={() => this.handleToolbarContentAction('image')}
                        />
                        <Button
                            minimal
                            small
                            icon="link"
                            className="margin-right-5"
                            onClick={() => this.handleToolbarContentAction('link')}
                        />
                    </div>
                </div>
                <div className={styles.editorContainer} onClick={this.handleFocusEditor}>
                    <SizeMe>
                        {({ width, height }) => (
                            <CodeEditor
                                editorRef={i => {
                                    this.reactAceComponent = i;
                                }}
                                onEditorMount={this.handleEditorMount}
                                value={value}
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
                                    // highlightActiveLine: false,
                                }}
                                width={width}
                                height={height}
                            />
                        )}
                    </SizeMe>
                </div>
            </div>
        );
    }
}
