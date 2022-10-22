import * as fs from 'fs';

function createCsFile(filePath: string, namespace: string, className: string): boolean {
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
      { encoding: 'utf-8' },
    );

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export default createCsFile;
