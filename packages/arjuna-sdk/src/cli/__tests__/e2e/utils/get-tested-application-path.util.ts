import path from 'path';

export const getTestedApplicationPath = (relativePath: string): string => {
  const arjunaAppsPath = path.resolve(
    __dirname,
    '../../../../../../arjuna-apps',
  );

  return path.join(arjunaAppsPath, relativePath);
};
