import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { QuestionTemplate } from "../backend.d";
import { useBackend } from "./useBackend";

export function useTemplates() {
  const { actor, isFetching } = useBackend();
  return useQuery<QuestionTemplate[]>({
    queryKey: ["templates"],
    queryFn: async () => {
      if (!actor) return [];
      const templates = await actor.getTemplates();
      return [...templates].sort((a, b) => Number(b.createdAt - a.createdAt));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTemplate() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.createTemplate(name);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["templates"] }),
  });
}

export function useUpdateTemplate() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: bigint; name: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateTemplate(id, name);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["templates"] }),
  });
}

export function useDeleteTemplate() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteTemplate(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["templates"] }),
  });
}
