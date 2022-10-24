import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import findProjectFile from '../../lib/findProjectFile';
import generateNamespace from '../../lib/generateNamespace';
import createCsFile from '../../lib/createCsFile';
import csharpKeywords from './csharpKeywords';

const newCsFileCommandHandler = async (uri: vscode.Uri | undefined = undefined) => {
  if (
    !vscode.workspace.workspaceFolders ||
    0 === (vscode.workspace.workspaceFolders?.length ?? 0)
  ) {
    vscode.window.showInformationMessage(`Please open your workspace`);
    return;
  }

  const currentWorkspaceFolder = vscode.workspace.workspaceFolders[0];
  let currentWorkspaceFolderUri = uri || currentWorkspaceFolder.uri;

  if (!currentWorkspaceFolderUri && vscode.window.activeTextEditor) {
    currentWorkspaceFolderUri = vscode.window.activeTextEditor.document.uri;
  }

  var selectedItems = await vscode.window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    defaultUri: currentWorkspaceFolderUri,
    title: 'Select directory',
  });

  if (!selectedItems) {
    vscode.window.showInformationMessage(`Cancelled`);
    return;
  }

  const selectedDirectory = selectedItems[0];

  if (!selectedDirectory) {
    vscode.window.showInformationMessage(`Cancelled`);
    return;
  }

  // vscode.window.showInformationMessage(`${selectedDirectory.path}`);

  const projFile = findProjectFile(selectedDirectory.path, currentWorkspaceFolder.uri.path);

  const namespace = generateNamespace(projFile, selectedDirectory.path);

  // vscode.window.showInformationMessage(`namespace: ${namespace}`);

  const nameInputBox = vscode.window.createInputBox();
  nameInputBox.title = 'Class name';
  nameInputBox.placeholder = 'Class name';
  nameInputBox.onDidChangeValue((value: string) => {
    let validationMessage: string | vscode.InputBoxValidationMessage | undefined;

    const classNameRegexp = /^[A-Za-z][A-Za-z0-9_]*$/g;

    if (!value?.trim() ?? '') {
      validationMessage = {
        message: 'Class name is required',
        severity: vscode.InputBoxValidationSeverity.Error,
      };
    } else if (csharpKeywords.includes(value)) {
      validationMessage = {
        message:
          'Class file names must not be reserved words. [C# keywords](https://en.wikibooks.org/wiki/C_Sharp_Programming/Keywords)',
        severity: vscode.InputBoxValidationSeverity.Error,
      };
    } else if (/^[a-z]*$/g.test(value)) {
      validationMessage = {
        message: 'Class file name might be better start with Capital character.',
        severity: vscode.InputBoxValidationSeverity.Info,
      };
    } else if (classNameRegexp.test(value)) {
      validationMessage = undefined;
    } else {
      validationMessage = {
        message: 'Class file name should be matched with /^[A-Za-z][A-Za-z0-9_]*$/g',
        severity: vscode.InputBoxValidationSeverity.Error,
      };
    }

    if (!validationMessage) {
      const filePath = vscode.Uri.parse(path.join(selectedDirectory.path, `${value}.cs`));

      const exists = fs.existsSync(filePath.path);
      if (exists) {
        validationMessage = {
          message: 'File name is already exists.',
          severity: vscode.InputBoxValidationSeverity.Error,
        };
      }
    }

    nameInputBox.validationMessage = validationMessage;
  });
  nameInputBox.onDidAccept(() => {
    let validationMessage = '';

    if (nameInputBox.validationMessage) {
      const inputBoxValidationMessage =
        nameInputBox.validationMessage as vscode.InputBoxValidationMessage;

      if (
        inputBoxValidationMessage &&
        inputBoxValidationMessage.severity === vscode.InputBoxValidationSeverity.Error
      ) {
        validationMessage = inputBoxValidationMessage.message;
      }

      if (typeof nameInputBox.validationMessage === 'string') {
        validationMessage = nameInputBox.validationMessage;
      }
    }

    if (validationMessage) {
      vscode.window.showErrorMessage(validationMessage);
    } else {
      const className = nameInputBox.value;

      if (!className) {
        vscode.window.showErrorMessage('Class name is required');
        return;
      }

      const filePath = vscode.Uri.parse(path.join(selectedDirectory.path, `${className}.cs`));

      const exists = fs.existsSync(filePath.path);
      if (exists) {
        vscode.window.showErrorMessage('File name is already exists');
        return;
      }
      createCsFile(filePath.path, namespace, className);

      vscode.workspace.openTextDocument(vscode.Uri.file(filePath.fsPath)).then(document => {
        vscode.window.showTextDocument(document);

        const edit = new vscode.WorkspaceEdit();

        return vscode.workspace.applyEdit(edit).then(success => {
          if (success) {
            vscode.window.showInformationMessage(
              `new cs file [${className}] created at ${filePath.path}`,
            );
          } else {
            vscode.window.showErrorMessage(`Fail to create new cs file`);
          }
        });
      });

      nameInputBox.hide();
      nameInputBox.dispose();
    }
  });
  nameInputBox.show();
};

export default newCsFileCommandHandler;
