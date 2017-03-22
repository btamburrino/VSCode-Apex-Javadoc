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
export function activate(context: vscode.ExtensionContext): boolean {
    try {
        subscriptions().map(disposable => context.subscriptions.push(disposable));
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
