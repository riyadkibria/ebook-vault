// File: app/api/github/tree/route.ts

import {
  NextResponse
} from "next/server";


import {
  getRepoTree
} from "@/lib/github";



export const dynamic = "force-dynamic";

export const revalidate = 0;



export async function GET(

  request: Request

){


  try {


    const {

      searchParams

    } = new URL(request.url);



    const repo =

      searchParams.get("repo");



    if(!repo){

      return NextResponse.json(

        {
          error: "Repository name is required"
        },

        {
          status:400
        }

      );

    }



    const files =

      await getRepoTree(repo);



    return NextResponse.json(

      files,

      {
        status:200
      }

    );


  } catch(error){


    console.error(

      "Tree API error:",

      error

    );



    return NextResponse.json(

      {
        error:"Failed to fetch repository tree"
      },

      {
        status:500
      }

    );


  }

}