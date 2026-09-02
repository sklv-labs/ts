import { v7 as uuidv7 } from 'uuid';
import { z } from 'zod';

declare const brand: unique symbol;

/**
 * A UUID string tagged with a brand, so a `Uuid<'User'>` cannot be passed where a
 * `Uuid<'Order'>` is expected. The brand exists only in the type system.
 */
export type Uuid<B = unknown> = string & { readonly [brand]: B };

const uuidV7 = z.uuid({ version: 'v7' });

/** Validates that `value` is a UUID v7 and narrows it to the requested brand. */
export const isUuid = <T extends Uuid>(value: string): value is T =>
  uuidV7.safeParse(value).success;

/**
 * Tags an already-trusted string as a branded UUID — for values that came from a source
 * that guarantees the format, such as a database column. Performs no validation; use
 * {@link isUuid} when the value is untrusted.
 */
export function asUuid<T extends Uuid>(value: string): T;
export function asUuid<T extends Uuid>(value: string | null): T | null;
export function asUuid<T extends Uuid>(value: string | undefined): T | undefined;
export function asUuid<T extends Uuid>(value: string | null | undefined): T | null | undefined {
  return value as T | null | undefined;
}

/** Generates a UUID v7 — time-ordered, so it indexes well as a primary key. */
export const uuid = <T extends Uuid>(): T => uuidv7() as T;
