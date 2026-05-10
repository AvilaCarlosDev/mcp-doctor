import pc from "picocolors";
import type { DoctorReport, Severity } from "../core/types.js";

const iconBySeverity: Record<Severity, string> = {
	pass: "✅",
	info: "ℹ️ ",
	warn: "⚠️ ",
	fail: "❌",
};

export function printConsoleReport(report: DoctorReport): void {
	const status = report.summary.status === "healthy" ? pc.green("healthy") : report.summary.status === "warning" ? pc.yellow("warning") : pc.red("failed");

	console.log(pc.bold("\n🩺 MCP Doctor Report"));
	console.log(pc.dim("─".repeat(60)));
	console.log(`Status: ${status}`);
	console.log(`Target: ${pc.cyan([report.target.command, ...report.target.args].join(" "))}`);
	console.log(`Tools:  ${report.summary.tools}`);
	console.log(`Checks: ${pc.green(`${report.summary.passed} passed`)} · ${pc.yellow(`${report.summary.warnings} warnings`)} · ${pc.red(`${report.summary.failed} failed`)}`);

	if (report.tools.length > 0) {
		console.log(pc.bold("\nTools"));
		for (const tool of report.tools) {
			console.log(`  ${pc.cyan(tool.name)}${tool.description ? pc.dim(` — ${tool.description}`) : ""}`);
		}
	}

	console.log(pc.bold("\nChecks"));
	for (const check of report.checks) {
		const color = check.severity === "fail" ? pc.red : check.severity === "warn" ? pc.yellow : check.severity === "pass" ? pc.green : pc.cyan;
		console.log(`  ${iconBySeverity[check.severity]} ${color(check.title)}: ${check.message}`);
		for (const detail of check.details ?? []) console.log(pc.dim(`     - ${detail}`));
	}

	if (report.stderr.length > 0) {
		console.log(pc.bold("\nRecent stderr"));
		for (const line of report.stderr) console.log(pc.dim(`  ${line}`));
	}

	console.log();
}
