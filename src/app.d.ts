// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
// 0
import { User, Session } from "$lib/app-types";
declare global {
  namespace App {
    interface Locals {
      user: User | null;
      session: Session | null;
    }
    // interface Error {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export { };
