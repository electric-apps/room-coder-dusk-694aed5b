import { describe, expect, it } from "vitest"
import { todoInsertSchema, todoSelectSchema } from "@/db/zod-schemas"
import { generateRowWithout, generateValidRow } from "./helpers/schema-test-utils"

describe("todoSelectSchema", () => {
	it("parses a valid row", () => {
		const row = generateValidRow(todoSelectSchema)
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("rejects a row missing id", () => {
		const row = generateRowWithout(todoSelectSchema, "id")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("rejects a row missing title", () => {
		const row = generateRowWithout(todoSelectSchema, "title")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("rejects a row missing completed", () => {
		const row = generateRowWithout(todoSelectSchema, "completed")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("parses ISO date strings for created_at and updated_at", () => {
		const row = generateValidRow(todoSelectSchema)
		const rowWithStringDates = {
			...row,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		}
		const result = todoSelectSchema.safeParse(rowWithStringDates)
		expect(result.success).toBe(true)
	})
})

describe("todoInsertSchema", () => {
	it("parses a valid insert row", () => {
		const row = generateValidRow(todoInsertSchema)
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("rejects a row missing title", () => {
		const row = generateRowWithout(todoInsertSchema, "title")
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(false)
	})
})
