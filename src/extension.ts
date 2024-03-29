import * as vscode from 'vscode';
import newCsFile from './features/newCsFile';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log('"kr-bbon-vscode-plugins-newcsfile" is now active!');

  context.subscriptions.push(vscode.commands.registerCommand(newCsFile.command, newCsFile.handler));
}

// This method is called when your extension is deactivated
export function deactivate() {}
