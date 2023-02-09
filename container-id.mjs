import * as fs from "fs/promises";

const REGEX = /var\/lib\/docker\/containers\/(?<containerId>[a-z0-9]+)\//sm;

export async function readIt() {
	const contents = await fs.readFile("./blub.txt", "utf8");
	const { groups: result } = contents.match(REGEX);

	if (result.containerId) {
		return result.containerId;
	} else {
		return null;
	}
}