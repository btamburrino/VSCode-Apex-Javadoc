'use strict';
import * as vscode from 'vscode';
export default class JavaDocProvider implements vscode.CompletionItemProvider {
    public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.CompletionItem[]> {
        let item = new vscode.CompletionItem('/**', vscode.CompletionItemKind.Snippet);
        item.detail = 'Apex Javadoc Comment';
        item.insertText = '';
        item.command = {
            title: 'Apex Javadoc Comment',
            command: 'force.apexJavadocCompletion',
            arguments: [position]
        };
        return Promise.resolve([item]);
    }
}