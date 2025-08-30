import { customId } from '$lib/utils';
import type { UserAction } from '$lib/app-types';
import { SvelteMap } from 'svelte/reactivity';

type DraftDataKeys<T> = { primary: (keyof T)[]; isRequired?: boolean };

export class DraftState<T extends Record<string, unknown>> {
	#entity: string = $state('');
	#initialValues: Partial<T>;
	#actionState: UserAction = $state('read');
	#newEntries: Map<string, T> = new SvelteMap();
	#modifiedEntries: Map<string, T> = new SvelteMap();
	#removedEntries: Map<string, T> = new SvelteMap();
	#isKeysRequired: boolean = false;
	#primaryKeys: (keyof T)[];

	constructor(entity: string, idKeys: DraftDataKeys<T>, initialValues: Partial<T> = {}) {
		this.#entity = entity;
		this.#initialValues = initialValues;
		this.#primaryKeys = idKeys.primary ?? [];
		this.#isKeysRequired = idKeys.isRequired ?? false;
	}

	get newEntries() {
		return this.#newEntries;
	}

	get modifiedEntries() {
		return this.#modifiedEntries;
	}

	get removedEnries() {
		return this.#removedEntries;
	}

	get entity() {
		return this.#entity;
	}

	get actionState() {
		return this.#actionState;
	}

	get hasChanges() {
		return (this.#newEntries.size || this.#modifiedEntries.size || this.#removedEntries.size) > 0;
	}

	get totalChanges() {
		return this.#newEntries.size + this.#modifiedEntries.size + this.#removedEntries.size;
	}

	get currentTotal() {
		if (this.#actionState === 'create') {
			return this.#newEntries.size;
		} else if (this.#actionState === 'update') {
			return this.#modifiedEntries.size;
		} else if (this.#actionState === 'delete') {
			return this.#removedEntries.size;
		}

		return 0;
	}

	set entity(value: string) {
		this.#entity = value;
	}

	#setActionState() {
		if (this.#newEntries.size) {
			this.#actionState = 'create';
		} else if (this.#modifiedEntries.size) {
			this.#actionState = 'update';
		} else if (this.#removedEntries.size) {
			this.#actionState = 'delete';
		} else {
			this.#actionState = 'read';
		}
	}

	#isRequiredMatch(overrides: Partial<T> = {}) {
		if (this.#isKeysRequired) {
			return this.#primaryKeys.every((key) => {
				const val = overrides[key];
				return val !== undefined || val !== null;
			});
		}

		//match if no required keys
		return true;
	}

	#checkRequirements(data: T | Partial<T>) {
		if (!this.#isRequiredMatch(data)) {
			throw new Error(`Required Keys: ${this.#primaryKeys.join(';')}`);
		}
	}

	#mergedDrafts(data: Partial<T>, overrides: Partial<T>) {
		const draft = { ...data, ...overrides };
		this.#checkRequirements(draft);

		return draft as T;
	}

	#forceClearOtherEntries(action?: UserAction) {
		if (action !== 'create') {
			this.#newEntries.clear();
		}

		if (action !== 'update') {
			this.#modifiedEntries.clear();
		}

		if (action !== 'delete') {
			this.#removedEntries.clear();
		}

		if (!action) {
			this.entity = '';
		}
	}

	public getMapKey(values: Partial<T>) {
		return this.#primaryKeys.map((k) => JSON.stringify(values[k])).join(':');
	}

	public addEntry(overrides: Partial<T> = {}) {
		this.#forceClearOtherEntries('create');
		const draft = $state(this.#mergedDrafts(this.#initialValues, overrides));
		const mapKey = this.#isKeysRequired ? this.getMapKey(draft) : customId();
		this.#newEntries.set(mapKey, draft);
		this.#setActionState();
	}

	public updateEntry(data: T, overrides: Partial<T> = {}) {
		this.#forceClearOtherEntries('update');

		const draft = $state({ ...structuredClone(data), ...overrides });
		this.#checkRequirements(draft);
		this.#modifiedEntries.set(this.getMapKey(draft), draft);
		this.#setActionState();
	}

	public deleteEntry(entry: T) {
		this.#forceClearOtherEntries('delete');

		this.#checkRequirements(entry);
		this.#removedEntries.set(this.getMapKey(entry), entry);
		this.#setActionState();
	}

	public discardEntry(refKey: string | Partial<T>) {
		const mapKey = typeof refKey === 'string' ? refKey : this.getMapKey(refKey);
		if (this.#actionState === 'create' && this.#newEntries.has(mapKey)) {
			this.#newEntries.delete(mapKey);
		} else if (this.#actionState === 'update' && this.#modifiedEntries.has(mapKey)) {
			this.#modifiedEntries.delete(mapKey);
		}

		this.#setActionState();
	}

	public discardAllChanges() {
		this.#forceClearOtherEntries();
		this.#setActionState();
	}
}

