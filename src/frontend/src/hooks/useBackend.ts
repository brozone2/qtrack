import { useActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";
import type { backendInterface } from "../backend.d";

/**
 * Returns the typed backend actor instance.
 * actor will be null while the backend is loading.
 */
export function useBackend(): {
  actor: backendInterface | null;
  isFetching: boolean;
} {
  return useActor(createActor);
}
