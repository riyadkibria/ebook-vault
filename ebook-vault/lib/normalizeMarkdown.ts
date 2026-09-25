
Code:

```ts
export function normalizeMarkdown(text: string) {
  return text
    // remove unmatched bold markers
    .replace(/(?<!\*)\*\*(?!\s)(.*?)(?<!\s)\*\*/g, "$1")

    // remove unmatched underscore bold/italic
    .replace(/__(.*?)__/g, "$1")

    // normalize multiple spaces
    .replace(/\n{3,}/g, "\n\n")

    // remove accidental html bold
    .replace(/<\/?b>/g, "")

    // remove accidental strong html
    .replace(/<\/?strong>/g, "");
}