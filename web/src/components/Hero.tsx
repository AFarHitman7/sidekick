import { ArrowDownRight } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { FinishId } from "../lib/palettes";
import { onAnchorClick } from "../lib/scroll";
import { ProductStage } from "./ProductStage";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const [finish, setFinish] = useState<FinishId>("studio");

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.85, delay, ease },
        };

  return (
    <section id="top" className="relative" aria-labelledby="hero-title">
      <div className="wrap">
        <div className="grid min-h-[calc(100dvh-72px)] grid-cols-1 items-center gap-10 py-8 lg:grid-cols-12 lg:gap-6 lg:py-10">
          <div className="max-w-[34rem] lg:col-span-5 lg:max-w-none">
            <motion.h1
              id="hero-title"
              className="display"
              {...enter(0.05)}
            >
              <span className="block">Put it down.</span>
              <span className="block">
                Stay reachable<span className="text-orange-deep">.</span>
              </span>
            </motion.h1>

            <motion.p
              className="body-lg mt-6 max-w-[42ch] text-[1.0625rem] sm:text-[1.125rem]"
              {...enter(0.16)}
            >
              A 4-inch companion for messages, call control, and reading
              without picking up the whole phone.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4"
              {...enter(0.26)}
            >
              <a
                href="#waitlist"
                onClick={onAnchorClick}
                className="btn btn-primary"
              >
                Join the waitlist
                <ArrowDownRight size={16} weight="bold" />
              </a>
              <a href="#object" onClick={onAnchorClick} className="text-link">
                See the object
                <ArrowDownRight size={15} weight="bold" />
              </a>
            </motion.div>
          </div>

          <motion.div
            className="lg:col-span-7"
            initial={reduce ? false : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.18, ease }}
          >
            <ProductStage finish={finish} onFinishChange={setFinish} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
