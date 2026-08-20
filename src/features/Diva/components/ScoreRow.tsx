function scoreColor(count: number): string {
    const t = Math.min(count, 9) / 9;
    const start = { r: 156, g: 163, b: 175 };
    const end = { r: 219, g: 39, b: 119 };

    const r = Math.round(start.r + (end.r - start.r) * t);
    const g = Math.round(start.g + (end.g - start.g) * t);
    const b = Math.round(start.b + (end.b - start.b) * t);
    return `rgb(${r}, ${g}, ${b})`;
}

export function ScoreRow({
    label,
    count,
}: {
    label: string;
    count: number;
}) {
    const pct = (Math.min(count, 9) / 9) * 100;
    const color = scoreColor(count);
    return (
        <div className="domain-score-row">
            <div className="domain-score-header">
                <span className="domain-score-label">{label}</span>
                <span className="domain-score-count" style={{ color }}>{count} / 9</span>
            </div>
            <div className="score-bar-track">
                <div
                    className="score-bar-fill"
                    style={{ width: `${pct}%`, background: color }}
                    role="progressbar"
                    aria-valuenow={count}
                    aria-valuemin={0}
                    aria-valuemax={9}
                />
            </div>
        </div>
    );
}