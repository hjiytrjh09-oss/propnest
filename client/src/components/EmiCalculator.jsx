import { useState } from "react";
import { formatPrice } from "../api";

// EMI = P * r * (1+r)^n / ((1+r)^n - 1)
export function calcEmi(principal, annualRate, years) {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  if (!principal || !years) return 0;
  if (r === 0) return principal / n;
  const f = Math.pow(1 + r, n);
  return (principal * r * f) / (f - 1);
}

export default function EmiCalculator({ price }) {
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const loan = price * (1 - downPct / 100);
  const emi = calcEmi(loan, rate, years);
  const totalPaid = emi * years * 12;

  return (
    <div className="panel">
      <h3>EMI Calculator</h3>
      <label>
        Down payment: {downPct}%
        <input type="range" min="0" max="90" value={downPct} onChange={(e) => setDownPct(+e.target.value)} />
      </label>
      <label>
        Interest rate: {rate}% p.a.
        <input type="range" min="5" max="15" step="0.1" value={rate} onChange={(e) => setRate(+e.target.value)} />
      </label>
      <label>
        Tenure: {years} years
        <input type="range" min="1" max="30" value={years} onChange={(e) => setYears(+e.target.value)} />
      </label>
      <div className="emi-result">
        <div>
          <span className="muted">Monthly EMI</span>
          <strong>₹{Math.round(emi).toLocaleString("en-IN")}</strong>
        </div>
        <div>
          <span className="muted">Loan amount</span>
          <strong>{formatPrice(loan)}</strong>
        </div>
        <div>
          <span className="muted">Total interest</span>
          <strong>{formatPrice(Math.max(totalPaid - loan, 0))}</strong>
        </div>
      </div>
    </div>
  );
}
