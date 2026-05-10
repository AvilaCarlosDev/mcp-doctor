export type Severity = "pass" | "info" | "warn" | "fail";

export type DoctorCheck = {
	id: string;
	title: string;
	severity: Severity;
	message: string;
	details?: string[];
};

export type ToolInfo = {
	name: string;
	description?: string;
	inputSchema?: unknown;
	outputSchema?: unknown;
	annotations?: Record<string, unknown>;
};

export type ServerTarget = {
	command: string;
	args: string[];
	cwd?: string;
	env?: Record<string, string>;
};

export type DoctorOptions = {
	timeoutMs: number;
	includeSecurityChecks: boolean;
};

export type DoctorReport = {
	tool: "mcp-doctor";
	version: string;
	createdAt: string;
	target: ServerTarget;
	summary: {
		status: "healthy" | "warning" | "failed";
		passed: number;
		warnings: number;
		failed: number;
		tools: number;
	};
	server?: {
		capabilities?: unknown;
	};
	tools: ToolInfo[];
	checks: DoctorCheck[];
	stderr: string[];
};
