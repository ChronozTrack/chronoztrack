import { customId } from '$lib/utils';
import type { UserAction } from '$lib/app-types';
import { extractTablesRelationalConfig } from 'drizzle-orm';


type DraftDataKeys<T> =
	| { required: (keyof T)[]; omit?: never }
	| { omit: (keyof T)[]; required?: never };
type WithReferenceId<T> = T & { referenceId: string };

export class DraftState<T extends Record<string, unknown>> {
	#entity: string = $state('');
	#initValues: Partial<T>;
	#actionState: UserAction = $state('read');
	#newEntries: WithReferenceId<T>[] = $state([]);
	#modifiedEntries: WithReferenceId<T>[] = $state([]);
	#removedEntries: WithReferenceId<T>[] = $state([]);
	#requiredKeys: (keyof T)[];
	#omittedKeys: (keyof T)[];

	constructor(entity: string, idKeys: DraftDataKeys<T>, initValues: Partial<T> = {}) {
		this.#entity = entity;
		this.#initValues = initValues;
		this.#requiredKeys = idKeys.required ?? [];
		this.#omittedKeys = idKeys.omit ?? [];
	}

	get newEntries() {
		return this.#newEntries;
	}

	get modifiedEntries() {
		return this.#modifiedEntries;
	}

	get removeEnries() {
		return this.#removedEntries;
	}

	get entity() {
		return this.#entity;
	}

	get hasChanges() {
		return (
			(this.#newEntries.length || this.#modifiedEntries.length || this.#removedEntries.length) > 0
		);
	}

	get actionState() {
		return this.#actionState;
	}

	set entity(value: string) {
		this.#entity = value;
	}

	#setActionState() {
		if (this.newEntries.length) {
			this.#actionState = 'create';
		} else if (this.modifiedEntries.length) {
			this.#actionState = 'update';
		} else if (this.removeEnries.length) {
			this.#actionState = 'delete';
		} else {
			this.#actionState = 'read';
		}
	}

	#isRequiredMatch(overrides: Partial<T> = {}) {
		if (this.#requiredKeys.length > 1) {
			return this.#requiredKeys.every((key) => {
				let val = overrides[key];
				return val !== undefined || val !== null;
			});
		}

		//match if no required keys
		return true;
	}

	#checkRequirements(data: T | Partial<T>) {
		if (!this.#isRequiredMatch(data)) {
			throw new Error(`Required Keys: ${this.#requiredKeys.join(';')}`);
		}
	}

	#mergedDrafts(data: Partial<T>, overrides: Partial<T>) {
		let draft = { ...data, ...overrides };

		this.#checkRequirements(draft);

		for (const key of this.#omittedKeys) {
			delete draft[key];
		}

		return draft as T;
	}

	#forceClearOtherEntries(action?: UserAction) {
		if (action !== 'create') {
			this.#newEntries.length = 0;
		}

		if (action !== 'update') {
			this.#modifiedEntries.length = 0;
		}

		if (action !== 'delete') {
			this.#removedEntries.length = 0;
		}

		if (!action) {
			this.entity = '';
		}
	}

	public addEntry(overrides: Partial<T> = {}) {
		this.#forceClearOtherEntries('create');

		const referenceId = customId();
		const draft = this.#mergedDrafts(this.#initValues, overrides);

		this.#newEntries.push({ referenceId, ...draft });
		this.#setActionState();
	}

	public editEntry(data: T, overrides: Partial<T> = {}) {
		this.#forceClearOtherEntries('update');

		const referenceId = customId();
		const draft = { ...structuredClone(data), ...overrides };
		this.#checkRequirements(draft);
		this.#modifiedEntries.push({ referenceId, ...draft });
		this.#setActionState();
	}

	public getEntryByIds(entryType: 'new' | 'modified', objIds: Partial<T>){
		let typeMap = {
			new: this.#newEntries,
			modified: this.#modifiedEntries,
		};

		let temp = typeMap[entryType];
		
		if(!temp.length) return undefined;
		return temp.find(entry => {
			for(const key in objIds){
				if(entry[key] !== objIds[key]){
					return false;
				}
			}

			return true;
		})
	}

	public discardEntry(referenceId: string){
		if(this.#actionState === 'create'){
			this.#newEntries = this.#newEntries.filter(val => val.referenceId !== referenceId)
		}else if(this.#actionState === 'update'){
			this.#modifiedEntries = this.#modifiedEntries.filter(val => val.referenceId !== referenceId)
		}

		this.#setActionState
	}

	public discardAllChanges() {
		this.#forceClearOtherEntries();
		this.#setActionState();
	}
}
