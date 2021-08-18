import { respond } from '@sveltejs/kit/ssr';
import root from './generated/root.svelte';
import { set_paths, assets } from './runtime/paths.js';
import { set_prerendering } from './runtime/env.js';
import * as user_hooks from "../../src/hooks.ts";

const template = ({ head, body }) => "<!DOCTYPE html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<link rel=\"icon\" href=\"/favicon.png\" />\n\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n\n\t\t" + head + "\n\t</head>\n\t<body class=\"flex justify-center items-center xl:py-10\">\n\t\t<div class=\"xl:shadow-2xl xl:rounded\" style=\"width: 100%; max-width: 1200px;\" id=\"svelte\">" + body + "</div>\n\t</body>\n</html>\n";

let options = null;

const default_settings = { paths: {"base":"","assets":""} };

// allow paths to be overridden in svelte-kit preview
// and in prerendering
export function init(settings = default_settings) {
	set_paths(settings.paths);
	set_prerendering(settings.prerendering || false);

	const hooks = get_hooks(user_hooks);

	options = {
		amp: false,
		dev: false,
		entry: {
			file: assets + "/_app/start-0080cf22.js",
			css: [assets + "/_app/assets/start-464e9d0a.css",assets + "/_app/assets/vendor-a2bb87a1.css"],
			js: [assets + "/_app/start-0080cf22.js",assets + "/_app/chunks/vendor-76b514ea.js"]
		},
		fetched: undefined,
		floc: false,
		get_component_path: id => assets + "/_app/" + entry_lookup[id],
		get_stack: error => String(error), // for security
		handle_error: (error, request) => {
			hooks.handleError({ error, request });
			error.stack = options.get_stack(error);
		},
		hooks,
		hydrate: true,
		initiator: undefined,
		load_component,
		manifest,
		paths: settings.paths,
		prerender: true,
		read: settings.read,
		root,
		service_worker: null,
		router: true,
		ssr: true,
		target: "#svelte",
		template,
		trailing_slash: "never"
	};
}

const d = decodeURIComponent;
const empty = () => ({});

const manifest = {
	assets: [{"file":"favicon.png","size":1571,"type":"image/png"},{"file":"robots.txt","size":67,"type":"text/plain"}],
	layout: "src/routes/__layout.svelte",
	error: ".svelte-kit/build/components/error.svelte",
	routes: [
		{
						type: 'page',
						pattern: /^\/$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/items\/([^/]+?)\/?$/,
						params: (m) => ({ _id: d(m[1])}),
						a: ["src/routes/__layout.svelte", "src/routes/items/[_id].svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/login\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/login.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					}
	]
};

// this looks redundant, but the indirection allows us to access
// named imports without triggering Rollup's missing import detection
const get_hooks = hooks => ({
	getSession: hooks.getSession || (() => ({})),
	handle: hooks.handle || (({ request, resolve }) => resolve(request)),
	handleError: hooks.handleError || (({ error }) => console.error(error.stack)),
	externalFetch: hooks.externalFetch || fetch
});

const module_lookup = {
	"src/routes/__layout.svelte": () => import("../../src/routes/__layout.svelte"),".svelte-kit/build/components/error.svelte": () => import("./components/error.svelte"),"src/routes/index.svelte": () => import("../../src/routes/index.svelte"),"src/routes/items/[_id].svelte": () => import("../../src/routes/items/[_id].svelte"),"src/routes/login.svelte": () => import("../../src/routes/login.svelte")
};

const metadata_lookup = {"src/routes/__layout.svelte":{"entry":"pages/__layout.svelte-405c9448.js","css":["assets/pages/__layout.svelte-d4987512.css","assets/vendor-a2bb87a1.css"],"js":["pages/__layout.svelte-405c9448.js","chunks/vendor-76b514ea.js","chunks/authService-8b029167.js"],"styles":[]},".svelte-kit/build/components/error.svelte":{"entry":"error.svelte-b03a6e72.js","css":["assets/vendor-a2bb87a1.css"],"js":["error.svelte-b03a6e72.js","chunks/vendor-76b514ea.js"],"styles":[]},"src/routes/index.svelte":{"entry":"pages/index.svelte-ef1d7d9f.js","css":["assets/vendor-a2bb87a1.css"],"js":["pages/index.svelte-ef1d7d9f.js","chunks/vendor-76b514ea.js","chunks/item-2f306f91.js","chunks/loading-1fd50be2.js"],"styles":[]},"src/routes/items/[_id].svelte":{"entry":"pages/items/[_id].svelte-60e2f0bd.js","css":["assets/vendor-a2bb87a1.css"],"js":["pages/items/[_id].svelte-60e2f0bd.js","chunks/vendor-76b514ea.js","chunks/item-2f306f91.js","chunks/loading-1fd50be2.js"],"styles":[]},"src/routes/login.svelte":{"entry":"pages/login.svelte-5160761e.js","css":["assets/vendor-a2bb87a1.css"],"js":["pages/login.svelte-5160761e.js","chunks/vendor-76b514ea.js","chunks/authService-8b029167.js","chunks/loading-1fd50be2.js"],"styles":[]}};

async function load_component(file) {
	const { entry, css, js, styles } = metadata_lookup[file];
	return {
		module: await module_lookup[file](),
		entry: assets + "/_app/" + entry,
		css: css.map(dep => assets + "/_app/" + dep),
		js: js.map(dep => assets + "/_app/" + dep),
		styles
	};
}

export function render(request, {
	prerender
} = {}) {
	const host = request.headers["host"];
	return respond({ ...request, host }, options, { prerender });
}