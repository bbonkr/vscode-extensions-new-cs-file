import * as path from "path";
import * as assert from "assert";
import findProjectFile from "./findProjectFile";

describe("findProjectFile", () => {
  const projectFileName = "Sample.csproj";

  describe("Correct", () => {
    it("should find csproj file #1", () => {
      const workspaceBase = "forTest/Type1";
      const currentPath = path.join(process.cwd(), `${workspaceBase}/Models`);
      const workspacePath = path.join(process.cwd(), workspaceBase);

      const projFilePath = findProjectFile(currentPath, workspacePath);

      assert.equal(
        projFilePath,
        path.join(process.cwd(), `${workspaceBase}/${projectFileName}`)
      );
    });

    it("should find csproj file #2", () => {
      const workspaceBase = "forTest/Type2";
      const currentPath = path.join(
        process.cwd(),
        `${workspaceBase}/src/Sample/Models`
      );
      const workspacePath = path.join(process.cwd(), workspaceBase);

      const projFilePath = findProjectFile(currentPath, workspacePath);

      assert.equal(
        projFilePath,
        path.join(
          process.cwd(),
          `${workspaceBase}/src/Sample/${projectFileName}`
        )
      );
    });

    it("should find csproj file #3", () => {
      const workspaceBase = "forTest/Type3";
      const currentPath = path.join(
        process.cwd(),
        `${workspaceBase}/src/Sample/Models`
      );
      const workspacePath = path.join(process.cwd(), workspaceBase);

      const projFilePath = findProjectFile(currentPath, workspacePath);

      assert.equal(
        projFilePath,
        path.join(
          process.cwd(),
          `${workspaceBase}/src/Sample/${projectFileName}`
        )
      );
    });
  });

  describe("incorrect", () => {
    it("should occur exception", () => {
      const workspaceBase = "";
      const currentPath = path.join(process.cwd(), `${workspaceBase}/src/lib`);
      const workspacePath = path.join(process.cwd(), workspaceBase);

      try {
        findProjectFile(currentPath, workspacePath);
      } catch (e) {
        const error = e as Error;
        if (error) {
          assert.equal(
            error.message,
            "Could not find csproj file or sln file in your workspace. Navigate only inside the workspace."
          );
        } else {
          throw e;
        }
      }
    });
  });
});
