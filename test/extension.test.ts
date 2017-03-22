import * as assert from 'assert';
import * as vscode from 'vscode';
import * as myExtension from '../src/extension';

// Defines a Mocha test suite to group tests of similar kind together
suite('Extension Tests', () => {
    let baseExtension: vscode.Extension<any>;

    setup(() => {
        baseExtension = vscode.extensions.getExtension('btamburrino.apex-javadoc');
        assert.notEqual(undefined, baseExtension);
    });

    test('Extension can activate', () => {
        return baseExtension.activate()
            .then((res) => {
                assert.equal(true, res);
            });
    });
});