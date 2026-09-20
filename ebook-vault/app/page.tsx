import {getRepoTree} from "@/lib/github";
import {buildTree} from "@/lib/buildTree";
import EbookExplorer from "@/components/EbookExplorer";


export default async function Home(){

const files = await getRepoTree();


const tree = buildTree(files);


return (

<EbookExplorer tree={tree}/>

)

}