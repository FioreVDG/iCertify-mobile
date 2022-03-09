export interface Find {
  field: string;
  operator: string;
  value: string | number | boolean | Date | null | undefined;
}

export interface Populate {
  field: string;
  select?: string;
}

export interface Page {
  size: number;
}

export interface QueryParams {
  limit?: string;
  sort?: string;
  fields?: string;
  page?: number;
  find: Array<Find>;
  populates?: Array<Populate> | undefined;
  filter?: {
    value: string | boolean | number;
    fields: Array<string>;
  };
}
