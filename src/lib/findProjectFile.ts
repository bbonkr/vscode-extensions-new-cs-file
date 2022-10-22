import * as path from "path";
import * as fs from "fs";

/**
 * Find project file (.csproj)
 * @param current
 * @returns
 */
function findProjectFile(current: string, workspacePath: string): string {
  // vscode.window.showInformationMessage(`current: ${current}`);

  const files = fs.readdirSync(current);
  const targetFiles = files
    .filter((file) => file.endsWith(".csproj") || file.endsWith(".sln"))
    .sort((file) => (file.endsWith(".csproj") ? -1 : 1));

  for (const file of targetFiles) {
    if (file.endsWith(".sln")) {
      throw new Error("Could not find .csproj file");
    }

    if (file.endsWith(".csproj")) {
      return path.join(current, file);
    }
  }
  if (current === workspacePath) {
    throw new Error(
      "Could not find csproj file or sln file in your workspace. Navigate only inside the workspace."
    );
  }
  const parent = path.resolve(current, "..");

  return findProjectFile(parent, workspacePath);
}

export default findProjectFile;
