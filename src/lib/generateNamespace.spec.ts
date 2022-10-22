import * as path from "path";
import * as assert from "assert";
import generateNamespace from "./generateNamespace";

describe("generateNamespace", () => {
  it("should generate namespace with project file name and their directory structure", () => {
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
});
