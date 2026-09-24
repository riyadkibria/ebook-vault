// =====================================================
// File: lib/build-tree.ts
// =====================================================


export type TreeNode = {

  name: string;

  type: "file" | "folder";

  path: string;

  children?: TreeNode[];

};




interface GithubTreeItem {

  path: string;

  type: "blob" | "tree";

}




export function buildTree(

  paths: GithubTreeItem[]

): TreeNode[] {


  const root: TreeNode[] = [];



  for (const item of paths) {



    if (

      item.type !== "blob" ||

      !item.path

        .toLowerCase()

        .endsWith(".md")

    ) {

      continue;

    }





    const parts = item.path.split("/");



    let current = root;





    parts.forEach((part, index) => {



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

            : {

              children: []

            })

        };



        current.push(existing);



      }





      if (existing.children) {



        current = existing.children;



      }



    });



  }




  function sortTree(nodes: TreeNode[]) {



    nodes.sort((a,b)=>{



      if(a.type !== b.type){



        return a.type === "folder"

          ? -1

          : 1;



      }



      return a.name.localeCompare(

        b.name

      );



    });



    nodes.forEach(node=>{


      if(node.children){

        sortTree(node.children);

      }


    });



  }





  sortTree(root);



  return root;


}