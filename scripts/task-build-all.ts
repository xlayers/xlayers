import { runTask } from './utils';

import { buildAllLibraries } from './build-all-libraries';

runTask('Building library', async () => await buildAllLibraries());
