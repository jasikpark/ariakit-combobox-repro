import { useEffect, useState } from "react";

const TAGS = [
  "endpoint:true",
  "env:development",
  "env:production",
  "env:staging",
  "env:testing",
  "quality:alpha",
  "quality:beta",
  "quality:gamma",
  "region:as-1",
  "region:eu-1",
  "region:us-1",
  "region:us-2",
];

export function useGetMaxTagsQuery() {
  const [tags, setTags] = useState<string[] | null>(null);

  useEffect(() => {
    Promise.resolve(TAGS).then((t) => setTags(t));
  }, []);

  if (tags) {
    return { tags, isLoading: false };
  }

  return { tags: undefined, isLoading: true };
}
