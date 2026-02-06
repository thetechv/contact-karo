import { useParams } from "next/navigation";

export function useTagId() {
  const params = useParams();
  const idParam = params?.id;

  const id = Array.isArray(idParam)
    ? (idParam[0] ?? "")
    : ((idParam as string | undefined) ?? "");

  return { id };
}
