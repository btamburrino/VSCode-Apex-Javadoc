'use strict';
import * as vscode from 'vscode';
import parseFunc from './parseFunc';
/**
 * Insert the JavaDoc snippet
 * 
 * @export
 * @returns void
 */
export default function apexJavadoc(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        // We have no editor! don't do anything
        return undefined;
    }

    let line = editor.document.lineAt(editor.selection.active.line);
    if (!line.isEmptyOrWhitespace) {
        let position = new vscode.Position(editor.selection.active.line, 0);
        editor.insertSnippet(new vscode.SnippetString(`${parseFunc(line.text, true)}\n`), position);
    }
}


