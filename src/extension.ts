'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    //console.log('Congratulations, your extension "apex-javadoc" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    // Right-click menu or Command Menu invocation
    let disposable = vscode.commands.registerCommand('force.apexJavadoc', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // We have no editor!
        }

        // Get the line that we are currently on
        const lineNum = editor.selection.active.line;
        var funcLine = editor.document.lineAt(lineNum);

        // If the line starts with a @, then it's a @AuraEnabled or @RemoteAction and look at the next line
        var currLine = lineNum;
        while (funcLine.text.trim().startsWith('@')) {
            currLine++;
            funcLine = editor.document.lineAt(currLine);
        }

        // If the line is not empty, parse it and add in a snippet on the line above.
        if (!funcLine.isEmptyOrWhitespace) {
            const parsed = parseFunc(currLine, true);
            const position = new vscode.Position(lineNum, 0);
            // If empty, return a non-whitepsaced aligned blank javadoc.
            // Not ideal, but only occurs when using the right-click context action on a class definition
            const snippet = (parsed === '') ? '/**\n * \n */' : parsed;
            editor.insertSnippet(new vscode.SnippetString(`${snippet}\n`), position);
        }
    });
    context.subscriptions.push(disposable);

    // Register a Completion Item Provider for when the user types the beginning of a comment
    vscode.commands.registerCommand('force.apexJavadocCompletion', (position: vscode.Position) => apexJavadocCompletion(position));
    let provider = {
        provideCompletionItems(document, position) {
            const thisLine = document.lineAt(position.line).text;
			if (thisLine.indexOf('/**') === -1) {
				return Promise.resolve(undefined);
			}
			let item = new vscode.CompletionItem('/** */', vscode.CompletionItemKind.Snippet);
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
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('apex', provider, '*'));
}

// this method is called when your extension is deactivated
export function deactivate() {
}

/**
 * Completion Item version of the force.apexJavadoc command
 * @param position Current position of the cursor
 */
function apexJavadocCompletion(position: vscode.Position): Thenable<boolean> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // We have no editor!
    }

    // Get the NEXT line from where we are
    const lineNum = position.line + 1;
    var funcLine = editor.document.lineAt(lineNum);

    // If the line starts with a @, then it's a @AuraEnabled or @RemoteAction and look at the next line
    var currLine = lineNum;
    while (funcLine.text.trim().startsWith('@')) {
        currLine++;
    }

    const parsed = parseFunc(currLine, false);
    var comment;
    if (parsed === '') {
        // If the parsing function returned nothing, return a simple Javadoc snippet respecting the trailing close comment setting
        comment = '\n * $0\n';
        const showTrailing = vscode.workspace.getConfiguration().get('force.showApexJavadocTrailingCloseComment');
        if (showTrailing === true) {
            comment += ' */';
        }
    } else {
        comment = parsed;
    }
    const snippet = new vscode.SnippetString(comment);
    return editor.insertSnippet(snippet, position, {undoStopBefore: false, undoStopAfter: false});
}

/**
 * The workhorse function that parses the method signature and generates the Snippet
 * @param startingLine The line number that we are parsing
 * @param needWhitespace TRUE if we need to add whitespace, FALSE if we don't - also acts as a way to tell if used from right-click context menu or not
 */
export function parseFunc(startingLine: number, needWhitespace: boolean) {
    var whitespace;
    var firstChar = '';

    if ((startingLine === undefined) || (startingLine === null)) {
        return '';
    }

    // Get the entire function definition - even if it spans multiple lines!
    const editor = vscode.window.activeTextEditor;
    var lineNum = startingLine;
    var str = editor.document.lineAt(lineNum).text;
    while (str.indexOf(')') === -1) {
        lineNum++;
        str += editor.document.lineAt(lineNum).text;
    }

    // If we need whitespace, find out how much. We also need to add the first slash as a character since it won't already be typed.
    if (needWhitespace) {
        const whitespaceRE = new RegExp(/^[\s\t]+/);
        whitespace = whitespaceRE.test(str) ? whitespaceRE.exec(str) : '';
        firstChar = '/**';
    } else {
        whitespace = '';
    }

    const methodSplit = str.split(/[\s\t]/);
    var hasReturn = true;
    var methodName;
    var lastResult;

    // Find the name of the method. We are tokenizing by a space.
    for (let thisStr of methodSplit) {
        const paren = thisStr.indexOf('(');
        if (paren == 0) {
            // If the paren is at 0 of this token, then the method name is the previous token (the user typed "myFunc ()")
            methodName = lastResult;
            break;
        } else if (paren > 0) {
            // If the paren is greater than 0 of this token, then the method name is in this token (the user typed "myFunc()")
            methodName = thisStr.substr(0, paren);
            break;
        } else if (thisStr.toLowerCase() == 'void') {
            // If this token is the word void, there is no return parameter, so we don't need to show that part of the javadoc.
            hasReturn = false;
        }
        // We store this token so we can access it on the next pass if needed.
        lastResult = thisStr;
    }

    if (methodName === undefined) {
        return '';
    }

    var variableList = new Array();
    var maxSize = 0;
    const variableRE = new RegExp(/\(([^)]+)\)/);

    // If there are variables, this extracts the list of them.
    if (variableRE.test(str)) {
        const varStr = variableRE.exec(str)[1];

        const varSplit = varStr.split(',');

        // We tokenize by the comma.
        for (let thisStr of varSplit) {
            // Trimming any whitespace in this token
            const thisVar = thisStr.trim().split(' ');
            // If this is a valid variable with two words in it, add it to the array.
            if (thisVar.length == 2) {
                variableList.push(thisVar[1]);
                // We're keeping track of the maximum length of the variables so we can format nicely
                if (thisVar[1].length > maxSize) {
                    maxSize = thisVar[1].length;
                }
            }
        }
    }

    /* This is me printing everything out to the console during development.
    console.log('Method: ' + methodName);
    console.log('Has Return: ' + hasReturn);
    console.log('Variables:');
    console.log(variableList);
    console.log('Max Size: ' + maxSize);*/

    // Generating the Snippet as a string.
    var comment = `${whitespace}${firstChar}\n${whitespace} * \${1:${methodName} description}\n`;

    // The padding is a string that is a bunch of spaces equal to the maximum size of the variable.
    const padding = Array(maxSize).join(' ');
    var snippetNum = 2;
    for (let varName of variableList) {
        // No need to import any right-pad node libraries here!
        var padStr = (varName + padding).substring(0, maxSize);
        comment += `${whitespace} * @param  ${padStr} \${${snippetNum}:${varName} description}\n`;
        snippetNum++;
    }
    // If we DIDN'T find the word "void" in the method signature, show the return line
    if (hasReturn) {
        comment += `${whitespace} * @return  ${padding} \${${snippetNum}:return description}\n`;
    }
    comment += `${whitespace}`;

    // Some installations of VSCode add the final */ to the javadoc comment and some don't.
    const showTrailing = vscode.workspace.getConfiguration().get('force.showApexJavadocTrailingCloseComment');
    if ((needWhitespace === true) || (showTrailing === true)) {
        comment += ` */`;
    }

    return comment;
}