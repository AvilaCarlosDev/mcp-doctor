import { describe, expect, it } from "vitest";
import { checkToolCatalog } from "../src/core/checks.js";

const validSchema = { type: "object", properties: { message: { type: "string" } } };

describe("checkToolCatalog", () => {
	it("passes valid tools", () => {
		const checks = checkToolCatalog([
			{
				name: "echo",
				description: "Return the provided message for smoke testing.",
				inputSchema: validSchema,
			},
		]);

		expect(checks.some((check) => check.id === "tools.present" && check.severity === "pass")).toBe(true);
		expect(checks.some((check) => check.severity === "fail")).toBe(false);
	});

	it("detects duplicate tool names", () => {
		const checks = checkToolCatalog([
			{ name: "echo", description: "First duplicate tool description.", inputSchema: validSchema },
			{ name: "echo", description: "Second duplicate tool description.", inputSchema: validSchema },
		]);

		expect(checks.some((check) => check.id === "tools.duplicate_names" && check.severity === "fail")).toBe(true);
	});
});
