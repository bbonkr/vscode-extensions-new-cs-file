import * as vscode from 'vscode';
import findProjectFile from '../../lib/findProjectFile';

const showNewCsFileContextMenuCommandHandler = async (
  uri: vscode.Uri | undefined = undefined,
): Promise<boolean> => {
  console.log('showNewCsFileContextMenuCommandHandler', uri?.path);

  if (
    !vscode.workspace.workspaceFolders ||
    0 === (vscode.workspace.workspaceFolders?.length ?? 0)
  ) {
    //   vscode.window.showInformationMessage(`Please open your workspace`);
    return false;
  }

  if (!uri) {
    return false;
  }

  const currentWorkspaceFolder = vscode.workspace.workspaceFolders[0];

  const projFile = findProjectFile(uri.path, currentWorkspaceFolder.uri.path);

  return Boolean(projFile);
};

export default showNewCsFileContextMenuCommandHandler;
