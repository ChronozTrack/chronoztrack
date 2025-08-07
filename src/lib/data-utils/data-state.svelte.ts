import { SvelteMap } from "svelte/reactivity";
import { customId } from "$lib/utils"

export type WithTemporaryId<T> = Omit<T, 'id'> & { id: string };

export class DataState<T extends { id: number }> {
  #createdData: Map<string, WithTemporaryId<T>> = new SvelteMap();
  #updatedData: Map<number, T> = new SvelteMap();
  #table: string = $state("");
  #defaultValues: Omit<T, 'id'>;

  constructor(table: unknown, defaultValues: Omit<T, 'id'>) {
    this.#table = String(table);
    this.#defaultValues = defaultValues;
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

  get hasChanges(){
    return (this.#createdData.size || this.#updatedData.size) > 0;
  }

  set table(value: unknown) {
    this.#table = String(value);
  }

  public addData() {
    const id = customId();
    const data = structuredClone(this.#defaultValues)
    this.#createdData.set(id, { id, ...data });
  }

  public editData(data: T) {
    this.#updatedData.set(data.id, structuredClone(data));
  }

  public cancelEdit(id: number) {
    this.#updatedData.delete(id);
  }

  public removeNewData(id: string) {
    this.#createdData.delete(id)
  }

  public discardChanges(){
    if(this.#createdData.size){
      this.#createdData.clear();
    }
    if(this.#updatedData.size){
      this.#updatedData.clear();
    }

    this.#table = "";
  }
}