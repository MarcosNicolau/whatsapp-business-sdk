/**
 * Adds string autocompletion as if it was a union, but allows other string values
 *
 * @example
 * let foo = LiteralUnion<"foo" | "bar">;
 * //I can compare it with another value and typescript does not complain!
 * //And I still have autocompletion!
 * if (foo === "other_value") return;
 */
export type LiteralUnion<T extends string> = T | (string & {}); // eslint-disable-line @typescript-eslint/ban-types

/**
 * Adds number autocompletion as if it was a union, but allows other number values
 *
 * @example
 * let foo = LiteralUnion<0| 1>;
 * //I can compare it with another value and typescript does not complain!
 * //And I still have autocompletion!
 * if (foo === 1) return;
 */
export type LiteralNumberUnion<T extends number> = T | (number & {}); // eslint-disable-line @typescript-eslint/ban-types

/**
 * Takes a type and maps all its values to never
 * This is mostly used keeping autocompletion with objects union
 *
 * @example
 * type Foo = {
 * 		property: string;
 * }
 *
 * type Bar = {
 * 		property_2: string;
 * }
 *
 * //I lose autocompletion because properties are not the same;
 * type ObjectUnion = Foo | Bar;
 *
 * //The great autocompletion is back again!
 * type ObjectUnionFixed = GeneratedMappedNever<Foo> | Bar;
 */
export type GenerateMappedNever<T> = {
	[key in keyof T]: never;
};
