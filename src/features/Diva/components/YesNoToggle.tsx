import { useLang } from "../../../context/LanguageContext";

export function YesNoToggle({
    value,
    onPick,
  }: {
    value: boolean | null;
    onPick: (v: boolean) => void;
  }) {
    const { t } = useLang();
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
