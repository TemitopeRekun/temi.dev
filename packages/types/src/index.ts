export type Brand<T, B extends string> = T & { __brand: B };

export type Id = Brand<string, "id">;

export * from "./domain";
export * from "./constants";
