// eslint-disable-next-line @typescript-eslint/ban-types
export type LiteralUnion<T extends U, U = string> = T | (U & {});
// eslint-disable-next-line @typescript-eslint/ban-types
export type LiteralNumberUnion<T extends U, U = number> = T | (U & {});

export type GenerateMappedNever<T> = {
	[key in keyof T]: never;
};
