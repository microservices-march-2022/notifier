import * as fs from "fs/promises";

const REGEX = /var\/lib\/docker\/containers\/(?<containerId>[a-z0-9]+)\//sm;

export default async function getContainerId() {
	try {
		const contents = await fs.readFile("/proc/self/mountinfo", "utf8");
    console.log("the contents: ", contents);
		const found = contents.match(REGEX);

		if (found && found.groups && found.groups.containerId) {
			return found.groups.containerId;
		} else {
			return null;
		}
	} catch (e) {
		if (e.code === "ENOENT") {
			return null;
		} else {
			throw e;
		}
	}
};
