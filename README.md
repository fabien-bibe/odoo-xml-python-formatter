# Odoo XML Python Formatter

Une extension VS Code qui formate automatiquement le code Python contenu dans les balises `<code>` des fichiers XML Odoo.

## 🚀 Fonctionnalités

- ✅ **Formatage automatique** : Formate le code Python lors de l'enregistrement des fichiers XML
- ✅ **Détection intelligente** : Détecte automatiquement les balises `<code>` dans vos fichiers XML
- ✅ **Intégration autopep8** : Utilise autopep8 pour un formatage Python de qualité
- ✅ **Commandes manuelles** : Formatage à la demande via la palette de commandes
- ✅ **Configuration flexible** : Options personnalisables pour autopep8
- ✅ **Support de sélection** : Formate uniquement la partie sélectionnée

## 📋 Prérequis

Avant d'utiliser cette extension, vous devez installer `autopep8` :

```bash
pip install autopep8
```

Ou avec conda :
```bash
conda install autopep8
```

## 🔧 Installation

### Depuis le Marketplace VS Code

1. Ouvrez VS Code
2. Allez dans l'onglet Extensions (`Ctrl+Shift+X`)
3. Recherchez "Odoo XML Python Formatter"
4. Cliquez sur "Install"

### Installation manuelle

1. Téléchargez le fichier `.vsix` depuis les [releases GitHub](https://github.com/votre-username/odoo-xml-python-formatter/releases)
2. Dans VS Code, ouvrez la palette de commandes (`Ctrl+Shift+P`)
3. Tapez "Extensions: Install from VSIX..."
4. Sélectionnez le fichier téléchargé

### Depuis les sources

```bash
git clone https://github.com/votre-username/odoo-xml-python-formatter.git
cd odoo-xml-python-formatter
npm install
npm run package
code --install-extension odoo-xml-python-formatter-0.0.1.vsix
```

## 📖 Utilisation

### Formatage automatique

L'extension formate automatiquement le code Python lors de l'enregistrement des fichiers `.xml` qui contiennent des balises `<code>`.

**Exemple :**

Avant :
```xml
<record id="example" model="ir.actions.server">
    <field name="code">
        <code>
def action():
x=1
if x>0:
print("positive")
return x
        </code>
    </field>
</record>
```

Après :
```xml
<record id="example" model="ir.actions.server">
    <field name="code">
        <code>
def action():
    x = 1
    if x > 0:
        print("positive")
    return x
        </code>
    </field>
</record>
```

### Commandes manuelles

- **Ctrl+Shift+P** → "Format Python Code in XML" : Formate tout le document
- **Ctrl+Shift+P** → "Format Selected Python Code in XML" : Formate la sélection
- **Clic droit** dans un fichier XML → "Format Python Code in XML"

## ⚙️ Configuration

Accédez aux paramètres VS Code (`Ctrl+,`) et recherchez "Odoo XML Python Formatter" :

### `odoo-xml-python-formatter.formatOnSave`
- **Type** : `boolean`
- **Défaut** : `true`
- **Description** : Active le formatage automatique lors de l'enregistrement

### `odoo-xml-python-formatter.autopep8Args`
- **Type** : `array`
- **Défaut** : `["--max-line-length=79", "--aggressive", "--aggressive"]`
- **Description** : Arguments passés à autopep8

### `odoo-xml-python-formatter.enableLogging`
- **Type** : `boolean`
- **Défaut** : `false`
- **Description** : Active les logs de débogage dans la console

### Exemple de configuration personnalisée

```json
{
    "odoo-xml-python-formatter.formatOnSave": true,
    "odoo-xml-python-formatter.autopep8Args": [
        "--max-line-length=88",
        "--aggressive",
        "--experimental"
    ],
    "odoo-xml-python-formatter.enableLogging": true
}
```

## 🎯 Cas d'usage typiques

Cette extension est particulièrement utile pour :

- **Développement Odoo** : Formatage du code Python dans les vues XML
- **Actions serveur** : Code Python dans les `ir.actions.server`
- **Rapports QWeb** : Code Python dans les templates
- **Données de démonstration** : Scripts Python dans les fichiers de données

## 🐛 Résolution de problèmes

### autopep8 non trouvé

**Erreur** : `autopep8 n'est pas installé`

**Solution** :
```bash
pip install autopep8
# Ou vérifiez que autopep8 est dans votre PATH
which autopep8  # Linux/Mac
where autopep8  # Windows
```

### Formatage incorrect

1. Activez les logs de débogage dans les paramètres
2. Consultez la console de développement (`Help > Toggle Developer Tools`)
3. Vérifiez que votre code Python est syntaxiquement correct

### Performance

Pour de gros fichiers XML, le formatage peut prendre quelques secondes. Vous pouvez :
- Désactiver le formatage automatique
- Utiliser le formatage manuel sur sélection

## 🤝 Contribution

Les contributions sont les bienvenues ! 

### Développement local

```bash
git clone https://github.com/votre-username/odoo-xml-python-formatter.git
cd odoo-xml-python-formatter
npm install
```

Puis appuyez sur `F5` dans VS Code pour lancer une nouvelle fenêtre avec l'extension en développement.

### Tests

```bash
npm test
```

### Signaler un bug

Ouvrez une [issue GitHub](https://github.com/votre-username/odoo-xml-python-formatter/issues) avec :
- Version de VS Code
- Version de l'extension
- Exemple de fichier XML problématique
- Message d'erreur complet

## 📝 Changelog

Voir [CHANGELOG.md](CHANGELOG.md) pour l'historique des versions.

## 📄 Licence

MIT License - voir [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- [autopep8](https://github.com/hhatto/autopep8) pour le formatage Python
- [xmldom](https://github.com/xmldom/xmldom) pour le parsing XML
- La communauté Odoo pour l'inspiration

---

**Astuce** : Pour une meilleure expérience, combinez cette extension avec d'autres extensions Odoo comme "Odoo Snippets" ou "XML Tools".