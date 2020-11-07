import { environment } from '../environments/environment';

/**
 * Object that contains information about file types xlayers is compatible with
 */
const compatibleFiles = [
  {
    name: 'Sketch App',
    extension: '.sketch',
    icon: '/assets/supported/sketch.svg',
    supportedVersions: environment.demoFiles.map(({ value }) => value),
  },
];

/**
 * It returns information related to file, based on it's extension and version
 * @param fileName the file's complete name (extension included)
 */
export function getFileData(fileName: string, appVersion: string) {
  const fileExtension = fileName.includes('.')
    ? `.${fileName.split('.').pop()}`
    : ''; // get file's extension with a point at the begining
  const name = fileName.replace(fileExtension, ''); // extract file's name without the extension
  const compatible = compatibleFiles.find(
    ({ extension }) => fileExtension === extension
  ) || { icon: '' }; // get information related to the file based on the extension
  return { name, icon: compatible.icon, version: appVersion }; //for the moment, minimum data is returned
}
