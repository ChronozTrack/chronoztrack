
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
  #currentFilters: FilterValues[] = $state([{ name: '', value: undefined }]);
  #draftFilters: FilterValues[] = $state([{ name: '', value: undefined }]);
  #limit: number;

  constructor(filterList: FilterDetails[], limit?: number) {
    this.#filterList = filterList;
    this.#limit = limit ?? 25;
  }

  get filterList() {
    return this.#filterList;
  }

  get currentFilters() {
    return this.#currentFilters;
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

  set limit(value: number) {
    this.#limit = value;
  }

  get strLimit() {
    return String(this.#limit);
  }

  set strLimit(value: string) {
    this.#limit = Number(value) || 25;
  }

  set currentFilters(value: FilterValues[]) {
    this.#currentFilters = value;
  }

  set draftFilters(value: FilterValues[]) {
    this.#draftFilters = value;
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
    this.#currentFilters = structuredClone($state.snapshot(this.#draftFilters))
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