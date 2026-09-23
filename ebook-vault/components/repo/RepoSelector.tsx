"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Repo } from "./RepoCard";

interface Props {
  repos: Repo[];

  onChange: (
    repositories: Repo[]
  ) => void;
}

type SortOption =
  | "updated"
  | "stars"
  | "name";

export default function RepoSelector({
  repos,
  onChange,
}: Props) {

  const [search, setSearch] =
    useState("");

  const [language, setLanguage] =
    useState("all");

  const [sort, setSort] =
    useState<SortOption>("updated");


  // ----------------------------------------
  // Languages
  // ----------------------------------------

  const languages = useMemo(() => {

    return [
      "all",

      ...Array.from(

        new Set(

          repos.map(

            (repo) =>
              repo.language ?? "Unknown"

          )

        )

      ),

    ];

  }, [repos]);


  // ----------------------------------------
  // Filter + Sort
  // ----------------------------------------

  const filteredRepos = useMemo(() => {

    let result = [...repos];

    // Search

    if (search.trim()) {

      const keyword =
        search.toLowerCase();

      result = result.filter(

        (repo) =>

          repo.name
            .toLowerCase()
            .includes(keyword)

          ||

          repo.fullName
            .toLowerCase()
            .includes(keyword)

          ||

          (repo.description ?? "")
            .toLowerCase()
            .includes(keyword)

      );

    }

    // Language

    if (language !== "all") {

      result = result.filter(

        (repo) =>

          (repo.language ?? "Unknown")
            === language

      );

    }

    // Sorting

    switch (sort) {

      case "name":

        result.sort(

          (a, b) =>
            a.name.localeCompare(b.name)

        );

        break;

      case "stars":

        result.sort(

          (a, b) =>
            b.stars - a.stars

        );

        break;

      case "updated":

      default:

        result.sort(

          (a, b) =>

            new Date(
              b.updatedAt
            ).getTime()

            -

            new Date(
              a.updatedAt
            ).getTime()

        );

    }

    return result;

  }, [
    repos,
    search,
    language,
    sort,
  ]);


  // ----------------------------------------
  // Notify Parent
  // ----------------------------------------

  useEffect(() => {

    onChange(filteredRepos);

  }, [
    filteredRepos,
    onChange,
  ]);


  // ----------------------------------------
  // UI
  // ----------------------------------------

  return (

    <div

      className="
        mb-6
        flex
        flex-col
        gap-4
        rounded-2xl
        border
        bg-white
        p-5
        shadow-sm
        lg:flex-row
      "

    >

      {/* Search */}

      <input

        type="text"

        placeholder="Search repository..."

        value={search}

        onChange={(event) =>

          setSearch(
            event.target.value
          )

        }

        className="
          flex-1
          rounded-xl
          border
          px-4
          py-3
          outline-none
          focus:ring-2
          focus:ring-blue-500
        "

      />


      {/* Language */}

      <select

        value={language}

        onChange={(event) =>

          setLanguage(
            event.target.value
          )

        }

        className="
          rounded-xl
          border
          px-4
          py-3
        "

      >

        {languages.map((item) => (

          <option

            key={item}

            value={item}

          >

            {item}

          </option>

        ))}

      </select>


      {/* Sort */}

      <select

        value={sort}

        onChange={(event) =>

          setSort(
            event.target.value as SortOption
          )

        }

        className="
          rounded-xl
          border
          px-4
          py-3
        "

      >

        <option value="updated">
          Recently Updated
        </option>

        <option value="stars">
          Most Stars
        </option>

        <option value="name">
          Name (A-Z)
        </option>

      </select>

    </div>

  );

}