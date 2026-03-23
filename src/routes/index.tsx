import {
	Badge,
	Box,
	Button,
	Checkbox,
	Container,
	Flex,
	Heading,
	IconButton,
	Spinner,
	Text,
	TextField,
} from "@radix-ui/themes";
import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import { Inbox, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { todosCollection } from "@/db/collections/todos";

export const Route = createFileRoute("/")({
	ssr: false,
	loader: async () => {
		await todosCollection.preload();
		return null;
	},
	component: TodoPage,
});

function TodoPage() {
	const [newTitle, setNewTitle] = useState("");
	const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

	const { data: todos, isLoading } = useLiveQuery((q) =>
		q.from({ todo: todosCollection }).orderBy((r) => r.todo.created_at, "desc"),
	);

	const activeTodos = todos.filter((t) => !t.completed);
	const completedTodos = todos.filter((t) => t.completed);

	const visibleTodos =
		filter === "active"
			? activeTodos
			: filter === "completed"
				? completedTodos
				: todos;

	async function handleAdd(e: React.FormEvent) {
		e.preventDefault();
		const title = newTitle.trim();
		if (!title) return;
		setNewTitle("");
		await todosCollection.insert({
			id: crypto.randomUUID(),
			title,
			completed: false,
			created_at: new Date(),
			updated_at: new Date(),
		});
	}

	async function handleToggle(id: string, completed: boolean) {
		await todosCollection.update(id, (draft) => {
			draft.completed = !completed;
		});
	}

	async function handleDelete(id: string) {
		await todosCollection.delete(id);
	}

	async function handleClearCompleted() {
		for (const todo of completedTodos) {
			await todosCollection.delete(todo.id);
		}
	}

	return (
		<Container size="2" py="6">
			<Flex direction="column" gap="5">
				{/* Header */}
				<Flex justify="between" align="center">
					<Flex direction="column" gap="1">
						<Heading size="7">My Todos</Heading>
						<Text size="2" color="gray">
							{activeTodos.length} task{activeTodos.length !== 1 ? "s" : ""}{" "}
							remaining
						</Text>
					</Flex>
					{completedTodos.length > 0 && (
						<Button
							variant="soft"
							color="gray"
							size="2"
							onClick={handleClearCompleted}
						>
							Clear completed
						</Button>
					)}
				</Flex>

				{/* Add form */}
				<form onSubmit={handleAdd}>
					<Flex gap="2">
						<Box flexGrow="1">
							<TextField.Root
								placeholder="What needs to be done?"
								value={newTitle}
								onChange={(e) => setNewTitle(e.target.value)}
								size="3"
							/>
						</Box>
						<Button type="submit" size="3" disabled={!newTitle.trim()}>
							<Plus size={16} />
							Add
						</Button>
					</Flex>
				</form>

				{/* Filter tabs */}
				<Flex gap="2">
					{(["all", "active", "completed"] as const).map((f) => (
						<Button
							key={f}
							variant={filter === f ? "solid" : "soft"}
							color={filter === f ? "violet" : "gray"}
							size="1"
							onClick={() => setFilter(f)}
						>
							{f.charAt(0).toUpperCase() + f.slice(1)}
							{f === "all" && (
								<Badge ml="1" color="gray" variant="surface" size="1">
									{todos.length}
								</Badge>
							)}
							{f === "active" && (
								<Badge ml="1" color="orange" variant="surface" size="1">
									{activeTodos.length}
								</Badge>
							)}
							{f === "completed" && (
								<Badge ml="1" color="green" variant="surface" size="1">
									{completedTodos.length}
								</Badge>
							)}
						</Button>
					))}
				</Flex>

				{/* Todo list */}
				{isLoading ? (
					<Flex align="center" justify="center" py="9">
						<Spinner size="3" />
					</Flex>
				) : visibleTodos.length === 0 ? (
					<Flex direction="column" align="center" gap="3" py="9">
						<Inbox size={48} strokeWidth={1} color="var(--gray-8)" />
						<Text size="4" color="gray">
							{filter === "completed"
								? "No completed tasks yet"
								: filter === "active"
									? "No active tasks — great job!"
									: "No todos yet. Add one above!"}
						</Text>
					</Flex>
				) : (
					<Flex direction="column" gap="2">
						{visibleTodos.map((todo) => (
							<Flex
								key={todo.id}
								align="center"
								gap="3"
								p="3"
								style={{
									borderRadius: "var(--radius-3)",
									background: "var(--color-surface)",
									border: "1px solid var(--gray-4)",
									transition: "opacity 0.15s ease",
									opacity: todo.completed ? 0.6 : 1,
								}}
							>
								<Checkbox
									size="2"
									checked={todo.completed}
									onCheckedChange={() => handleToggle(todo.id, todo.completed)}
								/>
								<Text
									size="3"
									weight={todo.completed ? "regular" : "medium"}
									style={{
										flexGrow: 1,
										textDecoration: todo.completed ? "line-through" : "none",
										color: todo.completed ? "var(--gray-9)" : undefined,
									}}
								>
									{todo.title}
								</Text>
								<IconButton
									size="1"
									variant="ghost"
									color="red"
									onClick={() => handleDelete(todo.id)}
								>
									<Trash2 size={14} />
								</IconButton>
							</Flex>
						))}
					</Flex>
				)}
			</Flex>
		</Container>
	);
}
