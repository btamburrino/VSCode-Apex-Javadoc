'use strict';
/**
 * The workhorse function that parses the method signature and generates the Snippet
 * 
 * @export
 * @param {string} str The line that we are parsing
 * @param {boolean} needWhitespace TRUE if we need to add whitespace, FALSE if we don't
 * @returns {string} TODO: @bobby 
 */
export default function parseFunc(str: string, needWhitespace: boolean): string {
    let whitespace;
    let firstChar = '';

    // If we need whitespace, find out how much. We also need to add the first slash as a character since it won't already be typed.
    if (needWhitespace) {
        const whitespaceRE = new RegExp(/^[\s\t]+/);
        whitespace = whitespaceRE.test(str) ? whitespaceRE.exec(str) : '';
        firstChar = '/';
    } else {
        whitespace = '';
    }

    const methodSplit = str.split(/[\s\t]/);
    let hasReturn = true;
    let methodName;
    let lastResult;

    // Find the name of the method. We are tokenizing by a space.
    for (let thisStr of methodSplit) {
        const paren = thisStr.indexOf('(');
        if (paren === 0) {
            // If the paren is at 0 of this token, then the method name is the previous token (the user typed "myFunc ()")
            methodName = lastResult;
            break;
        } else if (paren > 0) {
            // If the paren is greater than 0 of this token, then the method name is in this token (the user typed "myFunc()")
            methodName = thisStr.substr(0, paren);
            break;
        } else if (thisStr.toLowerCase() === 'void') {
            // If this token is the word void, there is no return parameter, so we don't need to show that part of the javadoc.
            hasReturn = false;
        }
        // We store this token so we can access it on the next pass if needed.
        lastResult = thisStr;
    }

    if (methodName === undefined) {
        return '';
    }

    let variableList = new Array();
    let maxSize = 0;
    const variableRE = new RegExp('\(([^)]+)\)');

    // If there are variables, this extracts the list of them.
    if (variableRE.test(str)) {
        const varStr = variableRE.exec(str)[1];

        const varSplit = varStr.split(',');

        // We tokenize by the comma.
        for (let thisStr of varSplit) {
            // Trimming any whitespace in this token
            const thisVar = thisStr.trim().split(' ');
            // If this is a valid variable with two words in it, add it to the array.
            if (thisVar.length === 2) {
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
    let comment = `${whitespace}${firstChar}**\n${whitespace} * \${1:${methodName} description}\n`;

    // The padding is a string that is a bunch of spaces equal to the maximum size of the variable.
    const padding = Array(maxSize).join(' ');
    let snippetNum = 2;
    for (let varName of variableList) {
        // No need to import any right-pad node libraries here!
        let padStr = (varName + padding).substring(0, maxSize);
        comment += `${whitespace} * @param  ${padStr} \${${snippetNum}:${varName} description}\n`;
        snippetNum++;
    }
    // If we DIDN'T find the word "void" in the method signature, show the return line
    if (hasReturn) {
        comment += `${whitespace} * @return  ${padding} \${${snippetNum}:return description}\n`;
    }
    comment += `${whitespace} */`;
    return comment;

}