import { customId } from '$lib/utils';
import type { UserAction } from '$lib/app-types';

type IsComposite<T, U extends T = T> = (
	T extends unknown ? (U extends T ? false : true) : never
) extends false
	? false
	: true;

type WithTemporaryId<T, K extends keyof T> = { [P in keyof T]: P extends K ? string : T[P] };
type InferCreateState<T, K extends keyof T> =
	IsComposite<K> extends true ? T : WithTemporaryId<T, K>;

type OverridesType<T, K extends keyof T> =
	IsComposite<K> extends true
		? Partial<T> & Required<Pick<T, K>> // require only K keys
		: Partial<Omit<T, K>>; // remove the single key

type WithTrackId<T> = T & { referenceId: string };

// Utility to disallow mixing
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
// Safer XOR
type XOR<T, U> = (T & Without<U, T>) | (U & Without<T, U>);
// Your DraftDataKeys definition
type DraftDataKeys<T> = XOR<{ required: (keyof T)[] }, { omit: (keyof T)[] }>;

export class DraftData<T extends Record<string, unknown>> {
	#entity: string = $state('');
	#initValues: Partial<T>;
	#actionState: UserAction = $state('read');
	#newEntries: WithTrackId<T>[] = $state([]);
	#modifiedEntries: T[] = $state([]);
	#removedEntries: T[] = $state([]);
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

	set entity(value: unknown) {
		this.entity = String(value);
	}

	#hasRequired() {
		return this.#requiredKeys.length > 1;
	}

	#hasOmitted() {
		return this.#omittedKeys.length > 1;
	}

	#isRequiredMatch(overrides: Partial<T> = {}) {
		if (this.#requiredKeys.length > 1) {
			const values = Object.entries(overrides);
			if (values.length >= this.#requiredKeys.length) {
				return values.every(([key, val]) => {
					return this.#requiredKeys.includes(key) && (val !== undefined || val !== null);
				});
			}

			return false;
		}

		//match if no required keys
		return true;
	}

	#isKeyOmitted(overrides: Partial<T> = {}) {
		if (this.#omittedKeys.length > 1) {
			const keys = Object.keys(overrides);
			return keys.some((k) => this.#omittedKeys.includes(k));
		}

		//match if no omitted keys
		return true;
	}

	public addEntry(overrides?: Partial<T>) {
		if (this.#hasRequired()) {
			if (!this.#isRequiredMatch(overrides)) {
				throw new Error(`Reqruired ${this.#requiredKeys.join(';')}`);
			}
		}
	}
}

/**
 * User actions state should only be one at a time, ['create','update','read','delete?']
 */
export class DataState<T extends Record<string, unknown>, K extends keyof T> {
	#createdData: InferCreateState<T, K>[] = $state([]);
	#updatedData: T[] = $state([]);
	#table: string = $state('');
	#defaultValues: Omit<T, K>;
	#actionState: UserAction = $state('read');
	#idKeys: K[];

	constructor(table: unknown, idKeys: K | K[], defaultValues: Omit<T, K>) {
		this.#table = String(table);
		this.#defaultValues = defaultValues;
		this.#idKeys = Array.isArray(idKeys) ? idKeys : [idKeys];
	}

	get createdData() {
		return this.#createdData;
	}
	get updatedData() {
		return this.#updatedData;
	}

	get table(): string {
		return this.#table;
	}

	get hasChanges() {
		return (this.#createdData.length || this.#updatedData.length) > 0;
	}

	get actionState() {
		return this.#actionState;
	}

	set table(value: unknown) {
		this.#table = String(value);
	}

	public addData(overrides: OverridesType<T, K>) {
		if (this.#updatedData.length) {
			this.discardChanges();
		}

		if (this.#isComposite()) {
			if (this.#idKeys.some((key) => Object.hasOwn(overrides, key))) {
				throw new Error(`${this.#idKeys.join('; ')} is required!`);
			}
			const data = { ...structuredClone(this.#defaultValues), ...structuredClone(overrides) };
			this.#createdData.push(data);
		}

		const id = customId();
		const data = structuredClone(this.#defaultValues);
		this.#createdData.push({ id, ...data });
		this.#setActionState();
	}

	public editData(data: T) {
		if (this.#createdData.length) {
			this.discardChanges();
		}

		this.#updatedData.push(structuredClone($state.snapshot<unknown>(data)));
		this.#setActionState();
	}

	public cancelEdit(id: number) {
		this.#updatedData = this.#updatedData.filter((item) => item.id !== id);
		this.#setActionState();
	}

	public removeNewData(id: string) {
		this.#createdData = this.#createdData.filter((item) => item.id !== id);
		this.#setActionState();
	}

	public discardChanges() {
		if (this.#createdData.length) {
			this.#createdData = [];
		}
		if (this.#updatedData.length) {
			this.#updatedData = [];
		}

		this.#table = '';
		this.#setActionState();
	}

	#setActionState() {
		if (this.#createdData.length && !this.#updatedData.length) {
			this.#actionState = 'create';
		} else if (this.#updatedData.length && !this.#createdData.length) {
			this.#actionState = 'update';
		} else {
			this.#actionState = 'read';
		}
	}

	#isComposite() {
		return Array.isArray(this.#idKeys) && this.#idKeys.length > 1;
	}
}
