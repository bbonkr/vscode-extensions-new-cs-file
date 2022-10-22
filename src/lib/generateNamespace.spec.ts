import * as path from "path";
import * as assert from "assert";
import generateNamespace from "./generateNamespace";

describe("generateNamespace", () => {
  describe("# Type 1: .sln, csproj placed same directory", () => {
    it("should generate namespace with project file name and their directory structure #1 single level", () => {
      const projectFilePath = path.join(
        process.cwd(),
        "forTest/Type1/Sample.csproj"
      );
      const currentFilePath = path.join(process.cwd(), "forTest/Type1/Models");

      const generatedNamespace = generateNamespace(
        projectFilePath,
        currentFilePath
      );

      assert.equal(generatedNamespace, "Sample.Models");
    });

    it("should generate namespace with project file name and their directory structure #2 multiple level", () => {
      const projectFilePath = path.join(
        process.cwd(),
        "forTest/Type1/Sample.csproj"
      );
      const currentFilePath = path.join(
        process.cwd(),
        "forTest/Type1/Services/SampleServices"
      );

      const generatedNamespace = generateNamespace(
        projectFilePath,
        currentFilePath
      );

      assert.equal(generatedNamespace, "Sample.Services.SampleServices");
    });
  });

  describe("# Type 3: csproj has DefaultNamespace element", () => {
    it("should generate namespace with project default namespace and their directory structure #2", () => {
      const projectFilePath = path.join(
        process.cwd(),
        "forTest/Type3/src/Sample/Sample.csproj"
      );
      const currentFilePath = path.join(
        process.cwd(),
        "forTest/Type3/src/Sample/Models"
      );

      const generatedNamespace = generateNamespace(
        projectFilePath,
        currentFilePath
      );

      assert.equal(generatedNamespace, "Sample.T3.Models");
    });
  });
});
