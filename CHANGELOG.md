# Changelog

All notable changes to the "odoo-xml-python-formatter" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.1] - 2025-07-12

### Added

-   Initial release
-   Automatic Python code formatting in XML `<code>` tags on save
-   Manual formatting commands for document and selection
-   Configurable autopep8 arguments
-   Context menu integration
-   Command palette integration
-   Debug logging option
-   Support for custom autopep8 arguments

### Features

-   ✅ Auto-detect `<code>` tags in XML files
-   ✅ Format Python code using autopep8
-   ✅ Format on save (configurable)
-   ✅ Manual formatting commands
-   ✅ Selection-based formatting
-   ✅ Configurable formatting options
-   ✅ Error handling and user feedback

### Technical

-   Uses @xmldom/xmldom for XML parsing
-   Integrates with autopep8 via child_process
-   Temporary file handling for Python code processing
-   Comprehensive error handling
