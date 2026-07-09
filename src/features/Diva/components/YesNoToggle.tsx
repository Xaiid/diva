import type { Translations } from "../Diva.types";

export function YesNoToggle({
    value,
    onPick,
    t,
  }: {
    value: boolean | null;
    onPick: (v: boolean) => void;
    t: Translations;
  }) {
    return (
      <div className="toggle-group">
        <button
          type="button"
          className={value === true ? "selected-yes" : ""}
          onClick={() => onPick(true)}
        >
          {t.yep}
        </button>
        <button
          type="button"
          className={value === false ? "selected-no" : ""}
          onClick={() => onPick(false)}
        >
          {t.nope}
        </button>
      </div>
    );
  }