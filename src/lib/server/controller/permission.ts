import { getRequestEvent } from '$app/server';
import type { UserAction, PermissionAction, User } from '$lib/app-types';
import { pathnameToDots } from '$lib/utils';

export type PermissionResource = string | string[] | URL;

const ACTIONS_MAP: Record<UserAction, PermissionAction> = {
	create: 'canCreate',
	read: 'canRead',
	update: 'canUpdate',
	delete: 'canDelete'
};

export class UserAccess {
	#user: User | null;
	#resource: string[] = [];
	#cache = new Map<string, boolean>();

	constructor(user: User | null) {
		this.#user = user ?? ({ permissions: {} } as User);
	}

	get resource() {
		return this.#resource;
	}

	public validateResource(val: PermissionResource | undefined | null): string[] {
		if (!val) {
			return [];
		}

		if (typeof val === 'string') {
			const trimmed = val.trim();
			return trimmed ? [trimmed] : [];
		}

		if (Array.isArray(val)) {
			return val.map((v) => v.trim()).filter((v) => v.length > 0);
		}

		if (val instanceof URL) {
			const parsed = pathnameToDots(val.pathname);

			return parsed ? [parsed] : [];
		}

		return [];
	}

	public checkPermission(action: UserAction, refResource?: string | string[] | URL) {
		this.#resource = this.validateResource(refResource);
		if (!this.#user?.permissions) return false;

		const key = `{action}:${String(refResource)}`;
		if (this.#cache.has(key)) {
			return this.#cache.get(key);
		}

		const permAction = ACTIONS_MAP[action];
		const result = this.#resource.some((r: string) =>
			Boolean(this.#user?.permissions[r]?.[permAction])
		);

		this.#cache.set(key, result);
		return result;
	}

	public canView(resource?: PermissionResource) {
		return this.checkPermission('read', resource);
	}

	public canCreate(resource?: PermissionResource) {
		return this.checkPermission('create', resource);
	}

	public canUpdate(resource?: PermissionResource) {
		return this.checkPermission('update', resource);
	}

	public canDelete(resource?: PermissionResource) {
		return this.checkPermission('delete', resource);
	}
}

export function getUserAccess(){
	const {locals} = getRequestEvent();
	return new UserAccess(locals.user)
}