// ===========================================================
// File: components/repository/MarkdownReader.tsx
// ===========================================================

"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";



interface Props {

  content: string;

  fileName?: string;

}



export default function MarkdownReader({

  content,

  fileName,

}: Props) {



  if (!content) {

    return (

      <div

        className="
          flex
          h-full
          items-center
          justify-center
          text-sm
          text-gray-400
        "

      >

        No content available.

      </div>

    );

  }



  return (

    <article

      className="
        mx-auto
        w-full
        max-w-5xl
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-6
        shadow-sm
        sm:p-10
      "

    >



      {
        fileName && (

          <div

            className="
              mb-8
              border-b
              border-gray-100
              pb-5
            "

          >

            <h1

              className="
                truncate
                text-xl
                font-semibold
                text-gray-800
                sm:text-2xl
              "

            >

              {fileName}

            </h1>


          </div>

        )
      }





      <div

        className="
          prose
          prose-gray
          max-w-none

          prose-headings:font-semibold
          prose-headings:text-gray-900

          prose-p:text-gray-700
          prose-p:leading-8

          prose-a:text-blue-600

          prose-blockquote:border-blue-200
          prose-blockquote:text-gray-600

          prose-code:rounded
          prose-code:bg-gray-100
          prose-code:px-1
          prose-code:py-0.5
          prose-code:text-sm

          prose-pre:rounded-xl
          prose-pre:bg-gray-900

          sm:prose-lg
        "

      >


        <ReactMarkdown

          remarkPlugins={[

            remarkGfm,

          ]}

          components={{



            h1: ({

              children,

            }) => (

              <h1

                className="
                  mt-10
                  mb-5
                  text-3xl
                  font-bold
                  text-gray-900
                  sm:text-4xl
                "

              >

                {children}

              </h1>

            ),



            h2: ({

              children,

            }) => (

              <h2

                className="
                  mt-10
                  mb-4
                  border-b
                  border-gray-100
                  pb-2
                  text-2xl
                  font-semibold
                  text-gray-900
                "

              >

                {children}

              </h2>

            ),



            h3: ({

              children,

            }) => (

              <h3

                className="
                  mt-8
                  mb-3
                  text-xl
                  font-semibold
                  text-gray-800
                "

              >

                {children}

              </h3>

            ),



            p: ({

              children,

            }) => (

              <p

                className="
                  my-5
                  leading-8
                  text-gray-700
                "

              >

                {children}

              </p>

            ),



            blockquote: ({

              children,

            }) => (

              <blockquote

                className="
                  my-6
                  rounded-r-lg
                  border-l-4
                  border-gray-300
                  bg-gray-50
                  px-5
                  py-3
                  italic
                  text-gray-600
                "

              >

                {children}

              </blockquote>

            ),



            pre: ({

              children,

            }) => (

              <pre

                className="
                  my-6
                  overflow-x-auto
                  rounded-xl
                  bg-gray-900
                  p-5
                  text-sm
                  text-white
                  shadow-sm
                "

              >

                {children}

              </pre>

            ),



            code: ({

              children,

            }) => (

              <code

                className="
                  rounded-md
                  bg-gray-100
                  px-1.5
                  py-1
                  text-sm
                  text-gray-800
                "

              >

                {children}

              </code>

            ),



            ul: ({

              children,

            }) => (

              <ul

                className="
                  my-5
                  list-disc
                  space-y-2
                  pl-6
                  text-gray-700
                "

              >

                {children}

              </ul>

            ),



            ol: ({

              children,

            }) => (

              <ol

                className="
                  my-5
                  list-decimal
                  space-y-2
                  pl-6
                  text-gray-700
                "

              >

                {children}

              </ol>

            ),



            li: ({

              children,

            }) => (

              <li

                className="
                  leading-7
                "

              >

                {children}

              </li>

            ),



            table: ({

              children,

            }) => (

              <div

                className="
                  my-6
                  overflow-x-auto
                "

              >

                <table

                  className="
                    w-full
                    border-collapse
                    text-sm
                  "

                >

                  {children}

                </table>

              </div>

            ),



            th: ({

              children,

            }) => (

              <th

                className="
                  border
                  bg-gray-50
                  px-4
                  py-2
                  text-left
                  font-semibold
                "

              >

                {children}

              </th>

            ),



            td: ({

              children,

            }) => (

              <td

                className="
                  border
                  px-4
                  py-2
                "

              >

                {children}

              </td>

            ),



          }}

        >

          {content}

        </ReactMarkdown>


      </div>


    </article>

  );

}