// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

function findProjectFile(current: string): string {
  vscode.window.showInformationMessage(`current: ${current}`);
  const files = fs.readdirSync(current);
  for (const file of files) {
    if (file.endsWith(".sln")) {
      throw new Error("Could not find .csproj file");
    }

    if (file.endsWith(".csproj")) {
      return path.join(current, file);
    }
  }

  const parent = path.resolve(current, "..");

  return findProjectFile(parent);
}

function generateNamespace(projFilePath: string, currentPath: string): string {
  const baseUri = path.dirname(projFilePath);
  const projFileExt = path.extname(projFilePath);
  const projFileName = path.basename(projFilePath, projFileExt);

  let currentRelativeUri = path.relative(baseUri, currentPath);
  let namespace = currentRelativeUri.replace(path.sep, ".");

  if (namespace) {
    namespace = `.${namespace}`;
  }

  return `${projFileName}${namespace}`;
}

function createFile(
  filePath: string,
  namespace: string,
  className: string
): boolean {
  try {
    fs.writeFileSync(
      filePath,
      `namespace ${namespace} 
{
	public class ${className}
	{
		
	}
}
`,
      { encoding: "utf-8" }
    );

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "kr-bbon-vscode-plugins-newcsfile" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "kr-bbon-vscode-plugins-newcsfile.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from NewCsFile!");
    }
  );

  const newCsFileCommand = "krbbonvscodeextension.newCsFile";

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

    vscode.window.showInformationMessage(`${selectedDirectory.path}`);

    const projFile = findProjectFile(selectedDirectory.path);

    const namespace = generateNamespace(projFile, selectedDirectory.path);

    vscode.window.showInformationMessage(`namespace: ${namespace}`);

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

      createFile(filePath.fsPath, namespace, className);

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

  context.subscriptions.push(disposable);
  context.subscriptions.push(
    vscode.commands.registerCommand(newCsFileCommand, newCsFileCommandHandler)
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
