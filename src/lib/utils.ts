import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { customAlphabet } from 'nanoid';

export const customId = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 8);

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export type RawFormDataShape<T> = T extends object
	? { [K in keyof T]: RawFormDataShape<T[K]> }
	: FormDataEntryValue;

function preNormalize(value: FormDataEntryValue) {
	if (typeof value === 'string' && value === 'false') {
		return '';
	}

	return value;
}

export function parseFormData<T extends Record<string, unknown>>(
	formData: FormData
): RawFormDataShape<T> {
	const result: Record<string, unknown> = {};

	for (const [rawKey, rawValue] of formData.entries()) {
		const keys = rawKey.replace(/\]/g, '').split('[');
		const value = preNormalize(rawValue);
		let current: Record<string, unknown> | unknown[] = result;

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			const isLast = i === keys.length - 1;

			if (isLast) {
				if (Array.isArray(current)) {
					current[Number(key)] = value;
				} else {
					current[key] = value;
				}
			} else {
				const nextKey = keys[i + 1];
				const isArrayIndex = !isNaN(Number(nextKey));

				if (Array.isArray(current)) {
					if (!current[Number(key)]) {
						current[Number(key)] = isArrayIndex ? [] : {};
					}
					current = current[Number(key)] as Record<string, unknown> | unknown[];
				} else {
					if (!current[key]) {
						current[key] = isArrayIndex ? [] : {};
					}
					current = current[key] as Record<string, unknown> | unknown[];
				}
			}
		}
	}

	return result as RawFormDataShape<T>;
}

export async function parseRequest<T extends Record<string, unknown>>(
	req: Request
): Promise<RawFormDataShape<T>> {
	const formData = await req.formData();
	return parseFormData<T>(formData);
}

export function pathnameToDots(pathname: string): string {
	return pathname
		.split('/')
		.filter(Boolean)
		.map((part) => {
			if (/^\[.*\]$/.test(part)) return null; // `[userId]` → null
			if (/^\d+$/.test(part)) return null; // `123` → null
			return part.replaceAll('-', '_');
		})
		.filter(Boolean)
		.join('.');
}
