const assert = require('assert');
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('votre-nom.odoo-xml-python-formatter'));
    });

    test('Extension should activate', async () => {
        const extension = vscode.extensions.getExtension('votre-nom.odoo-xml-python-formatter');
        await extension.activate();
        assert.ok(extension.isActive);
    });

    test('Commands should be registered', async () => {
        const commands = await vscode.commands.getCommands(true);

        assert.ok(commands.includes('odoo-xml-python-formatter.formatDocument'));
        assert.ok(commands.includes('odoo-xml-python-formatter.formatSelection'));
    });

    test('Should detect code tags in XML', () => {
        const xmlContent = fs.readFileSync(
            path.join(__dirname, '..', 'fixtures', 'sample.xml'),
            'utf8'
        );

        // Cette fonction devrait être exportée du module principal pour les tests
        const hasCodeTags = (text) => /<code\b[^>]*>[\s\S]*?<\/code>/i.test(text);

        assert.ok(hasCodeTags(xmlContent));
    });
});