import Link from "next/link";
import { SVGProps } from "react";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { PricingPlan } from "@/types/landing";

export function PricingCard(item: PricingPlan) {
  return (
    <article
      className={cn(
        "relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-accent-foreground/15 dark:border-neutral-400/80"
      )}
    >
      <header className="flex flex-col gap-4 px-8 pb-0 pt-10">
        {item.isMostPopular ? (
          <span className="absolute left-1/2 top-4 -translate-x-1/2 text-center text-xs font-medium lg:text-sm text-primary dark:text-secondary">
            Popular
          </span>
        ) : null}
        <span className="text-center text-3xl font-medium lg:text-4xl dark:text-secondary">
          {item.price}
        </span>
        <div className="flex flex-col">
          <h5 className="text-center text-lg font-medium lg:text-xl dark:text-secondary">
            {item.title}
          </h5>
          <p className="dark:text-secondary text-center text-sm lg:text-base">
            {item.billed}
          </p>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-6 !pb-12 lg:p-8">
        <ul className="flex flex-col gap-4">
          {item.list.items.map((feature) => (
            <li
              key={feature.title}
              className="flex items-start gap-3 text-sm dark:text-secondary lg:text-base"
            >
              <span className="flex items-center justify-center rounded-full bg-[#14c9a21a] bg-opacity-10 p-1">
                <CheckIcon className="size-5 text-[#5dc6a4]" />
              </span>
              <span>{feature.title}</span>
            </li>
          ))}
        </ul>
      </div>
      <footer className="relative flex w-full items-center self-stretch p-8 pt-0">
        {item.isMostPopular ? (
          <Shadow className="pointer-events-none absolute left-0 top-0 h-full w-full origin-bottom scale-[2.0] text-primary" />
        ) : null}
        <Link
          href="/login"
          className={cn(
            "z-10 w-full p-2 rounded-full text-center bg-muted dark:bg-neutral-100 dark:text-neutral-600 dark:border-neutral-300 border",
            item.isMostPopular && "bg-primary dark:bg-secondary dark:text-white text-accent"
          )}
        >
          Comenzar ahora
        </Link>
      </footer>
    </article>
  );
}

function Shadow(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 312 175"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#filter0_f_6956_27669)">
        <path
          d="M-41 398C-41 371.998 -35.9174 346.251 -26.0424 322.229C-16.1673 298.206 -1.69321 276.379 16.5535 257.993C34.8002 239.607 56.4622 225.022 80.3027 215.072C104.143 205.121 129.695 200 155.5 200C181.305 200 206.857 205.121 230.697 215.072C254.538 225.022 276.2 239.607 294.446 257.993C312.693 276.379 327.167 298.206 337.042 322.229C346.917 346.251 352 371.998 352 398L-41 398Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          height="598"
          id="filter0_f_6956_27669"
          width="793"
          x="-241"
          y="0"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            in="SourceGraphic"
            in2="BackgroundImageFix"
            mode="normal"
            result="shape"
          />
          <feGaussianBlur
            result="effect1_foregroundBlur_6956_27669"
            stdDeviation="100"
          />
        </filter>
      </defs>
    </svg>
  );
}
