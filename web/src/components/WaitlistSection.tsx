import { ArrowRight, Check } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState } from "react";
import { Reveal } from "./Reveal";

type Status = "idle" | "loading" | "success" | "error";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function WaitlistSection() {
  const inputId = useId();
  const errorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();

    if (!value) {
      setStatus("error");
      setError("Enter an email address.");
      inputRef.current?.focus();
      return;
    }
    if (!EMAIL.test(value)) {
      setStatus("error");
      setError("That address does not look complete.");
      inputRef.current?.focus();
      return;
    }

    setError("");
    setStatus("loading");
    timer.current = window.setTimeout(() => {
      try {
        window.localStorage.setItem("sidekick.waitlist", value);
      } catch {
        // The demo still resolves when storage is unavailable.
      }
      setStatus("success");
    }, 700);
  }

  return (
    <section
      id="waitlist"
      className="scroll-mt-20 pb-[clamp(5rem,8vw,8rem)]"
      aria-labelledby="waitlist-title"
    >
      <div className="wrap">
        <Reveal>
          <div className="rounded-[24px] border border-ink/15 bg-paper-deep px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
              <div className="lg:col-span-7">
                <h2 id="waitlist-title" className="display-sm max-w-[14ch]">
                  Leave the phone in your pocket.
                </h2>
                <p className="body-lg mt-5 max-w-[48ch]">
                  The 30-person, four-week pilot is judged on phone unlocks,
                  not satisfaction.
                </p>
              </div>

              <div className="lg:col-span-5">
                {status === "success" ? (
                  <div role="status" aria-live="polite">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange">
                        <Check
                          size={18}
                          weight="bold"
                          className="text-[#1a100a]"
                          aria-hidden="true"
                        />
                      </span>
                      <p
                        ref={successRef}
                        tabIndex={-1}
                        className="text-[1.0625rem] font-medium outline-none"
                      >
                        Saved in this browser.
                      </p>
                    </div>
                    <p className="mt-3 max-w-[36ch] text-[0.875rem] leading-relaxed text-ink-soft">
                      Nothing was sent. This concept page has no mailing list,
                      so{" "}
                      <span className="break-all font-medium text-ink">
                        {email.trim()}
                      </span>{" "}
                      stays on your device.
                    </p>
                    <button
                      type="button"
                      className="text-link mt-5"
                      onClick={() => {
                        setStatus("idle");
                        setEmail("");
                      }}
                    >
                      Use a different address
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submit} noValidate>
                    <label
                      htmlFor={inputId}
                      className="mono-label mb-2 block text-ink-soft"
                    >
                      Email address
                    </label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        ref={inputRef}
                        id={inputId}
                        type="email"
                        name="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder="you@example.com"
                        className="field flex-1"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          if (status === "error") {
                            setStatus("idle");
                            setError("");
                          }
                        }}
                        aria-invalid={status === "error"}
                        aria-describedby={status === "error" ? errorId : undefined}
                        disabled={status === "loading"}
                      />
                      <button
                        type="submit"
                        className="btn btn-primary shrink-0"
                        disabled={status === "loading"}
                        aria-busy={status === "loading"}
                      >
                        {status === "loading" ? "Joining..." : "Join the waitlist"}
                        {status === "loading" ? null : (
                          <ArrowRight size={16} weight="bold" />
                        )}
                      </button>
                    </div>

                    {status === "error" ? (
                      <p
                        id={errorId}
                        role="alert"
                        className="mt-2 text-[0.8125rem] font-medium text-[#a32b16]"
                      >
                        {error}
                      </p>
                    ) : null}

                    <p className="mt-3 max-w-[38ch] text-[0.75rem] leading-relaxed text-ink-mute">
                      Concept page. The address stays in this browser. Android
                      v1.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
