import { Hand } from "@phosphor-icons/react";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { FINISHES, type FinishId } from "../lib/palettes";

const StageCanvas = lazy(() => import("./StageCanvas"));

type ProductStageProps = {
  finish: FinishId;
  onFinishChange: (finish: FinishId) => void;
};

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!context) return false;
    context.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

class CanvasBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("3D viewer fallback", error, info.componentStack);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function StageLoader({ reduce }: { reduce: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-3"
    >
      <span className="mono-label">Loading object</span>
      <div className="relative h-px w-28 overflow-hidden bg-ink/15">
        {reduce ? (
          <div className="h-px w-1/2 bg-orange" />
        ) : (
          <motion.div
            className="absolute inset-y-0 w-1/3 bg-orange"
            animate={{ transform: ["translateX(-110%)", "translateX(320%)"] }}
            transition={{ repeat: Infinity, duration: 1.25, ease: "linear" }}
          />
        )}
      </div>
    </div>
  );
}

function StagePoster({
  image,
  name,
}: {
  image: string;
  name: string;
}) {
  return (
    <div className="absolute inset-0">
      <img
        src={image}
        alt={`Sidekick companion display in the ${name} finish`}
        className="h-full w-full object-cover"
      />
      <span className="absolute bottom-4 left-4 rounded-full bg-paper/90 px-3 py-1.5 mono-label text-ink">
        {name} finish
      </span>
    </div>
  );
}

export function ProductStage({ finish, onFinishChange }: ProductStageProps) {
  const reduce = !!useReducedMotion();
  const [webgl] = useState(supportsWebGL);
  const [loaded, setLoaded] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.05 });

  const onLoaded = useCallback(() => setLoaded(true), []);
  const activeFinish = useMemo(
    () => FINISHES.find((item) => item.id === finish) ?? FINISHES[0],
    [finish],
  );

  return (
    <div
      ref={stageRef}
      role="group"
      className="stage flex h-[clamp(380px,52vh,690px)] w-full flex-col sm:h-[clamp(430px,66vh,690px)]"
      aria-label="Interactive 3D model of the Sidekick companion display. Drag on the model to turn it, or use the finish buttons."
    >
      <div className="stage-canvas relative min-h-0 flex-1">
        {webgl ? (
          <CanvasBoundary
            fallback={
              <StagePoster image={activeFinish.stageImage} name={activeFinish.name} />
            }
          >
            <Suspense fallback={null}>
              <StageCanvas
                finish={finish}
                onLoaded={onLoaded}
                reduce={reduce}
                inView={inView}
              />
            </Suspense>
            {!loaded ? <StageLoader reduce={reduce} /> : null}
          </CanvasBoundary>
        ) : (
          <StagePoster image={activeFinish.stageImage} name={activeFinish.name} />
        )}
      </div>

      <div className="relative z-10 flex min-h-[58px] items-center justify-between gap-4 border-t border-ink/15 bg-paper/55 px-4 py-3 backdrop-blur-[2px] sm:px-5">
        <div className="flex items-center gap-3">
          <span className="mono-label">Finish</span>
          <div className="flex items-center gap-3">
            {FINISHES.map((item) => (
              <button
                key={item.id}
                type="button"
                className="swatch"
                style={
                  {
                    background: item.shell,
                    "--swatch-accent": item.accent,
                  } as React.CSSProperties
                }
                data-active={finish === item.id}
                aria-label={`${item.name} finish`}
                aria-pressed={finish === item.id}
                onClick={() => onFinishChange(item.id)}
              />
            ))}
          </div>
          <span className="mono-value text-ink">{activeFinish.name}</span>
        </div>

        <span className="hidden items-center gap-2 text-ink-mute sm:flex">
          <Hand size={14} weight="regular" />
          <span className="mono-label text-ink-mute">Drag to turn</span>
        </span>
      </div>
    </div>
  );
}
