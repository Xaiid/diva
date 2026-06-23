import type { Translations } from "../Diva.types";

export function PeerQuestions({
    inattention,
    valueInattA,
    valueInattC,
    valueHiA,
    valueHiC,
    onInattA,
    onInattC,
    onHiA,
    onHiC,
    t,
  }: {
    inattention: boolean;
    valueInattA: boolean | null;
    valueInattC: boolean | null;
    valueHiA: boolean | null;
    valueHiC: boolean | null;
    onInattA: (v: boolean) => void;
    onInattC: (v: boolean) => void;
    onHiA: (v: boolean) => void;
    onHiC: (v: boolean) => void;
    t: Translations;
  }) {
    const p = t.peer;
    return (
      <>
        <h2 className="section-title">{p.title}</h2>
        <p className="section-hint">{p.hint}</p>
        {inattention && (
          <>
            <div className="question-block">
              <label className="prompt">{p.inattAdult}</label>
              <div className="yesno-row">
                <button
                  type="button"
                  className={valueInattA === true ? "chosen" : ""}
                  onClick={() => onInattA(true)}
                >
                  {t.yep}
                </button>
                <button
                  type="button"
                  className={valueInattA === false ? "chosen" : ""}
                  onClick={() => onInattA(false)}
                >
                  {t.nope}
                </button>
              </div>
            </div>
            <div className="question-block">
              <label className="prompt">{p.inattChild}</label>
              <div className="yesno-row">
                <button
                  type="button"
                  className={valueInattC === true ? "chosen" : ""}
                  onClick={() => onInattC(true)}
                >
                  {t.yep}
                </button>
                <button
                  type="button"
                  className={valueInattC === false ? "chosen" : ""}
                  onClick={() => onInattC(false)}
                >
                  {t.nope}
                </button>
              </div>
            </div>
          </>
        )}
        {!inattention && (
          <>
            <div className="question-block">
              <label className="prompt">{p.hiAdult}</label>
              <div className="yesno-row">
                <button
                  type="button"
                  className={valueHiA === true ? "chosen" : ""}
                  onClick={() => onHiA(true)}
                >
                  {t.yep}
                </button>
                <button
                  type="button"
                  className={valueHiA === false ? "chosen" : ""}
                  onClick={() => onHiA(false)}
                >
                  {t.nope}
                </button>
              </div>
            </div>
            <div className="question-block">
              <label className="prompt">{p.hiChild}</label>
              <div className="yesno-row">
                <button
                  type="button"
                  className={valueHiC === true ? "chosen" : ""}
                  onClick={() => onHiC(true)}
                >
                  {t.yep}
                </button>
                <button
                  type="button"
                  className={valueHiC === false ? "chosen" : ""}
                  onClick={() => onHiC(false)}
                >
                  {t.nope}
                </button>
              </div>
            </div>
          </>
        )}
      </>
    );
  }