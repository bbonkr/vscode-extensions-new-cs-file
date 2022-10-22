import * as path from 'path';
import * as fs from 'fs';
import * as xmldom from '@xmldom/xmldom';
import * as xpath from 'xpath';
import toPascalCase from './toPascalCase';

const getDefaultNamespaceFromCsproj = (content: string): string | undefined => {
  const parser = new xmldom.DOMParser();
  const xmlDoc = parser.parseFromString(content);

  const node = xpath.select('string(//DefaultNamespace)', xmlDoc, true);

  return node?.toString() ?? '';
};

/**
 * Generate namespace from using project file and current path.
 *
 * @param projFilePath
 * @param currentPath
 * @returns
 */
const generateNamespace = (projFilePath: string, currentPath: string): string => {
  const baseUri = path.dirname(projFilePath);
  const projFileExt = path.extname(projFilePath);
  const projFileName = path.basename(projFilePath, projFileExt);

  let namespaceBase = projFileName;

  const content = fs.readFileSync(projFilePath, { encoding: 'utf-8' });
  const defaultNamespaceValue = getDefaultNamespaceFromCsproj(content);
  if (defaultNamespaceValue) {
    namespaceBase = defaultNamespaceValue;
  }

  let currentRelativeUri = path.relative(baseUri, currentPath);

  const replaceRegExp = new RegExp(`${path.sep}`, 'g');
  let namespace = currentRelativeUri.replace(replaceRegExp, '.');

  if (namespace) {
    namespace = namespace
      .split('.')
      .filter(t => Boolean(t))
      .map(t => toPascalCase(t))
      .join('.');

    namespace = `.${namespace}`;
  }

  return `${namespaceBase}${namespace}`;
};

export default generateNamespace;
