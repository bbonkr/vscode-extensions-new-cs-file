import * as vscode from "vscode";
import * as path from "path";

import findProjectFile from "../../lib/findProjectFile";
import generateNamespace from "../../lib/generateNamespace";
import createCsFile from "../../lib/createCsFile";

const newCsFileCommandHandler = async (name: string = "HelloWorld") => {
  if (
    !vscode.workspace.workspaceFolders ||
    0 === (vscode.workspace.workspaceFolders?.length ?? 0)
  ) {
    vscode.window.showInformationMessage(`Please open your workspace`);
    return;
  }

  const currentWorkspaceFolder = vscode.workspace.workspaceFolders[0];
  let currentWorkspaceFolderUri = currentWorkspaceFolder.uri;

  if (vscode.window.activeTextEditor) {
    currentWorkspaceFolderUri = vscode.window.activeTextEditor.document.uri;
  }

  var selectedItems = await vscode.window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    defaultUri: currentWorkspaceFolderUri,
    title: "Select directory",
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

  const projFile = findProjectFile(
    selectedDirectory.path,
    currentWorkspaceFolder.uri.path
  );

  const namespace = generateNamespace(projFile, selectedDirectory.path);

  // vscode.window.showInformationMessage(`namespace: ${namespace}`);

  const nameInputBox = vscode.window.createInputBox();
  nameInputBox.title = "Class name";
  nameInputBox.placeholder = "Class name";
  nameInputBox.onDidAccept(() => {
    const className = nameInputBox.value;

    if (!className) {
      vscode.window.showErrorMessage("Class name is required");
      return;
    }

    vscode.window.showInformationMessage(`file name: ${className}`);
    // Do create file with namespace
    const filePath = vscode.Uri.parse(
      path.join(selectedDirectory.path, `${className}.cs`)
    );

    createCsFile(filePath.path, namespace, className);

    vscode.window.showInformationMessage(`File path: ${filePath}`);

    vscode.workspace
      .openTextDocument(vscode.Uri.file(filePath.fsPath))
      .then((document) => {
        vscode.window.showTextDocument(document);

        const edit = new vscode.WorkspaceEdit();

        return vscode.workspace.applyEdit(edit).then((success) => {
          if (success) {
            vscode.window.showInformationMessage(
              `new cs file created at ${filePath.path}`
            );
          } else {
            vscode.window.showErrorMessage(`Fail to create new cs file`);
          }
        });
      });

    nameInputBox.hide();
    nameInputBox.dispose();
  });
  nameInputBox.show();
};

export default newCsFileCommandHandler;
