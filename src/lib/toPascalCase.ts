const toPascalCase = function (input: string): string {
  if (/[^\s\w-_]/g.test(input)) {
    throw new Error('Support alphanumeric character only');
  }

  return input
    .replace(/[-_]+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+(.)(\w*)/g, ($1, $2, $3) => `${$2.toUpperCase() + $3}`)
    .replace(/\w/, s => s.toUpperCase());
};

export default toPascalCase;
