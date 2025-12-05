const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.DXgq92Vf.js",app:"_app/immutable/entry/app.CGGLdTrX.js",imports:["_app/immutable/entry/start.DXgq92Vf.js","_app/immutable/chunks/DRqhRD-H.js","_app/immutable/chunks/DWTpI_9b.js","_app/immutable/chunks/ChdA8jD2.js","_app/immutable/entry/app.CGGLdTrX.js","_app/immutable/chunks/DWTpI_9b.js","_app/immutable/chunks/00uyEj5u.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-DZ11A75i.js')),
			__memo(() => import('./chunks/1-jgg8PyHs.js')),
			__memo(() => import('./chunks/2-Bg9E26ip.js')),
			__memo(() => import('./chunks/3-O60ZzudF.js')),
			__memo(() => import('./chunks/4-BSyCYFVi.js')),
			__memo(() => import('./chunks/5-CP2OAVSo.js')),
			__memo(() => import('./chunks/6-BLfyMujt.js')),
			__memo(() => import('./chunks/7-ByJwtJTU.js')),
			__memo(() => import('./chunks/8-B-zOMTWO.js')),
			__memo(() => import('./chunks/9-B-ZBgDwG.js')),
			__memo(() => import('./chunks/10-BzJTk5iV.js')),
			__memo(() => import('./chunks/11-DNYpHmsu.js')),
			__memo(() => import('./chunks/12-BAAYSeI8.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/analytics",
				pattern: /^\/analytics\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/archive",
				pattern: /^\/archive\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/clients",
				pattern: /^\/clients\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/clients/new",
				pattern: /^\/clients\/new\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/media",
				pattern: /^\/media\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/media/new",
				pattern: /^\/media\/new\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/register",
				pattern: /^\/register\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/tasks",
				pattern: /^\/tasks\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/tasks/new",
				pattern: /^\/tasks\/new\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
