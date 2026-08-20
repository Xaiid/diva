import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { LangProvider } from "../../../context/LanguageContext";
import { Diva } from "../Diva";

// ─── Render helper ────────────────────────────────────────────────────────────

function renderDiva() {
  const user = userEvent.setup();
  render(
    <LangProvider>
      <Diva />
    </LangProvider>
  );
  return { user };
}

// ─── Step helpers ─────────────────────────────────────────────────────────────

/** Clicks the primary action button ("Let's go" on step 0, "Next" on all others). */
async function clickNext(user: UserEvent) {
  const btn =
    screen.queryByRole("button", { name: "Next" }) ??
    screen.getByRole("button", { name: "Let's go" });
  await user.click(btn);
}

/**
 * Answers all 9 symptom criteria on the current SymptomStep (steps 1 or 3).
 * Each criterion card has two YesNoToggles: adult first, then child.
 * All 9 x 2 = 18 "Yep"/"Nope" buttons are gathered and clicked in order.
 */
async function answerAllSymptoms(user: UserEvent, answer: "yes" | "no") {
  const label = answer === "yes" ? "Yep" : "Nope";
  const buttons = screen.getAllByRole("button", { name: label });
  for (const btn of buttons) {
    await user.click(btn);
  }
}

/**
 * Answers 9 symptom criteria with per-item control over adult and child.
 * Buttons within each card are ordered: adult-Yep(2i), child-Yep(2i+1).
 */
async function answerSymptomItems(
  user: UserEvent,
  adultAnswers: boolean[],
  childAnswers: boolean[]
) {
  const yepBtns = screen.getAllByRole("button", { name: "Yep" });
  const nopeBtns = screen.getAllByRole("button", { name: "Nope" });

  for (let i = 0; i < 9; i++) {
    await user.click(adultAnswers[i] ? yepBtns[i * 2] : nopeBtns[i * 2]);
    await user.click(childAnswers[i] ? yepBtns[i * 2 + 1] : nopeBtns[i * 2 + 1]);
  }
}

/** Answers both peer-comparison questions (steps 2 and 4) with the same answer. */
async function answerPeerQuestions(user: UserEvent, answer: "yes" | "no") {
  const label = answer === "yes" ? "Yep" : "Nope";
  const buttons = screen.getAllByRole("button", { name: label });
  for (const btn of buttons) {
    await user.click(btn);
  }
}

/** Answers the onset lifelong-pattern question (step 5). */
async function answerOnset(user: UserEvent, lifelong: boolean) {
  const label = lifelong ? "Yeah, pretty much" : "Nah / not really sure";
  await user.click(screen.getByRole("button", { name: label }));
}

/** Answers both impairment domain questions (step 6) with the same answer. */
async function answerImpairment(user: UserEvent, answer: "yes" | "no") {
  const label = answer === "yes" ? "Yep" : "Nope";
  const buttons = screen.getAllByRole("button", { name: label });
  for (const btn of buttons) {
    await user.click(btn);
  }
}

/**
 * Answers the Criterion E question (step 7).
 * @param betterExplained true = symptoms better explained by another disorder (fails criterion E)
 */
async function answerCriterionE(user: UserEvent, betterExplained: boolean) {
  const label = betterExplained ? "Yeah, mostly" : "Nah / not sure";
  await user.click(screen.getByRole("button", { name: label }));
}

/**
 * Reads the mark character (✓ / ✗ / —) for a checklist row identified by
 * a substring of its label text.
 */
function getChecklistMark(labelSubstring: string): string {
  const labelSpan = screen.getByText(labelSubstring, { exact: false });
  const li = labelSpan.closest("li");
  return li?.querySelector(".mark")?.textContent?.trim() ?? "";
}

// ─── Full-flow helpers ────────────────────────────────────────────────────────

/** Drives steps 0–7 from Welcome to just before Results, all symptoms Yes. */
async function completeAllYes(user: UserEvent) {
  // Step 0: Welcome — no questions
  await clickNext(user);

  // Step 1: Inattention — all Yes
  await answerAllSymptoms(user, "yes");
  await clickNext(user);

  // Step 2: Inattention peer comparison — all Yes
  await answerPeerQuestions(user, "yes");
  await clickNext(user);

  // Step 3: HI symptoms — all Yes
  await answerAllSymptoms(user, "yes");
  await clickNext(user);

  // Step 4: HI peer comparison — all Yes
  await answerPeerQuestions(user, "yes");
  await clickNext(user);

  // Step 5: Onset — lifelong
  await answerOnset(user, true);
  await clickNext(user);

  // Step 6: Impairment — both Yes
  await answerImpairment(user, "yes");
  await clickNext(user);

  // Step 7: Criterion E — not better explained (passes)
  await answerCriterionE(user, false);
  await clickNext(user);
}

/** Drives steps 0–7 from Welcome to just before Results, all symptoms No. */
async function completeAllNo(user: UserEvent) {
  await clickNext(user);

  await answerAllSymptoms(user, "no");
  await clickNext(user);

  await answerPeerQuestions(user, "no");
  await clickNext(user);

  await answerAllSymptoms(user, "no");
  await clickNext(user);

  await answerPeerQuestions(user, "no");
  await clickNext(user);

  await answerOnset(user, false);
  await clickNext(user);

  await answerImpairment(user, "no");
  await clickNext(user);

  // betterExplained = true means criterion E FAILS
  await answerCriterionE(user, true);
  await clickNext(user);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Navigation guards", () => {
  it("enables Next on the Welcome step without any interaction", () => {
    renderDiva();
    // Step 0: the primary button reads "Let's go" and must never be disabled
    const letsGo = screen.getByRole("button", { name: "Let's go" });
    expect(letsGo).not.toBeDisabled();
  });

  it("disables Next on the Inattention step until all questions are answered", async () => {
    const { user } = renderDiva();
    await clickNext(user); // advance to step 1

    const nextBtn = screen.getByRole("button", { name: "Next" });
    expect(nextBtn).toBeDisabled();

    // Answer all symptoms — Next should now be enabled
    await answerAllSymptoms(user, "yes");
    expect(screen.getByRole("button", { name: "Next" })).not.toBeDisabled();
  });

  it("does not show Next or Back on the Results step", async () => {
    const { user } = renderDiva();
    await completeAllYes(user);

    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Let's go" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Oops, back" })).not.toBeInTheDocument();
  });
});

describe("Full flow — all Yes (Combined presentation)", () => {
  it("shows the Results section after completing all steps", async () => {
    const { user } = renderDiva();
    await completeAllYes(user);

    expect(screen.getByText("Your lil recap")).toBeInTheDocument();
  });

  it("displays 9/9 counts for all four symptom domains", async () => {
    const { user } = renderDiva();
    await completeAllYes(user);

    // Four stat cards each show "{count} / 9"
    expect(screen.getAllByText("9 / 9")).toHaveLength(4);
  });

  it("reports Combined subtype under the strict form threshold", async () => {
    const { user } = renderDiva();
    await completeAllYes(user);

    // The flavour card renders r[summary.subtypeAdultForm] twice (form + research)
    expect(
      screen.getAllByText("Mixed bag — lots of focus stuff AND buzzy/impulsive stuff")
    ).toHaveLength(2);
  });

  it("marks all DSM checklist criteria as passed (✓)", async () => {
    const { user } = renderDiva();
    await completeAllYes(user);

    expect(getChecklistMark("Kid era: six+")).toBe("✓");
    expect(getChecklistMark("Grown-up era (form threshold)")).toBe("✓");
    expect(getChecklistMark("Lifelong pattern with onset")).toBe("✓");
    expect(getChecklistMark("Grown-up: rough patches")).toBe("✓");
    expect(getChecklistMark("Kid era: rough patches")).toBe("✓");
    expect(getChecklistMark("You didn\u2019t say another condition")).toBe("✓");
  });
});

describe("Full flow — all No (Below threshold)", () => {
  it("shows the Results section after completing all steps", async () => {
    const { user } = renderDiva();
    await completeAllNo(user);

    expect(screen.getByText("Your lil recap")).toBeInTheDocument();
  });

  it("displays 0/9 counts for all four symptom domains", async () => {
    const { user } = renderDiva();
    await completeAllNo(user);

    expect(screen.getAllByText("0 / 9")).toHaveLength(4);
  });

  it("reports below-threshold subtype under both thresholds", async () => {
    const { user } = renderDiva();
    await completeAllNo(user);

    expect(
      screen.getAllByText("Under the usual symptom-count cutoff (for this threshold)")
    ).toHaveLength(2);
  });

  it("marks symptom count criteria as failed (✗)", async () => {
    const { user } = renderDiva();
    await completeAllNo(user);

    expect(getChecklistMark("Kid era: six+")).toBe("✗");
    expect(getChecklistMark("Grown-up era (form threshold)")).toBe("✗");
  });

  it("marks onset criterion as failed (✗) when onset is not lifelong", async () => {
    const { user } = renderDiva();
    await completeAllNo(user);

    expect(getChecklistMark("Lifelong pattern with onset")).toBe("✗");
  });

  it("marks Criterion E as failed (✗) when symptoms ARE better explained by another disorder", async () => {
    const { user } = renderDiva();
    await completeAllNo(user);

    // Criterion E is inverted: answering "Yeah, mostly" sets betterExplainedByOtherDisorder=true
    // which makes criterionEOk=false, so the mark should show ✗
    expect(getChecklistMark("You didn\u2019t say another condition")).toBe("✗");
  });
});

describe("Threshold boundary — predominantly inattentive", () => {
  it("shows predominantly inattentive subtype when exactly 6 adult inattention symptoms are Yes", async () => {
    const { user } = renderDiva();

    await clickNext(user); // step 0 → 1

    // Inattention step: adult = [true x6, false x3], child = all true
    const adultAnswers = [...Array(6).fill(true), ...Array(3).fill(false)];
    const childAnswers = Array(9).fill(true);
    await answerSymptomItems(user, adultAnswers, childAnswers);
    await clickNext(user); // step 1 → 2

    await answerPeerQuestions(user, "yes");
    await clickNext(user);

    // HI step: adult = all false (below threshold), child = all true (meets child threshold)
    await answerSymptomItems(user, Array(9).fill(false), Array(9).fill(true));
    await clickNext(user);

    await answerPeerQuestions(user, "yes");
    await clickNext(user);

    await answerOnset(user, true);
    await clickNext(user);

    await answerImpairment(user, "yes");
    await clickNext(user);

    await answerCriterionE(user, false);
    await clickNext(user);

    // Both form and research subtypes show the same label (6 ≥ 4 research threshold too)
    expect(screen.getAllByText("Mostly focus / attention side")).toHaveLength(2);
    expect(screen.getByText("6 / 9")).toBeInTheDocument();
  });
});

describe("Research threshold only (adult inattention ≥4, <6)", () => {
  it("shows form threshold not met but research threshold met when adult inattention count is 4", async () => {
    const { user } = renderDiva();

    await clickNext(user);

    // 4 adult inatt Yes, 5 adult inatt No; all child inatt Yes
    const adultAnswers = [...Array(4).fill(true), ...Array(5).fill(false)];
    const childAnswers = Array(9).fill(true);
    await answerSymptomItems(user, adultAnswers, childAnswers);
    await clickNext(user);

    await answerPeerQuestions(user, "yes");
    await clickNext(user);

    // HI: all No for adult, all Yes for child
    await answerSymptomItems(user, Array(9).fill(false), Array(9).fill(true));
    await clickNext(user);

    await answerPeerQuestions(user, "yes");
    await clickNext(user);

    await answerOnset(user, true);
    await clickNext(user);

    await answerImpairment(user, "yes");
    await clickNext(user);

    await answerCriterionE(user, false);
    await clickNext(user);

    // Adult count of 4 is below the strict form threshold (6) but meets the research threshold (4)
    expect(getChecklistMark("Grown-up era (form threshold)")).toBe("✗");
    expect(getChecklistMark("Grown-up era (research-y threshold")).toBe("✓");
  });
});

describe("Reset / Clear & start fresh", () => {
  it("returns to the Welcome step and re-disables Next on Inattention after reset", async () => {
    const { user } = renderDiva();

    // Complete a full flow to reach the Results step
    await completeAllYes(user);
    expect(screen.getByText("Your lil recap")).toBeInTheDocument();

    // Reset
    await user.click(screen.getByRole("button", { name: "Clear & start fresh" }));

    // Should be back on step 0 — "Let's go" button reappears
    expect(screen.getByRole("button", { name: "Let's go" })).toBeInTheDocument();

    // Advance to step 1 — Next should be disabled again (answers were cleared)
    await clickNext(user);
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });
});
