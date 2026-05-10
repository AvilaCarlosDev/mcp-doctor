#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { Command } from "commander";
import ora from "ora";
import { runDoctor } from "./core/doctor.js";
import { targetFromCommand, targetFromConfig } from "./core/config.js";
import { printConsoleReport } from "./reporters/console.js";
import { toMarkdown } from "./reporters/markdown.js";
import { packageVersion } from "./utils/package.js";

const program = new Command();

program
	.name("mcp-doctor")
	.description("Diagnose MCP servers: connect, inspect tools, validate schemas, and generate reports.")
	.version(packageVersion());

program
	.command("check")
	.description("Run a full diagnostic against an MCP server")
	.option("-c, --config <path>", "Path to mcp-doctor.config.json")
	.option("-s, --server <name>", "Server name from config file")
	.option("--cmd <command>", "Server command to run through stdio")
	.option("--args <args...>", "Arguments for --cmd")
	.option("--cwd <path>", "Working directory for the server process")
	.option("--timeout <ms>", "Timeout per MCP operation", "15000")
	.option("--json", "Print JSON report")
	.option("--markdown <path>", "Write Markdown report to a file")
	.option("--no-security", "Disable security advisory checks")
	.action(async (options) => {
		try {
			const target = options.server
				? targetFromConfig(options.server, options.config)
				: targetFromCommand(options.cmd, options.args ?? [], options.cwd);

			if (!target.command) {
				throw new Error("Provide either --server from config or --cmd <command>.");
			}

			const spinner = ora("Running MCP diagnostics...").start();
			const report = await runDoctor(target, {
				timeoutMs: Number(options.timeout),
				includeSecurityChecks: options.security,
			});
			spinner.stop();

			if (options.markdown) {
				writeFileSync(options.markdown, toMarkdown(report));
			}

			if (options.json) {
				console.log(JSON.stringify(report, null, 2));
			} else {
				printConsoleReport(report);
				if (options.markdown) console.log(`Markdown report written to: ${options.markdown}`);
			}

			process.exitCode = report.summary.failed > 0 ? 1 : 0;
		} catch (error) {
			console.error(error instanceof Error ? error.message : String(error));
			process.exitCode = 1;
		}
	});

program
	.command("init")
	.description("Create an example mcp-doctor.config.json")
	.option("-o, --output <path>", "Output path", "mcp-doctor.config.json")
	.action((options) => {
		const example = {
			servers: {
				filesystem: {
					command: "npx",
					args: ["-y", "@modelcontextprotocol/server-filesystem", "."],
					cwd: ".",
				},
			},
		};
		writeFileSync(options.output, `${JSON.stringify(example, null, 2)}\n`);
		console.log(`Created ${options.output}`);
	});

program.parseAsync(process.argv);
