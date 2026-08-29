"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import CritiqueCard from "~/components/CritiqueCard";
import type { CritiqueMetadata, CritiqueType } from "~/lib/critiques";
import BackButton from "~/components/BackButton";
import PageHeader from "~/components/PageHeader";

const typeFilters: { label: string; value: CritiqueType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Albums", value: "album" },
  { label: "Books", value: "book" },
  { label: "Movies", value: "movie" },
  { label: "Games", value: "game" },
];

const sortOptions = [
  { label: "Best", value: "best" },
  { label: "Worst", value: "worst" },
  { label: "ABC", value: "abc" },
  { label: "ZXY", value: "zxy" },
] as const;

type SortValue = (typeof sortOptions)[number]["value"];

interface CritiquesGridProps {
  critiques: CritiqueMetadata[];
}

export default function CritiquesGrid({ critiques }: CritiquesGridProps) {
  const [filter, setFilter] = useState<CritiqueType | "all">("all");
  const [sort, setSort] = useState<SortValue>("best");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filtered = useMemo(() => {
    let result =
      filter === "all" ? critiques : critiques.filter((c) => c.type === filter);

    switch (sort) {
      case "best":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case "worst":
        result = [...result].sort((a, b) => a.rating - b.rating);
        break;
      case "abc":
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "zxy":
        result = [...result].sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return result;
  }, [critiques, filter, sort]);

  const activeFilterLabel =
    typeFilters.find((f) => f.value === filter)?.label ?? "All";

  return (
    <>
      <BackButton href="/" />
      <PageHeader
        title={filter === "all" ? "Critiques" : activeFilterLabel}
        subtitle="Albums, books, movies and games."
        actions={
          <div className="flex shrink-0 gap-snug">
            {/* Filter dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowFilterMenu(!showFilterMenu);
                  setShowSortMenu(false);
                }}
                className="flex items-center gap-tight rounded-md border border-border px-cozy py-snug text-small text-muted-foreground transition-colors hover:text-foreground"
              >
                {activeFilterLabel}
                <ChevronDown className="h-icon w-icon" />
              </button>
              <AnimatePresence>
                {showFilterMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 z-10 mt-tight min-w-menu overflow-hidden rounded-md border border-border bg-card shadow-sm"
                  >
                    {typeFilters.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => {
                          setFilter(f.value);
                          setShowFilterMenu(false);
                        }}
                        className={`block w-full px-cozy py-snug text-left text-small transition-colors hover:bg-accent ${
                          filter === f.value
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSortMenu(!showSortMenu);
                  setShowFilterMenu(false);
                }}
                className="flex items-center gap-tight rounded-md border border-border px-cozy py-snug text-small text-muted-foreground transition-colors hover:text-foreground"
              >
                {sortOptions.find((s) => s.value === sort)?.label}
                <ChevronDown className="h-icon w-icon" />
              </button>
              <AnimatePresence>
                {showSortMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 z-10 mt-tight min-w-menu overflow-hidden rounded-md border border-border bg-card shadow-sm"
                  >
                    {sortOptions.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => {
                          setSort(s.value);
                          setShowSortMenu(false);
                        }}
                        className={`block w-full px-cozy py-snug text-left text-small transition-colors hover:bg-accent ${
                          sort === s.value
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        }
      />

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-wide gap-y-loose md:grid-cols-4">
          {filtered.map((critique) => (
            <CritiqueCard
              key={critique.slug}
              title={critique.title}
              type={critique.type}
              creator={critique.creator}
              image={critique.image}
              rating={critique.rating}
              slug={critique.slug}
            />
          ))}
        </div>
      ) : (
        <p className="py-loose text-center text-small text-muted-foreground">
          No critiques found.
        </p>
      )}
    </>
  );
}
