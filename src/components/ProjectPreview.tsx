"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface ProjectPreviewProps {
  title: string;
  description: string;
  url: string;
  logo: string;
}

const layout = "group flex w-full flex-col gap-1 py-3";

export default function ProjectPreview({
  title,
  description,
  url,
  logo,
}: ProjectPreviewProps) {
  const [isHovering, setIsHovering] = useState(false);
  // A project whose url is "#" has nowhere to go yet.
  const linked = url !== "#";

  const body = (
    <>
      <div className="flex items-center gap-2">
        <Image
          src={logo}
          alt={title}
          width={12}
          height={12}
          className="h-3 w-3"
        />
        <div
          className={`flex items-center transition-all duration-150 ease-in-out ${
            linked ? "group-hover:text-muted-foreground" : ""
          }`}
        >
          {title}
          <AnimatePresence>
            {isHovering && (
              <motion.div
                initial={{ opacity: 0, width: 0, marginLeft: 0, scale: 0.95 }}
                animate={{ opacity: 1, width: "auto", marginLeft: 6, scale: 1 }}
                exit={{ opacity: 0, width: 0, marginLeft: 0, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
              >
                <ArrowUpRight
                  className="h-3 w-3 text-muted-foreground"
                  strokeWidth={2.6}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <p className="text-small text-muted-foreground">{description}</p>
    </>
  );

  if (!linked) return <div className={layout}>{body}</div>;

  return (
    <Link
      href={url}
      target="_blank"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`${layout} cursor-pointer`}
    >
      {body}
    </Link>
  );
}
