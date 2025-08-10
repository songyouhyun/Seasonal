export type Page<T> = {
  items: T[];
  nextOffset?: number;
};