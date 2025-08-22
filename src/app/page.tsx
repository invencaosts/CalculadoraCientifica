"use client";
import { useEffect, useState } from "react";

type Mode = "padrao" | "cientifica" | "avancada";

export default function Home() {
  const [expression, setExpression] = useState("");
  const [currentInput, setCurrentInput] = useState("0");
  const [history, setHistory] = useState<string[]>([]);
  const [mode, setMode] = useState<Mode>("padrao");

  // Estados avançados
  const [limitExpr, setLimitExpr] = useState("");
  const [limitVar, setLimitVar] = useState("x");
  const [limitAt, setLimitAt] = useState("");
  const [integralExpr, setIntegralExpr] = useState("");
  const [integralFrom, setIntegralFrom] = useState("");
  const [integralTo, setIntegralTo] = useState("");

  // Função para calcular expressões básicas e científicas
  const evaluateExpression = (expr: string) => {
    try {
      let parsed = expr
        .replace(/÷/g, "/")
        .replace(/×/g, "*")
        .replace(/−/g, "-")
        .replace(/π/g, Math.PI.toString())
        .replace(/e/g, Math.E.toString())
        .replace(/√/g, "Math.sqrt")
        .replace(/x\^y/g, "**")
        .replace(/sin\(([^)]+)\)/g, "Math.sin($1)")
        .replace(/cos\(([^)]+)\)/g, "Math.cos($1)")
        .replace(/tan\(([^)]+)\)/g, "Math.tan($1)")
        .replace(/ln\(([^)]+)\)/g, "Math.log($1)")
        .replace(/log\(([^)]+)\)/g, "Math.log10($1)")
        .replace(/exp\(([^)]+)\)/g, "Math.exp($1)")
        .replace(/max\(([^)]+)\)/g, "Math.max($1)")
        .replace(/min\(([^)]+)\)/g, "Math.min($1)");
      return eval(parsed).toString();
    } catch {
      return "Erro";
    }
  };

  // Função para limites (simples)
  const calculateLimit = () => {
    try {
      // Substitui a variável pelo valor aproximado
      const val = parseFloat(limitAt);
      const expr = limitExpr.replaceAll(limitVar, `(${val})`);
      const result = evaluateExpression(expr);
      setHistory([
        `lim ${limitVar}->${limitAt} (${limitExpr}) = ${result}`,
        ...history,
      ]);
    } catch {
      setHistory([`Erro no limite`, ...history]);
    }
  };

  // Função para integrais (simples, método trapezoidal)
  const calculateIntegral = () => {
    try {
      const a = parseFloat(integralFrom);
      const b = parseFloat(integralTo);
      const n = 1000; // subdivisões
      const dx = (b - a) / n;
      let sum = 0;
      for (let i = 0; i <= n; i++) {
        const x = a + i * dx;
        let fx = evaluateExpression(integralExpr.replaceAll("x", `(${x})`));
        sum += parseFloat(fx) * (i === 0 || i === n ? 0.5 : 1);
      }
      const result = sum * dx;
      setHistory([`∫[${a},${b}] ${integralExpr} dx = ${result}`, ...history]);
    } catch {
      setHistory([`Erro na integral`, ...history]);
    }
  };

  const handleButtonClick = (value: string) => {
    if (["+", "−", "×", "÷"].includes(value)) {
      setExpression(currentInput + " " + value);
      setCurrentInput("0");
    } else if (value === "=") {
      const expr = expression ? expression + " " + currentInput : currentInput;
      const result = evaluateExpression(expr);
      setHistory([`${expr} = ${result}`, ...history]);
      setExpression("");
      setCurrentInput(result);
    } else if (value === "C") {
      setExpression("");
      setCurrentInput("0");
    } else if (value === "±") {
      setCurrentInput((prev) =>
        prev.startsWith("-") ? prev.slice(1) : "-" + prev
      );
    } else if (value === "%") {
      setCurrentInput((prev) => (parseFloat(prev) / 100).toString());
    } else if (value === "π") {
      setCurrentInput(Math.PI.toString());
    } else if (value === "e") {
      setCurrentInput(Math.E.toString());
    } else if (["sin", "cos", "tan", "ln", "log", "√", "exp"].includes(value)) {
      setCurrentInput((prev) => `${value}(${prev})`);
    } else if (["max", "min"].includes(value)) {
      setCurrentInput((prev) => `${value}(${prev},)`);
    } else if (value === "x^y") {
      setCurrentInput((prev) => `${prev}^`);
    } else {
      setCurrentInput((prev) => (prev === "0" ? value : prev + value));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isNaN(Number(e.key))) handleButtonClick(e.key);
      else if (["+", "-", "*", "/"].includes(e.key)) {
        const symbol =
          e.key === "+" ? "+" : e.key === "-" ? "−" : e.key === "*" ? "×" : "÷";
        handleButtonClick(symbol);
      } else if (e.key === "Enter") handleButtonClick("=");
      else if (e.key === "Backspace")
        setCurrentInput((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
      else if (e.key === "Escape") handleButtonClick("C");
      else if (e.key === ".") handleButtonClick(".");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentInput, expression]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-emerald-400 to-sky-300 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 font-playwrite text-center">
        Calculadora Científica
        <span className="block text-lg font-normal text-white/80">
          cálculos básicos até avançados
        </span>
      </h1>

      <section className="bg-white/20 backdrop-blur-xl shadow-2xl rounded-2xl p-6 w-full max-w-lg">
        {/* MODOS */}
        <div className="flex justify-center gap-6 mb-6 bg-black/30 rounded-xl p-1">
          {[
            { id: "padrao", label: "Padrão" },
            { id: "cientifica", label: "Científica" },
            { id: "avancada", label: "Avançada" },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setMode(opt.id as Mode)}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-200 ${
                mode === opt.id
                  ? "bg-emerald-500 text-white shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-black/40"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* DISPLAY */}
        <div className="bg-black/40 rounded-xl p-4 w-full mb-4 text-right">
          <div className="text-sm text-white/70">{expression}</div>
          <div className="text-3xl font-bold text-white">{currentInput}</div>
        </div>

        {/* MODO PADRÃO */}
        {mode === "padrao" && (
          <div className="grid grid-cols-4 gap-3 w-full">
            {[
              "C",
              "±",
              "%",
              "÷",
              "7",
              "8",
              "9",
              "×",
              "4",
              "5",
              "6",
              "−",
              "1",
              "2",
              "3",
              "+",
              "0",
              ".",
              "=",
            ].map((btn, i) => (
              <button
                key={i}
                onClick={() => handleButtonClick(btn)}
                className={`${
                  ["÷", "×", "−", "+", "="].includes(btn)
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-black/30 hover:bg-black/40"
                } text-white font-bold py-3 rounded-xl transition ${
                  btn === "0" ? "col-span-2" : ""
                }`}
              >
                {btn}
              </button>
            ))}
          </div>
        )}

        {/* MODO CIENTÍFICA */}
        {mode === "cientifica" && (
          <div className="flex flex-col gap-4 w-full">
            {/* FORMULAS */}
            <div className="grid grid-cols-4 gap-3 w-full mb-3">
              {[
                "sin",
                "cos",
                "tan",
                "ln",
                "log",
                "√",
                "x^y",
                "π",
                "e",
                "max",
                "min",
                "exp",
                "(",
                ")",
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={() => handleButtonClick(btn)}
                  className="bg-black/30 hover:bg-black/40 text-white font-bold py-3 rounded-xl transition"
                >
                  {btn}
                </button>
              ))}
            </div>
            {/* TECLADO NUMÉRICO */}
            <div className="grid grid-cols-4 gap-3 w-full">
              {[
                "C",
                "±",
                "%",
                "÷",
                "7",
                "8",
                "9",
                "×",
                "4",
                "5",
                "6",
                "−",
                "1",
                "2",
                "3",
                "+",
                "0",
                ".",
                "=",
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={() => handleButtonClick(btn)}
                  className={`${
                    ["÷", "×", "−", "+", "="].includes(btn)
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : "bg-black/30 hover:bg-black/40"
                  } text-white font-bold py-3 rounded-xl transition ${
                    btn === "0" ? "col-span-2" : ""
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MODO AVANÇADA */}
        {mode === "avancada" && (
          <div className="flex flex-col gap-6">
            {/* Limites */}
            <div className="bg-black/20 rounded-xl p-4 flex flex-col gap-3">
              <h3 className="text-white font-semibold text-lg mb-2">
                Cálculo de Limites
              </h3>
              <input
                type="text"
                placeholder="Expressão f(x)"
                className="p-2 rounded-lg bg-black/30 text-white w-full outline-none"
                value={limitExpr}
                onChange={(e) => setLimitExpr(e.target.value)}
              />
              <input
                type="text"
                placeholder="Variável"
                className="p-2 rounded-lg bg-black/30 text-white w-full outline-none"
                value={limitVar}
                onChange={(e) => setLimitVar(e.target.value)}
              />
              <input
                type="text"
                placeholder="Aproxima de"
                className="p-2 rounded-lg bg-black/30 text-white w-full outline-none"
                value={limitAt}
                onChange={(e) => setLimitAt(e.target.value)}
              />
              <button
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-xl mt-2"
                onClick={calculateLimit}
              >
                Calcular Limite
              </button>
            </div>

            {/* Integrais */}
            <div className="bg-black/20 rounded-xl p-4 flex flex-col gap-3">
              <h3 className="text-white font-semibold text-lg mb-2">
                Cálculo de Integrais
              </h3>
              <input
                type="text"
                placeholder="Expressão f(x)"
                className="p-2 rounded-lg bg-black/30 text-white w-full outline-none"
                value={integralExpr}
                onChange={(e) => setIntegralExpr(e.target.value)}
              />
              <input
                type="text"
                placeholder="Limite Inferior"
                className="flex-1 p-2 rounded-lg bg-black/30 text-white outline-none"
                value={integralFrom}
                onChange={(e) => setIntegralFrom(e.target.value)}
              />
              <input
                type="text"
                placeholder="Limite Superior"
                className="flex-1 p-2 rounded-lg bg-black/30 text-white outline-none"
                value={integralTo}
                onChange={(e) => setIntegralTo(e.target.value)}
              />
              <button
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-xl mt-2"
                onClick={calculateIntegral}
              >
                Calcular Integral
              </button>
            </div>
          </div>
        )}

        {/* HISTÓRICO */}
        <div className="bg-black/20 rounded-xl p-3 w-full mt-6 max-h-40 overflow-y-auto">
          <h2 className="text-sm text-white/70 mb-2">Histórico</h2>
          {history.length === 0 ? (
            <p className="text-white/50 text-xs">Nenhum cálculo ainda...</p>
          ) : (
            history.map((h, i) => (
              <p key={i} className="text-xs text-right text-white/90">
                {h}
              </p>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
