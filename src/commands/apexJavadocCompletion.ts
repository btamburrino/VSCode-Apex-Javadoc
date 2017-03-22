'use strict';
import * as vscode from 'vscode';
import parseFunc from './parseFunc';
/**
 * Completion Item version of the force.apexJavadoc command
 * @param position Current position of the cursor
 */
export default function apexJavadocCompletion(position: vscode.Position): Thenable<boolean> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // We have no editor!
    }
    // Get the NEXT line from where we are
    const parsed = parseFunc(editor.document.lineAt(position.line + 1).text, false);
    // If the parsing function returned nothing, return a simple Javadoc snippet
    const snippet = parsed ? new vscode.SnippetString(parsed) : new vscode.SnippetString('\n * $0\n */');
    return editor.insertSnippet(snippet, position, {undoStopBefore: false, undoStopAfter: false});
}