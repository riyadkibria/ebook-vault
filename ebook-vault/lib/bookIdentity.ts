// File location:
// lib/bookIdentity.ts


export function extractBookName(path: string) {

  return path

    // remove book emoji
    .replace("📘", "")

    .trim()

    // take only first part before /
    .split("/")[0]

    .trim();

}





export function extractChapterName(path: string) {

  const parts = path.split("/");


  // last part is chapter/file name

  return parts[parts.length - 1]

    .trim();

}