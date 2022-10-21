import * as path from "path";

/**
 * Generate namespace from using project file and current path.
 *
 * @param projFilePath
 * @param currentPath
 * @returns
 */
export default function generateNamespace(
  projFilePath: string,
  currentPath: string
): string {
  const baseUri = path.dirname(projFilePath);
  const projFileExt = path.extname(projFilePath);
  const projFileName = path.basename(projFilePath, projFileExt);

  let namespaceBase = projFileName;

  // TODO: If project has default namespace element, use it.

  let currentRelativeUri = path.relative(baseUri, currentPath);
  let namespace = currentRelativeUri.replace(path.sep, ".");

  if (namespace) {
    namespace = `.${namespace}`;
  }

  return `${namespaceBase}${namespace}`;
}
