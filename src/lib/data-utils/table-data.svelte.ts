import {SvelteMap} from 'svelte/reactivity';

export class TableDataState<T, K extends keyof T>{
  #map: Map<string, T>;
  #idKeys: K[];
  #comparator?: (a: T, b: T) => number;

  constructor(data: T[], idKeys: K[], comparator?: (a: T, b: T) => number){
    this.#idKeys = idKeys;
    this.#map = new SvelteMap(data.map(item => [this.#keyMaps(item), item]));
    this.#comparator = comparator;
  }

  get data(): T[]{
    const arr = Array.from(this.#map.values());
    if(this.#comparator){
      return arr.sort(this.#comparator);
    }

    return arr;
  }

  get size(): number{
    return this.#map.size;
  }

  get rawMap(){
    return this.#map;
  }

  set data(val: T[]){
    this.#map.clear();
    this.update(val)
  }

  #keyMaps(values: Partial<T>){
    return this.#idKeys.map(k => JSON.stringify(values[k])).join(":");
  }

  public update(values: T | T[]): void {
    const updates = Array.isArray(values) ? values : [values];
    if (updates.length === 0) return;

    for (const item of updates) {
      this.#map.set(this.#keyMaps(item), item);
    }
  }

  public getById(idObj: Pick<T, K>): T | undefined {
    return this.#map.get(this.#idKeys.map(k => JSON.stringify(idObj[k])).join(":"));
  }

  public remove(values: T | T[]): void {
    const items = Array.isArray(values) ? values : [values];
    for (const item of items) {
      this.#map.delete(this.#keyMaps(item));
    }
  }

  public has(values: Partial<T>): boolean {
    return this.#map.has(this.#keyMaps(values));
  }

  public clear(): void {
    this.#map.clear();
  }

  public setComparator(fn?: (a: T, b: T) => number): void {
    this.#comparator = fn;
  }
}
