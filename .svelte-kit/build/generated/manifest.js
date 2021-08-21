const c = [
	() => import("../../../src/routes/__layout.svelte"),
	() => import("../components/error.svelte"),
	() => import("../../../src/routes/index.svelte"),
	() => import("../../../src/routes/batch.svelte"),
	() => import("../../../src/routes/items/index.svelte"),
	() => import("../../../src/routes/items/create.svelte"),
	() => import("../../../src/routes/items/edit.svelte"),
	() => import("../../../src/routes/login.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/batch.svelte
	[/^\/batch\/?$/, [c[0], c[3]], [c[1]]],

	// src/routes/items/index.svelte
	[/^\/items\/?$/, [c[0], c[4]], [c[1]]],

	// src/routes/items/create.svelte
	[/^\/items\/create\/?$/, [c[0], c[5]], [c[1]]],

	// src/routes/items/edit.svelte
	[/^\/items\/edit\/?$/, [c[0], c[6]], [c[1]]],

	// src/routes/login.svelte
	[/^\/login\/?$/, [c[0], c[7]], [c[1]]]
];

// we import the root layout/error components eagerly, so that
// connectivity errors after initialisation don't nuke the app
export const fallback = [c[0](), c[1]()];