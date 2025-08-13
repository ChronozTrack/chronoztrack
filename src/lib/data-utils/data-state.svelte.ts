import { customId } from "$lib/utils"
import type { UserAction } from "$lib/app-types";

export type WithTemporaryId<T> = Omit<T, 'id'> & { id: string };

/**
 * User actions state should only be one at a time, ['create','update','read','delete?']
 */
export class DataState<T extends { id: number }> {
  #createdData: WithTemporaryId<T>[] = $state([]);
  #updatedData: T[] = $state([]);
  #table: string = $state("");
  #defaultValues: Omit<T, 'id'>;
  #actionState: UserAction = $state('read')

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
    return (this.#createdData.length || this.#updatedData.length) > 0;
  }

  get actionState(){
    return this.#actionState;
  }

  set table(value: unknown) {
    this.#table = String(value);
  }

  public addData() {
    if(this.#updatedData.length){
      this.discardChanges();
    }

    const id = customId();
    const data = structuredClone(this.#defaultValues)
    this.#createdData.push({ id, ...data });
    this.#setActionState();
  }

  public editData(data: T) {
    if(this.#createdData.length){
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
    this.#createdData = this.#createdData.filter((item) => item.id !== id)
    this.#setActionState();
  }

  public discardChanges(){
    if(this.#createdData.length){
      this.#createdData = [];
    }
    if(this.#updatedData.length){
      this.#updatedData = [];
    }

    this.#table = "";
    this.#setActionState();
  }

  #setActionState(){
    if(this.#createdData.length && !this.#updatedData.length){
      this.#actionState = 'create';
    }else if(this.#updatedData.length && !this.#createdData.length){
      this.#actionState = 'update';
    }else {
      this.#actionState = 'read';
    }
  }
}
