import type { Translations } from "../Diva.types";
import { StepNav } from "./StepNav";

export function WelcomeStep({ t, step }: { t: Translations, step: number }) {
  const d = t.disclaimer;
  const steps = t.steps;
  return (
    <>
      <header className="app-header">
        <h1>{t.header.title}</h1>
        <p className="subtitle">{t.header.subtitle}</p>
      </header>

      {step === 0 && (
        <div className="disclaimer">
          <p>
            <strong>{d.p1Before}</strong>
            {d.p1After}{" "}
            <a
              href="https://www.divacenter.eu"
              target="_blank"
              rel="noreferrer"
            >
              divacenter.eu
            </a>
          </p>
          <p style={{ marginBottom: 0 }}>
            {d.p2Before} <strong>{d.p2Adult}</strong> {d.p2Mid}{" "}
            <strong>{d.p2Child}</strong> {d.p2After}
          </p>

        </div>
      )}

      <StepNav steps={Array.from(steps)} step={step} />

      {step === 0 && (
        <section>
          <h2 className="section-title">{t.intro.title}</h2>
          <p className="section-hint">{t.intro.hint}</p>
        </section>
      )}

    </>
  );
}