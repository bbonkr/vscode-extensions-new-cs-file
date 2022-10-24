# New CS File

<!--
![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/bbonkr.kr-bbon-vscode-plugins-newcsfile?style=for-the-badge)
-->

[![Latest release](https://img.shields.io/github/v/release/bbonkr/vscode-extensions-new-cs-file?style=for-the-badge)](https://marketplace.visualstudio.com/items?itemName=bbonkr.kr-bbon-vscode-plugins-newcsfile)

[![Build and tag](https://github.com/bbonkr/vscode-extensions-new-cs-file/actions/workflows/build-and-tag.yml/badge.svg)](https://github.com/bbonkr/vscode-extensions-new-cs-file/actions/workflows/build-and-tag.yml) [![create release](https://github.com/bbonkr/vscode-extensions-new-cs-file/actions/workflows/create-release.yml/badge.svg)](https://github.com/bbonkr/vscode-extensions-new-cs-file/actions/workflows/create-release.yml) [![Publish vscode extension](https://github.com/bbonkr/vscode-extensions-new-cs-file/actions/workflows/publish-vscode-extension.yml/badge.svg)](https://github.com/bbonkr/vscode-extensions-new-cs-file/actions/workflows/publish-vscode-extension.yml)

## Features

Create new cs file with namespace.

- Namespace generates from csproj file name or references DefaultNamespace element in csproj file.

<!--

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.
-->

![example](./assets/example.gif)

### Namespace generates

Namespace composites project file (.csproj) name and directory structure where file created.

The base of namespace is decided with project file name or DefaultNamespace in project file.

## Limitations

Directory and file name in your workspace should be alphanumeric characters.

## Release Notes

### 0.1.5

- Prevent overwrite a file #24

### 0.1.4

- Update README.md; Add example animation file. 🫣

### 0.1.3

- Extension verify to work .
- CI/CD workflows verify.

---
