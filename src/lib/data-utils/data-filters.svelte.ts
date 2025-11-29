import { SvelteMap } from "svelte/reactivity";

type TextFilter = {
  name: string;
  label: string;
  type?: never;
  options?: never;
};
type SelectFilter = {
  name: string;
  label: string;
  type: 'single' | 'multiple';
  options: {
    label: string;
    value: string;
  }[];
};

export type FilterDetails = TextFilter | SelectFilter;
export type FilterValues = { name: string; value?: string | string[] };

export class DataFilters {
  #filterList: FilterDetails[];
  #appliedFilters: FilterValues[] = $state([]);
  #draftFilters: FilterValues[] = $state([]);
  #limit: number = $state(25);
  #pageKeys: number[] = $state([]);
  #pageQuery: number = $state(0);
  #page: number = $state(1);

  constructor(filterList: FilterDetails[], url?: URL, limit?: number) {
    this.#filterList = filterList;
    this.#limit = limit ?? 25
    if (url && url.search.length > 0) {
      this.#setFilterFromUrl(url, filterList)
    }

    if (!this.#draftFilters.length) {
      this.addFilter()
    }

  }

  get filterList() {
    return this.#filterList;
  }

  get appliedFilters() {
    return this.#appliedFilters;
  }

  get draftFilters() {
    return this.#draftFilters;
  }

  get draftValues() {
    return this.#draftFilters.map(({ name, value }) => {
      return {
        name,
        value: Array.isArray(value) ? value.join(",") : value
      }
    })
  }

  get limit() {
    return this.#limit;
  }

  get pageQuery() {
    return this.#pageQuery;
  }

  get page() {
    return this.#page;
  }

  set page(v: number) {
    this.#page = v;
  }

  set pageQuery(num: number) {
    this.#pageQuery = num;
  }

  set limit(value: number) {
    this.#limit = value;
  }

  get strLimit() {
    return String(this.#limit)
  }

  get size() {
    return this.#appliedFilters.reduce((count, obj) => {
      if (obj.name !== '' && obj?.value?.length) {
        count++;
      }
      return count;
    }, 0)
  }

  set strLimit(value: string) {
    this.#limit = Number(value)
  }

  set appliedFilters(value: FilterValues[]) {
    this.#appliedFilters = value;
  }

  set draftFilters(value: FilterValues[]) {
    this.#draftFilters = value;
  }

  get pageKeys() {
    return this.#pageKeys
  }
  get pageKeysStr() {
    return this.#pageKeys.length > 0 ? this.#pageKeys.join(",") : ''
  }

  #setFilterFromUrl(url: URL, filterList: FilterDetails[]) {
    const params = new URLSearchParams(url.search);
    params.forEach((value, key) => {
      const filter = filterList.find(f => f.name === key);
      if (filter) {
        this.#appliedFilters.push({ name: key, value })
        this.#draftFilters.push({ name: key, value })
      }
    })
  }

  addPageKeys(key: number) {
    this.#pageKeys.push(key)
  }

  addFilter() {
    if (this.#filterList.length > this.#draftFilters.length) {
      this.#draftFilters.push({ name: '' });
    }
  }

  removeFilter(idx: number) {
    if (idx > -1 && idx < this.#draftFilters.length) {
      if (this.#draftFilters.length === 1) {
        this.#draftFilters[0] = { name: '' };
      } else {
        this.#draftFilters.splice(idx, 1);
      }
    }
  }

  updateFilters() {
    this.#appliedFilters = structuredClone($state.snapshot(this.#draftFilters))
  }

  isNameDrafted(name: string) {
    return this.#draftFilters.some(f => f.name === name);
  }

  getFilter(name: string) {
    return this.#filterList.find(f => f.name === name);
  }

  canAddFilter() {
    return this.#filterList.length > this.#draftFilters.length && this.#draftFilters.every(f => f.name !== '');
  }
}