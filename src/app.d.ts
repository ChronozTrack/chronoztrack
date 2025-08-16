// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
// 0
import { User, Session } from '$lib/app-types';
declare global {
	namespace App {
		interface Locals {
			user: User | null;
			session: Session | null;
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	//workaround: https://github.com/sveltejs/svelte/issues/13837
	namespace $state {
		type MyPrimitive = string | number | boolean | null | undefined | Promise;

		type MySnapshot<T> = T extends MyPrimitive
			? T
			: T extends Cloneable
				? NonReactive<T>
				: T extends { toJSON(): infer R }
					? R
					: T extends Array<infer U>
						? Array<Snapshot<U>>
						: T extends object
							? T extends { [key: string]: unknown }
								? { [K in keyof T]: Snapshot<T[K]> }
								: never
							: never;

		export function snapshot<T>(state: T): MySnapshot<T>;
	}
}

export {};
