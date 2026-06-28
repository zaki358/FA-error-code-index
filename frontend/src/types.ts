export interface Category {
  name: string;
  products: string[];
}

export interface Manufacturer {
  name: string;
  categories: Category[];
}

export interface TreeResponse {
  data_dir: string;
  manufacturers: Manufacturer[];
}

export interface ErrorsResponse {
  columns: string[];
  rows: string[][];
}

export interface ConfigResponse {
  data_dir: string;
}

/** フィルタ後の1行を表す型。columns と同順の値配列 + ランク情報。 */
export interface ErrorRow {
  cells: string[];
  rank: number;
}
