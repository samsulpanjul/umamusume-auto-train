import { useEffect, useState } from "react";

export default function FunctionResults() {
  const [functionResults, setFunctionResults] = useState<string>("");
  useEffect(() => {
    fetch("/results/test", { cache: "no-store" })
      .then(r => {
        if (!r.ok) throw new Error("version fetch failed")
        return r.text()
      })
      .then(v => setFunctionResults(v.trim()))
      .catch(() => setFunctionResults("unknown"))
  }, []);

  return (
    <span className="text-sm block w-full text-right font-bold text-slate-400 -mt-2">{functionResults || "Loading..."}</span>
  );
}
