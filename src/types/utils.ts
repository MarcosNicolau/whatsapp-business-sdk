// eslint-disable-next-line @typescript-eslint/ban-types
export type LiteralUnion<T extends U, U = string> = T | (U & {});

export type GenerateMappedNever<T> = {
	[key in keyof T]: never;
};
