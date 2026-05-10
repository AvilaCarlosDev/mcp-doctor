import type { DoctorReport } from "../core/types.js";

export function toMarkdown(report: DoctorReport): string {
	const lines: string[] = [];
	lines.push("# MCP Doctor Report");
	lines.push("");
	lines.push(`- **Status:** ${report.summary.status}`);
	lines.push(`- **Created at:** ${report.createdAt}`);
	lines.push(`- **Target:** \`${[report.target.command, ...report.target.args].join(" ")}\``);
	lines.push(`- **Tools:** ${report.summary.tools}`);
	lines.push(`- **Checks:** ${report.summary.passed} passed · ${report.summary.warnings} warnings · ${report.summary.failed} failed`);
	lines.push("");

	lines.push("## Tools");
	lines.push("");
	if (report.tools.length === 0) lines.push("No tools found.");
	for (const tool of report.tools) {
		lines.push(`### ${tool.name}`);
		lines.push("");
		lines.push(tool.description ?? "No description provided.");
		lines.push("");
		lines.push("```json");
		lines.push(JSON.stringify(tool.inputSchema ?? {}, null, 2));
		lines.push("```");
		lines.push("");
	}

	lines.push("## Checks");
	lines.push("");
	for (const check of report.checks) {
		lines.push(`- **${check.severity.toUpperCase()}** — ${check.title}: ${check.message}`);
		for (const detail of check.details ?? []) lines.push(`  - ${detail}`);
	}

	if (report.stderr.length > 0) {
		lines.push("");
		lines.push("## Recent stderr");
		lines.push("");
		lines.push("```text");
		lines.push(...report.stderr);
		lines.push("```");
	}

	return `${lines.join("\n")}\n`;
}
