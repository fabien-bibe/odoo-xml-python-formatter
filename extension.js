const vscode = require('vscode');
const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const os = require('os');

const execAsync = promisify(exec);

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Extension "odoo-xml-python-formatter" est maintenant active');

    // Commande pour formater le document entier
    const formatDocumentCommand = vscode.commands.registerCommand(
        'odoo-xml-python-formatter.formatDocument',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'xml') {
                await formatXmlDocument(editor);
            }
        }
    );

    // Commande pour formater la sélection
    const formatSelectionCommand = vscode.commands.registerCommand(
        'odoo-xml-python-formatter.formatSelection',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'xml') {
                await formatXmlSelection(editor);
            }
        }
    );

    // Événement de sauvegarde
    const onDidSaveDocument = vscode.workspace.onDidSaveTextDocument(async (document) => {
        const config = vscode.workspace.getConfiguration('odoo-xml-python-formatter');
        const formatOnSave = config.get('formatOnSave', true);

        if (formatOnSave && document.languageId === 'xml') {
            const editor = vscode.window.visibleTextEditors.find(
                e => e.document.uri.toString() === document.uri.toString()
            );
            
            if (editor) {
                await formatXmlDocument(editor, false); // false = pas de message de succès
            }
        }
    });

    context.subscriptions.push(
        formatDocumentCommand,
        formatSelectionCommand,
        onDidSaveDocument
    );
}

/**
 * Formate tout le document XML
 */
async function formatXmlDocument(editor, showMessage = true) {
    try {
        const document = editor.document;
        const text = document.getText();
        
        if (!hasCodeTags(text)) {
            if (showMessage) {
                vscode.window.showInformationMessage('Aucune balise <code> trouvée dans le fichier.');
            }
            return;
        }

        const formattedText = await formatPythonInXml(text);
        
        if (formattedText !== text) {
            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(text.length)
            );

            await editor.edit(editBuilder => {
                editBuilder.replace(fullRange, formattedText);
            });

            if (showMessage) {
                vscode.window.showInformationMessage('Code Python formaté avec succès !');
            }
        } else if (showMessage) {
            vscode.window.showInformationMessage('Aucune modification nécessaire.');
        }
    } catch (error) {
        logError('Erreur lors du formatage du document', error);
        vscode.window.showErrorMessage(`Erreur lors du formatage: ${error.message}`);
    }
}

/**
 * Formate la sélection dans le document XML
 */
async function formatXmlSelection(editor) {
    try {
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        
        if (!selectedText) {
            vscode.window.showInformationMessage('Veuillez sélectionner du texte à formater.');
            return;
        }

        if (!hasCodeTags(selectedText)) {
            vscode.window.showInformationMessage('Aucune balise <code> trouvée dans la sélection.');
            return;
        }

        const formattedText = await formatPythonInXml(selectedText);
        
        if (formattedText !== selectedText) {
            await editor.edit(editBuilder => {
                editBuilder.replace(selection, formattedText);
            });
            vscode.window.showInformationMessage('Sélection formatée avec succès !');
        } else {
            vscode.window.showInformationMessage('Aucune modification nécessaire.');
        }
    } catch (error) {
        logError('Erreur lors du formatage de la sélection', error);
        vscode.window.showErrorMessage(`Erreur lors du formatage: ${error.message}`);
    }
}

/**
 * Vérifie si le texte contient des balises <code>
 */
function hasCodeTags(text) {
    return /<code\b[^>]*>[\s\S]*?<\/code>/i.test(text);
}

/**
 * Formate le code Python dans les balises <code> du XML
 */
async function formatPythonInXml(xmlText) {
    try {
        // Utilisation d'expressions régulières pour traiter les balises <code>
        // car xmldom peut avoir des problèmes avec du XML malformé
        const codeTagRegex = /<code\b[^>]*>([\s\S]*?)<\/code>/gi;
        let formattedXml = xmlText;
        let match;
        const promises = [];

        // Collecte toutes les correspondances d'abord
        const matches = [];
        while ((match = codeTagRegex.exec(xmlText)) !== null) {
            matches.push({
                fullMatch: match[0],
                pythonCode: match[1],
                index: match.index
            });
        }

        // Traite chaque balise <code>
        for (const matchInfo of matches) {
            const pythonCode = matchInfo.pythonCode.trim();
            
            if (pythonCode) {
                try {
                    const formattedPython = await formatPythonCode(pythonCode);
                    const newCodeTag = matchInfo.fullMatch.replace(
                        matchInfo.pythonCode,
                        '\n' + formattedPython + '\n            '
                    );
                    formattedXml = formattedXml.replace(matchInfo.fullMatch, newCodeTag);
                } catch (formatError) {
                    logError(`Erreur lors du formatage du code Python`, formatError);
                    // Continue avec les autres balises même si une échoue
                }
            }
        }

        return formattedXml;
    } catch (error) {
        logError('Erreur lors du parsing XML', error);
        throw error;
    }
}

/**
 * Formate le code Python en utilisant autopep8
 */
async function formatPythonCode(pythonCode) {
    const config = vscode.workspace.getConfiguration('odoo-xml-python-formatter');
    const autopep8Args = config.get('autopep8Args', ['--max-line-length=79', '--aggressive', '--aggressive']);
    
    // Créer un fichier temporaire
    const tempDir = os.tmpdir();
    const tempFile = path.join(tempDir, `temp_${Date.now()}.py`);
    
    try {
        // Écrire le code Python dans le fichier temporaire
        fs.writeFileSync(tempFile, pythonCode, 'utf8');
        
        // Construire la commande autopep8
        const args = autopep8Args.join(' ');
        const command = `autopep8 ${args} "${tempFile}"`;
        
        logDebug(`Exécution de la commande: ${command}`);
        
        // Exécuter autopep8
        const { stdout, stderr } = await execAsync(command);
        
        if (stderr) {
            logError('Erreur autopep8', stderr);
        }
        
        return stdout || pythonCode; // Retourne le code original si pas de sortie
        
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new Error('autopep8 n\'est pas installé. Installez-le avec: pip install autopep8');
        }
        logError('Erreur lors de l\'exécution d\'autopep8', error);
        throw error;
    } finally {
        // Nettoyer le fichier temporaire
        try {
            if (fs.existsSync(tempFile)) {
                fs.unlinkSync(tempFile);
            }
        } catch (cleanupError) {
            logError('Erreur lors du nettoyage du fichier temporaire', cleanupError);
        }
    }
}

/**
 * Log d'erreur
 */
function logError(message, error) {
    const config = vscode.workspace.getConfiguration('odoo-xml-python-formatter');
    const enableLogging = config.get('enableLogging', false);
    
    if (enableLogging) {
        console.error(`[Odoo XML Python Formatter] ${message}:`, error);
    }
}

/**
 * Log de débogage
 */
function logDebug(message) {
    const config = vscode.workspace.getConfiguration('odoo-xml-python-formatter');
    const enableLogging = config.get('enableLogging', false);
    
    if (enableLogging) {
        console.log(`[Odoo XML Python Formatter] ${message}`);
    }
}

/**
 * Cette méthode est appelée quand l'extension est désactivée
 */
function deactivate() {
    console.log('Extension "odoo-xml-python-formatter" désactivée');
}

module.exports = {
    activate,
    deactivate
};