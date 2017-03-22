'use strict';
import * as vscode from 'vscode';
import subscriptions from './subscriptions';

/**
 * Activate function: the thing that runs when the extension's activation event occurs
 * 
 * @export 
 * @param {vscode.ExtensionContext} context 
 * @returns void
 */
export function activate(context: vscode.ExtensionContext): void {
    subscriptions().map(disposable => context.subscriptions.push(disposable));
}
