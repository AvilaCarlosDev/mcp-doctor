import type { DoctorCheck, ToolInfo } from "./types.js";

const TOOL_NAME_PATTERN = /^[a-zA-Z0-9_-]{1,128}$/;

export function checkToolCatalog(tools: ToolInfo[]): DoctorCheck[] {
	const checks: DoctorCheck[] = [];

	if (tools.length === 0) {
		checks.push({
			id: "tools.empty",
			title: "No tools exposed",
			severity: "warn",
			message: "The server connected successfully but did not expose any tools.",
		});
		return checks;
	}

	checks.push({
		id: "tools.present",
		title: "Tools available",
		severity: "pass",
		message: `The server exposes ${tools.length} tool${tools.length === 1 ? "" : "s"}.`,
	});

	const names = new Set<string>();
	const duplicates = new Set<string>();
	for (const tool of tools) {
		if (names.has(tool.name)) duplicates.add(tool.name);
		names.add(tool.name);
	}

	if (duplicates.size > 0) {
		checks.push({
			id: "tools.duplicate_names",
			title: "Duplicate tool names",
			severity: "fail",
			message: "Tool names must be unique.",
			details: [...duplicates],
		});
	} else {
		checks.push({
			id: "tools.unique_names",
			title: "Unique tool names",
			severity: "pass",
			message: "All tool names are unique.",
		});
	}

	const invalidNames = tools.filter((tool) => !TOOL_NAME_PATTERN.test(tool.name)).map((tool) => tool.name);
	if (invalidNames.length > 0) {
		checks.push({
			id: "tools.invalid_names",
			title: "Invalid tool names",
			severity: "warn",
			message: "Some tool names do not match the recommended MCP-safe pattern: letters, numbers, underscores or hyphens, 1-128 chars.",
			details: invalidNames,
		});
	}

	const missingDescriptions = tools.filter((tool) => !tool.description || tool.description.trim().length < 12).map((tool) => tool.name);
	if (missingDescriptions.length > 0) {
		checks.push({
			id: "tools.descriptions",
			title: "Tool descriptions",
			severity: "warn",
			message: "Some tools have missing or very short descriptions. Agents perform better with clear tool descriptions.",
			details: missingDescriptions,
		});
	} else {
		checks.push({
			id: "tools.descriptions",
			title: "Tool descriptions",
			severity: "pass",
			message: "All tools include useful descriptions.",
		});
	}

	for (const tool of tools) {
		checks.push(...checkToolSchema(tool));
		checks.push(...checkToolAnnotations(tool));
	}

	return checks;
}

function checkToolSchema(tool: ToolInfo): DoctorCheck[] {
	const checks: DoctorCheck[] = [];
	const schema = tool.inputSchema as Record<string, unknown> | undefined;

	if (!schema || typeof schema !== "object") {
		checks.push({
			id: `tool.${tool.name}.input_schema.missing`,
			title: `Input schema: ${tool.name}`,
			severity: "fail",
			message: "Tool inputSchema is missing or not an object.",
		});
		return checks;
	}

	if (schema.type !== "object") {
		checks.push({
			id: `tool.${tool.name}.input_schema.type`,
			title: `Input schema type: ${tool.name}`,
			severity: "warn",
			message: "MCP tool inputSchema should normally be a JSON Schema object with type: object.",
		});
	}

	if (schema.properties && typeof schema.properties !== "object") {
		checks.push({
			id: `tool.${tool.name}.input_schema.properties`,
			title: `Input schema properties: ${tool.name}`,
			severity: "fail",
			message: "inputSchema.properties must be an object when provided.",
		});
	}

	return checks;
}

function checkToolAnnotations(tool: ToolInfo): DoctorCheck[] {
	const annotations = tool.annotations;
	if (!annotations) return [];

	const checks: DoctorCheck[] = [];
	if (annotations.destructiveHint === true && annotations.readOnlyHint === true) {
		checks.push({
			id: `tool.${tool.name}.annotations.conflict`,
			title: `Conflicting annotations: ${tool.name}`,
			severity: "warn",
			message: "Tool is marked as both destructive and read-only. This can confuse agents and reviewers.",
		});
	}

	return checks;
}

export function securityChecks(): DoctorCheck[] {
	return [
		{
			id: "security.stdout",
			title: "Stdio stdout hygiene",
			severity: "info",
			message: "For stdio MCP servers, logs should go to stderr. stdout must be reserved for JSON-RPC messages.",
		},
		{
			id: "security.tool_review",
			title: "Review tool side effects",
			severity: "info",
			message: "Review tools with destructive side effects and add accurate annotations such as readOnlyHint, destructiveHint and idempotentHint.",
		},
	];
}
