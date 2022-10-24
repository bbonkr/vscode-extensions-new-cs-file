import * as fs from 'fs';

function createCsFile(filePath: string, namespace: string, className: string): boolean {
  try {
    const normalizedFilePath = filePath.normalize();

    const exists = fs.existsSync(filePath);

    if (exists) {
      return false;
    }

    fs.writeFileSync(
      normalizedFilePath,
      `namespace ${namespace.normalize()} 
{
	public class ${className.normalize()}
	{
		
	}
}
`,
      { encoding: 'utf-8' },
    );

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export default createCsFile;
