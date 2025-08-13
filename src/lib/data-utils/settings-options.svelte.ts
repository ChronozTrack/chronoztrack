import type { AppOptionsType, OptionsBaseTable } from "$lib/app-types";

export class AppOptionsData<T extends OptionsBaseTable> {
  private _options: Record<AppOptionsType, T[]> = $state({
    jobs: [],
    departments: [],
    roles: [],
    time_events: [],
  })

  constructor(optionsData: Record<AppOptionsType, T[]>) {
    this._options = optionsData;
  }

  get options(): Record<AppOptionsType, T[]> {
    return this._options;
  }

  set options(val: Record<AppOptionsType, T[]>) {
    this._options = val;
  }

  public table(optionName: AppOptionsType) {
    return this._options[optionName];
  }

  public updateOptions(tableName: AppOptionsType, values: T | T[]) {
    if ((Array.isArray(values) && !values.length) || !values || !this._options[tableName]) {
      return;
    }

    const updates = Array.isArray(values) ? values : [values]
    const updateMap = new Map(updates.map(item => [item.id, item]));
    this._options[tableName] = this._options[tableName].map(item => updateMap.get(item.id) ?? item);

    const oldIds = new Set(this._options[tableName].map(item => item.id));
    const newId = updates.filter(item => !oldIds.has(item.id));

    this._options[tableName] = [...this._options[tableName], ...newId]
    this._options[tableName].sort((a, b) => a.id - b.id);
  }
}