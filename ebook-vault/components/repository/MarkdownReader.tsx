// File location:
// components/markdown/MarkdownComponents.tsx

import type { Components } from "react-markdown";

export const markdownComponents: Components = {

  h1: ({ children }) => (
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


  h2: ({ children }) => (
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


  h3: ({ children }) => (
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


  p: ({ children }) => (
    <p
      className="
        my-5
        leading-8
        font-normal
        text-slate-600
      "
    >
      {children}
    </p>
  ),


  strong: ({ children }) => (
    <strong
      className="
        font-semibold
        text-slate-800
      "
    >
      {children}
    </strong>
  ),


  em: ({ children }) => (
    <em
      className="
        font-normal
        italic
        text-slate-600
      "
    >
      {children}
    </em>
  ),


  blockquote: ({ children }) => (
    <blockquote
      className="
        my-6
        rounded-r-lg
        border-l-4
        border-slate-300
        bg-slate-50
        px-5
        py-3
        font-normal
        italic
        text-slate-500
      "
    >
      {children}
    </blockquote>
  ),


  pre: ({ children }) => (
    <pre
      className="
        my-6
        overflow-x-auto
        rounded-xl
        bg-slate-900
        p-5
        text-sm
        font-normal
        text-slate-50
      "
    >
      {children}
    </pre>
  ),


  code: ({ children }) => (
    <code
      className="
        rounded-md
        bg-slate-100
        px-1.5
        py-1
        text-sm
        font-normal
        text-slate-800
      "
    >
      {children}
    </code>
  ),


  ul: ({ children }) => (
    <ul
      className="
        my-5
        list-disc
        space-y-2
        pl-6
        font-normal
        text-slate-600
      "
    >
      {children}
    </ul>
  ),


  ol: ({ children }) => (
    <ol
      className="
        my-5
        list-decimal
        space-y-2
        pl-6
        font-normal
        text-slate-600
      "
    >
      {children}
    </ol>
  ),


  li: ({ children }) => (
    <li
      className="
        leading-7
        font-normal
      "
    >
      {children}
    </li>
  ),


  table: ({ children }) => (
    <table
      className="
        my-6
        w-full
        border-collapse
        text-sm
        font-normal
      "
    >
      {children}
    </table>
  ),


  th: ({ children }) => (
    <th
      className="
        border
        border-slate-200
        bg-slate-50
        px-4
        py-2
        text-left
        font-semibold
        text-slate-700
      "
    >
      {children}
    </th>
  ),


  td: ({ children }) => (
    <td
      className="
        border
        border-slate-200
        px-4
        py-2
        font-normal
        text-slate-600
      "
    >
      {children}
    </td>
  ),

};