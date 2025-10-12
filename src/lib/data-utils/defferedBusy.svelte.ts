export class BusyDeferred<T = void> {
	isBusy = $state(false);

	private _resolve!: (value?: T) => void;
	private _reject!: (reason?: any) => void;
	private _timer: ReturnType<typeof setTimeout> | null = null;
	private _onComplete: ((result: 'resolved' | 'rejected' | 'cancelled') => void) | null = null;

	private _promise!: Promise<T>;

	constructor() {
		this._createPromise();
	}

	private _createPromise(): void {
		this._promise = new Promise<T>((resolve, reject) => {
			this._resolve = (value?: T) => {
				this._cleanup();
				this.isBusy = false;
				resolve(value as T);
				this._onComplete?.('resolved');
			};

			this._reject = (reason?: any) => {
				this._cleanup();
				this.isBusy = false;
				reject(reason);
				this._onComplete?.('rejected');
			};
		});
	}

	private _cleanup(): void {
		if (this._timer) {
			clearTimeout(this._timer);
			this._timer = null;
		}
	}

	start(timeoutMs?: number): void {
		this._createPromise();
		this.isBusy = true;

		if (timeoutMs) {
			this._timer = setTimeout(() => {
				this.reject(new Error('Operation timed out'));
			}, timeoutMs);
		}
	}

	resolve(value?: T): void {
		this._resolve(value);
	}

	reject(reason?: any): void {
		this._reject(reason);
	}

	cancel(reason: string = 'Operation cancelled'): void {
		if (this.isBusy) {
			this.reject(new Error(reason));
			this._onComplete?.('cancelled');
		}
		this.reset();
	}

	reset(): void {
		this._cleanup();
		this.isBusy = false;
		this._createPromise();
	}

	onComplete(callback: (result: 'resolved' | 'rejected' | 'cancelled') => void): void {
		this._onComplete = callback;
	}

	/**
	 * Return the current (or newly refreshed) promise and do cleanup.
	 */
	promise(): Promise<T> {
		this._cleanup(); // cancel any pending timeout
		this._createPromise(); // fresh promise
		return this._promise;
	}
}
