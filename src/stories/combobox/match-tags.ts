export const LIMIT = 50;

export function matchTags(tags: string[], search: string) {
  return tags
    .filter((tag) => {
      const [key, value] = tag.split(':');
      return !!key?.startsWith(search) || !!value?.startsWith(search) || tag.startsWith(search);
    })
    .slice(0, LIMIT);
}
