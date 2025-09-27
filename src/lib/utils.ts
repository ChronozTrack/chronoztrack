import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { customAlphabet } from 'nanoid';
import { getTimeZones, type TimeZone } from '@vvo/tzdb';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export type RawFormDataShape<T> = T extends object
	? { [K in keyof T]: RawFormDataShape<T[K]> }
	: FormDataEntryValue;

export const customId = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 8);

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export type TimeZonesInfo = Pick<TimeZone, 'rawFormat' | 'rawOffsetInMinutes' | 'name' | 'alternativeName'> & { offset: string, label: string, shortLabel: string, value: string };

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

export function pathnameToResource(
	pathname: string,
	{ mode = "full" }: { mode?: "full" | "last" } = {}
): string {
	const parts = pathname
		.split("/")
		.filter(Boolean)
		.map((part) => {
			// Ignore dynamic routes
			if (/^\[\.{3}.*\]$/.test(part)) return null;
			if (/^\[.*\]$/.test(part)) return null;

			// Ignore pure numeric segments
			if (/^\d+$/.test(part)) return null;

			return part.toLowerCase().replace(/-/g, "_");
		})
		.filter(Boolean);

	if (mode === "last") {
		return parts.at(-1) ?? "";
	}

	return parts.join(".");
}

export function getTimezoneMaps() {
	const timeZones = getTimeZones();
	const timeZonesMap: Map<string, TimeZonesInfo> = new Map();
	const timeZonesRawMap: Map<string, TimeZonesInfo> = new Map();
	timeZones.forEach(tz => {
		const { rawFormat, rawOffsetInMinutes, alternativeName, name } = tz;
		const offset = rawFormat.split(" ", 1)[0]
		const obj = {
			rawFormat, rawOffsetInMinutes, alternativeName, name, offset,
			label: `(${offset} ${name}) ${alternativeName}`,
			shortLabel: `${offset} ${name}`,
			value: rawFormat,
		}
		timeZonesMap.set(name, obj)
		timeZonesRawMap.set(rawFormat, obj)
	})
	return { timeZones, timeZonesMap, timeZonesRawMap }
}

export function timeToMinutes(time: string) {
	const [hours, minutes] = time.split(":").map(Number)
	return minutes + hours * 60
}

export function getEndTime(startTime: string, durationMinutes: number) {
	let endMinutes = timeToMinutes(startTime) + Number(durationMinutes);
	if (endMinutes >= 24 * 60) {
		endMinutes -= 24 * 60;
	}
	const hours = Math.floor(endMinutes / 60);
	const minutes = endMinutes % 60;
	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

export function convertTo12Hour(time: string = '') {
	if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) return "-";
	
	let [hours, minutes] = time.split(":").map(Number);
	const ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours === 0 ? 12 : hours;

	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`
}

export function getDateFormat(date: Date = new Date()) {
	return date.toISOString().split("T", 1)[0]
}