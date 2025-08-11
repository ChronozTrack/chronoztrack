import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";

export const customId = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 8);

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function pathnameToDots(pathname: string): string{
  return pathname
    .split('/')
    .filter(Boolean)
    .map(part => {
      if (/^\[.*\]$/.test(part)) return null;       // `[userId]` → null
      if (/^\d+$/.test(part)) return null;          // `123` → null
      return part.replaceAll("-", "_");
    })
    .filter(Boolean)
    .join('.');
};

export function formDataToNestedObject<T extends Record<string, any>>(formData: FormData): T {
	const result: Record<string, any> = {};

	for (const [rawKey, value] of formData.entries()) {
		// Example: "people[0][address][city]" → ["people", "0", "address", "city"]
		const keys = rawKey.replace(/\]/g, '').split('[');

		let current = result;
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];

			// Last key → assign value
			if (i === keys.length - 1) {
				current[key] = value.toString();
			} else {
				const nextKey = keys[i + 1];
				const isArrayIndex = !isNaN(Number(nextKey));

				if (!current[key]) {
					current[key] = isArrayIndex ? [] : {};
				}

				current = current[key];
			}
		}
	}

	return result as T;
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
