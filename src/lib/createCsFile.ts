import * as fs from 'fs';

function createCsFile(
  filePath: string,
  namespace: string,
  className: string,
  useFileScopedNamespace = false,
): boolean {
  try {
    const normalizedFilePath = filePath.normalize();

    const exists = fs.existsSync(filePath);

    if (exists) {
      return false;
    }

    let document = '';

    if (useFileScopedNamespace) {
      document = `namespace ${namespace.normalize()}; 

public class ${className.normalize()}
{
		
}
`;
    } else {
      document = `namespace ${namespace.normalize()} 
{
  public class ${className.normalize()}
  {
		
  }
}
`;
    }

    fs.writeFileSync(normalizedFilePath, document, { encoding: 'utf-8' });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export default createCsFile;
