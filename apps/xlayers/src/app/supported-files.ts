/**
 * Object that contains information about file types xlayers is compatible with
 */
const compatibleFiles = [
  {
    name: 'Sketch App',
    extension: '.sketch',
    logo: '/assets/supported/sketch.svg',
    supportedVersions: [49, 50, 51, 52, 53, 59],
  },
];

/**
 * It returns information related to file, based on it's extension
 * @param fileName the file's complete name (extension included)
 */
export function getFileData(fileName: string) {
  const fileExtension = fileName.includes('.')
    ? `.${fileName.split('.').pop()}`
    : ''; // get file's extension with a point at the begining
  const name = fileName.replace(fileExtension, ''); // extract file's name without the extension
  const compatible = compatibleFiles.find(
    ({ extension }) => fileExtension === extension
  ) || { logo: '' }; // get information related to the file based on the extension
  return { name, logo: compatible.logo, extension: fileExtension }; //for the moment, minimum data is returned
}
