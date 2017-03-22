import * as assert from 'assert';
import * as vscode from 'vscode';
import parseFunc from '../src/commands/parseFunc';

// Defines a Mocha test suite to group tests of similar kind together
suite('Extension Tests', () => {
    test('can Parse empty string', () => {
        let comment = parseFunc('', false);
        assert.equal('', comment);
    });
});