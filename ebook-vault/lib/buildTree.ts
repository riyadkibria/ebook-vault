export type TreeNode = {
  name: string;
  type: "file" | "folder";
  path: string;
  children?: TreeNode[];
};


export function buildTree(paths: any[]): TreeNode[] {

  const root: TreeNode[] = [];


  for (const item of paths) {


    // only markdown files
    if (
      item.type !== "blob" ||
      !item.path.endsWith(".md")
    ) {
      continue;
    }


    const parts = item.path.split("/");


    let current = root;


    parts.forEach((part: string, index: number) => {


      const isFile =
        index === parts.length - 1;


      let existing = current.find(
        node => node.name === part
      );


      if (!existing) {


        existing = {

          name: part,

          type: isFile
            ? "file"
            : "folder",

          path: parts
            .slice(0, index + 1)
            .join("/"),


          ...(isFile
            ? {}
            : { children: [] })

        };


        current.push(existing);

      }


      if (
        existing.children
      ) {

        current = existing.children;

      }


    });

  }


  return root;

}