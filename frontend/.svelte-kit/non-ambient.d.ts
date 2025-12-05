
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/analytics" | "/archive" | "/clients" | "/clients/new" | "/login" | "/media" | "/media/new" | "/register" | "/tasks" | "/tasks/new";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/analytics": Record<string, never>;
			"/archive": Record<string, never>;
			"/clients": Record<string, never>;
			"/clients/new": Record<string, never>;
			"/login": Record<string, never>;
			"/media": Record<string, never>;
			"/media/new": Record<string, never>;
			"/register": Record<string, never>;
			"/tasks": Record<string, never>;
			"/tasks/new": Record<string, never>
		};
		Pathname(): "/" | "/analytics" | "/analytics/" | "/archive" | "/archive/" | "/clients" | "/clients/" | "/clients/new" | "/clients/new/" | "/login" | "/login/" | "/media" | "/media/" | "/media/new" | "/media/new/" | "/register" | "/register/" | "/tasks" | "/tasks/" | "/tasks/new" | "/tasks/new/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}