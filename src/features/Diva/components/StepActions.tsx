import { Translations } from "../Diva.types";

export function StepActions({ 
    step, 
    back, 
    next, 
    canAdvance, 
    showResults, 
    t 
}: { 
    step: number, 
    back: () => void, 
    next: () => void, 
    canAdvance: () => boolean, 
    showResults: boolean, 
    t: Translations }) {
    return (
        <>
        <div className="actions">
          {step > 0 && (
            <button type="button" className="secondary" onClick={back}>
              {t.back}
            </button>
          )}
          <button
            type="button"
            className="primary"
            onClick={next}
            disabled={!canAdvance()}
          >
            {step === 0 ? t.letsGo : t.next}
          </button>
        </div>
        {!showResults && step > 0 && (
        <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: "1rem" }}>
          {!canAdvance() && t.tapEverything}
        </p>
      )}
        </>
    );
}