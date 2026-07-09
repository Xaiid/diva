export function StepNav({
    steps,
    step,
  }: {
    steps: string[];
    step: number;
  }) {
    return (
        <>
        <nav className="step-nav" aria-label="Where you are in the quiz">
        {steps.map((label, i) => (
          <span
            key={label}
            className={`step-pill${i === step ? " active" : ""}`}
          >
            {i + 1}. {label}
          </span>
        ))}
      </nav>
        </>
    );
}