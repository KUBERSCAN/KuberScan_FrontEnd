import { signal } from "@preact/signals";

export const ErrorBoxVisible = signal<boolean>(false);
export const ErrorBoxVisible2 = signal<boolean>(false);
export const deletedPods = signal<number>(0);
export const quarantinedPods = signal<number>(0);