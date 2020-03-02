import { cmd, runTask, packages } from "./utils";

export async function buildAllLibraries() {
  for (const pkg of packages) {
    try {
      // ORDER IS NEEDED FOR DEPS
      await cmd("ng", [`build ${pkg}`]);
      console.log(`BUILD DONE FOR: ${pkg}`);
    } catch (ex) {
      console.error(ex);
      process.exit(1);
    }
  }
  console.log("Done building!");
}
