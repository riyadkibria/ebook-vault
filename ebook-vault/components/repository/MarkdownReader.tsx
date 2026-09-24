// ===========================================================
// File: components/repository/MarkdownReader.tsx
// ===========================================================

"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileText } from "lucide-react";



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
          font-medium
          text-slate-400
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
        border-slate-200/70
        bg-white
        p-6
        shadow-sm
        shadow-slate-900/[0.03]
        ring-1
        ring-slate-900/[0.02]
        sm:p-10
      "

    >



      {
        fileName && (

          <div

            className="
              mb-8
              flex
              items-center
              gap-3
              border-b
              border-slate-100
              pb-5
            "

          >

            <div

              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-slate-100
              "

            >

              <FileText

                size={16}

                className="text-slate-500"

              />

            </div>

            <h1

              className="
                truncate
                text-xl
                font-semibold
                tracking-tight
                text-slate-800
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
          prose-slate
          max-w-none

          prose-headings:font-semibold
          prose-headings:tracking-tight
          prose-headings:text-slate-900

          prose-p:text-slate-600
          prose-p:leading-8

          prose-a:text-slate-900
          prose-a:underline
          prose-a:decoration-slate-300
          prose-a:underline-offset-4
          hover:prose-a:decoration-slate-500

          prose-strong:text-slate-800

          prose-blockquote:border-slate-300
          prose-blockquote:text-slate-500

          prose-code:rounded
          prose-code:bg-slate-100
          prose-code:px-1
          prose-code:py-0.5
          prose-code:text-sm

          prose-pre:rounded-xl
          prose-pre:bg-slate-900

          prose-img:rounded-xl
          prose-img:shadow-sm

          prose-hr:border-slate-100

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
                  tracking-tight
                  text-slate-900
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
                  border-slate-100
                  pb-2
                  text-2xl
                  font-semibold
                  tracking-tight
                  text-slate-900
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
                  text-slate-800
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
                  text-slate-600
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
                  border-slate-300
                  bg-slate-50
                  px-5
                  py-3
                  italic
                  text-slate-500
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
                  bg-slate-900
                  p-5
                  text-sm
                  text-slate-50
                  shadow-md
                  shadow-slate-900/10
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
                  bg-slate-100
                  px-1.5
                  py-1
                  text-sm
                  text-slate-800
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
                  text-slate-600
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
                  text-slate-600
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
                  rounded-xl
                  border
                  border-slate-200
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
                  border-b
                  border-slate-200
                  bg-slate-50
                  px-4
                  py-2.5
                  text-left
                  font-semibold
                  text-slate-700
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
                  border-b
                  border-slate-100
                  px-4
                  py-2.5
                  text-slate-600
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