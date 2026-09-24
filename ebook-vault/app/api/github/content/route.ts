import {
  NextResponse,
} from "next/server";


import {
  getFileContent,
} from "@/lib/github";



export const dynamic = "force-dynamic";



export async function GET(
  request: Request
) {


  try {


    const {
      searchParams,
    } = new URL(request.url);



    const repo =
      searchParams.get("repo");



    const path =
      searchParams.get("path");




    if (!repo || !path) {


      return NextResponse.json(

        {
          error:
          "Repository and file path required",
        },

        {
          status:400,
        }

      );


    }





    const content =

      await getFileContent(
        path,
        repo
      );





    return NextResponse.json(

      {
        content,
      }

    );



  } catch(error) {


    console.error(
      "Content API error:",
      error
    );



    return NextResponse.json(

      {
        error:
        "Failed to fetch file content",
      },

      {
        status:500,
      }

    );


  }


}