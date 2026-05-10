import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { checkToolCatalog, securityChecks } from "./checks.js";
import type { DoctorCheck, DoctorOptions, DoctorReport, ServerTarget, ToolInfo } from "./types.js";
import { packageVersion } from "../utils/package.js";

export async function runDoctor(target: ServerTarget, options: DoctorOptions): Promise<DoctorReport> {
	const checks: DoctorCheck[] = [];
	const stderrLines: string[] = [];
	let tools: ToolInfo[] = [];
	let capabilities: unknown;
	let transport: StdioClientTransport | undefined;

	const client = new Client({ name: "mcp-doctor", version: packageVersion() }, { capabilities: {} });

	try {
		transport = new StdioClientTransport({
			command: target.command,
			args: target.args,
			cwd: target.cwd,
			env: target.env,
			stderr: "pipe",
		});

		transport.stderr?.on("data", (chunk: Buffer) => {
			stderrLines.push(...chunk.toString("utf8").split(/\r?\n/).filter(Boolean));
		});

		await withTimeout(client.connect(transport), options.timeoutMs, "Timed out while connecting to MCP server.");
		checks.push({
			id: "connection.ok",
			title: "Connection",
			severity: "pass" as const,
			message: "MCP server initialized successfully.",
		});

		capabilities = client.getServerCapabilities();
		if (capabilities) {
			checks.push({
				id: "capabilities.present",
				title: "Capabilities",
				severity: "pass" as const,
				message: "Server capabilities were received during initialization.",
			});
		}

		const result = await withTimeout(client.listTools(), options.timeoutMs, "Timed out while listing tools.");
		tools = result.tools.map((tool) => ({
			name: tool.name,
			description: tool.description,
			inputSchema: tool.inputSchema,
			outputSchema: tool.outputSchema,
			annotations: tool.annotations as Record<string, unknown> | undefined,
		}));

		checks.push(...checkToolCatalog(tools));
		if (options.includeSecurityChecks) checks.push(...securityChecks());
	} catch (error) {
		checks.push({
			id: "doctor.error",
			title: "Doctor run failed",
			severity: "fail" as const,
			message: error instanceof Error ? error.message : String(error),
		});
	} finally {
		try {
			await transport?.close();
		} catch {
			// Ignore shutdown errors. The report already captured the diagnostic result.
		}
	}

	const failed = checks.filter((check) => check.severity === "fail").length;
	const warnings = checks.filter((check) => check.severity === "warn").length;
	const passed = checks.filter((check) => check.severity === "pass").length;

	return {
		tool: "mcp-doctor",
		version: packageVersion(),
		createdAt: new Date().toISOString(),
		target,
		summary: {
			status: failed > 0 ? "failed" : warnings > 0 ? "warning" : "healthy",
			passed,
			warnings,
			failed,
			tools: tools.length,
		},
		server: { capabilities },
		tools,
		checks,
		stderr: stderrLines.slice(-50),
	};
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
	let timer: NodeJS.Timeout | undefined;
	const timeout = new Promise<never>((_, reject) => {
		timer = setTimeout(() => reject(new Error(message)), timeoutMs);
	});

	try {
		return await Promise.race([promise, timeout]);
	} finally {
		if (timer) clearTimeout(timer);
	}
}
