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

          rounded-xl

          border

          bg-white

          p-6

          text-gray-500

        "

      >

        No content available.

      </div>

    );



  }





  return (



    <article

      className="

        rounded-xl

        border

        bg-white

        p-8

        shadow-sm

        prose

        prose-gray

        max-w-none

      "

    >





      {
        fileName && (

          <h1

            className="

              mb-6

              text-2xl

              font-bold

              not-prose

            "

          >

            {fileName}

          </h1>


        )
      }







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

                mt-8

                mb-4

                text-4xl

                font-bold

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

                mt-8

                mb-3

                text-2xl

                font-semibold

              "

            >

              {children}

            </h2>



          ),






          p: ({

            children,

          }) => (



            <p

              className="

                my-4

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

                border-l-4

                pl-4

                italic

                text-gray-600

              "

            >

              {children}

            </blockquote>



          ),






          code: ({

            children,

          }) => (



            <code

              className="

                rounded

                bg-gray-100

                px-1

                py-0.5

                text-sm

              "

            >

              {children}

            </code>



          ),






          pre: ({

            children,

          }) => (



            <pre

              className="

                my-6

                overflow-x-auto

                rounded-lg

                bg-gray-900

                p-5

                text-sm

                text-white

              "

            >

              {children}

            </pre>



          ),






          li: ({

            children,

          }) => (



            <li

              className="

                my-1

              "

            >

              {children}

            </li>



          ),




        }}

      >

        {content}

      </ReactMarkdown>





    </article>



  );

}