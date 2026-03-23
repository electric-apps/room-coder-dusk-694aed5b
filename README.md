# My Todos

A reactive, real-time todo app built with Electric SQL and TanStack DB. Create, complete, and delete todos with instant sync across all clients.

## Screenshot

<!-- screenshot placeholder -->

## Features

- Add todos with a title
- Toggle todos as complete/incomplete
- Delete individual todos
- Clear all completed todos at once
- Filter by All / Active / Completed
- Real-time sync across all browser tabs and clients via Electric SQL
- Optimistic mutations for instant UI feedback

## Tech Stack

- [Electric SQL](https://electric-sql.com/) — Postgres-to-client real-time sync
- [TanStack DB](https://tanstack.com/db) — Reactive collections and live queries
- [TanStack Start](https://tanstack.com/start) — React meta-framework with SSR
- [Drizzle ORM](https://orm.drizzle.team/) — Type-safe schema and migrations
- [Radix UI Themes](https://www.radix-ui.com/themes) — Component library

## Getting Started

```bash
pnpm install
pnpm drizzle-kit generate && pnpm drizzle-kit migrate
pnpm dev:start
```

Open [http://localhost:8080](http://localhost:8080) to view the app.
