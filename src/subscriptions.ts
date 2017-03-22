'use strict';
import * as vscode from 'vscode';
import apexJavadoc from './commands/apexJavadoc';
import apexJavadocCompletion from './commands/apexJavadocCompletion';
import apexJavadocProvider from './providers/apexJavadocProvider';

/**
 * Registers the commands and completion provider
 * 
 * @export
 * @returns {vscode.Disposable[]} 
 */
export default function subscriptions(): vscode.Disposable[] {
    return [
        vscode.commands.registerCommand('force.apexJavadoc', apexJavadoc),
        vscode.commands.registerCommand('force.apexJavadocCompletion', apexJavadocCompletion),
        vscode.languages.registerCompletionItemProvider('apex', new apexJavadocProvider(), '*'),
    ];
}