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

  // --- FUNÇÕES MATEMÁTICAS MANUAIS ---
  function factorial(n: number): number {
    if (n < 0) throw new Error("Fatorial inválido");
    if (n === 0) return 1;
    let f = 1;
    for (let i = 1; i <= n; i++) f *= i;
    return f;
  }

  function sin(x: number, terms = 15): number {
    let s = 0;
    for (let n = 0; n < terms; n++) {
      s += ((-1) ** n * x ** (2 * n + 1)) / factorial(2 * n + 1);
    }
    return s;
  }

  function cos(x: number, terms = 15): number {
    let c = 0;
    for (let n = 0; n < terms; n++) {
      c += ((-1) ** n * x ** (2 * n)) / factorial(2 * n);
    }
    return c;
  }

  function tan(x: number): number {
    return sin(x) / cos(x);
  }

  // --- Funções trig em graus ---
  function sinDeg(x: number) {
    return sin((x * Math.PI) / 180);
  }
  function cosDeg(x: number) {
    return cos((x * Math.PI) / 180);
  }
  function tanDeg(x: number) {
    return tan((x * Math.PI) / 180);
  }

  function ln(x: number, terms = 20): number {
    if (x <= 0) throw new Error("ln inválido");
    x = (x - 1) / (x + 1);
    let sum = 0;
    for (let n = 0; n < terms; n++) {
      sum += (1 / (2 * n + 1)) * x ** (2 * n + 1);
    }
    return 2 * sum;
  }

  function log10(x: number): number {
    return ln(x) / ln(10);
  }

  function exp(x: number, terms = 20): number {
    let sum = 1;
    let term = 1;
    for (let n = 1; n <= terms; n++) {
      term *= x / n;
      sum += term;
    }
    return sum;
  }

  function sqrt(x: number, tolerance = 1e-10): number {
    if (x < 0) throw new Error("Raiz negativa");
    let guess = x / 2;
    while (Math.abs(guess * guess - x) > tolerance) {
      guess = (guess + x / guess) / 2;
    }
    return guess;
  }

  function pow(x: number, y: number): number {
    return exp(y * ln(x));
  }

  // --- PARSER ---
  function evaluateExpression(expr: string): string {
    try {
      let parsed = expr
        .replace(/÷/g, "/")
        .replace(/×/g, "*")
        .replace(/−/g, "-")
        .replace(/π/g, Math.PI.toString())
        .replace(/e/g, Math.E.toString())
        .replace(/\^/g, "**");

      // Substituir funções trig por versão em graus
      parsed = parsed
        .replace(/sin\(([^)]+)\)/g, "sinDeg($1)")
        .replace(/cos\(([^)]+)\)/g, "cosDeg($1)")
        .replace(/tan\(([^)]+)\)/g, "tanDeg($1)");

      const result = Function(
        "sinDeg,cosDeg,tanDeg,ln,log10,exp,sqrt,pow",
        `return ${parsed}`
      )(sinDeg, cosDeg, tanDeg, ln, log10, exp, sqrt, pow);

      return result.toString();
    } catch {
      return "Erro";
    }
  }

  const calculateLimit = () => {
    try {
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

  const calculateIntegral = () => {
    try {
      const a = parseFloat(integralFrom);
      const b = parseFloat(integralTo);
      const n = 1000;
      const dx = (b - a) / n;
      let sum = 0;
      for (let i = 0; i <= n; i++) {
        const x = a + i * dx;
        const fx = evaluateExpression(integralExpr.replaceAll("x", `(${x})`));
        sum += parseFloat(fx) * (i === 0 || i === n ? 0.5 : 1);
      }
      const result = sum * dx;
      setHistory([`∫[${a},${b}] ${integralExpr} dx = ${result}`, ...history]);
    } catch {
      setHistory([`Erro na integral`, ...history]);
    }
  };

  const formatDisplay = (value: string) =>
    value.length > 12 ? value.slice(0, 12) + "..." : value;

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

  // --- RENDER ---
  const numberButtons = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "."];
  const operatorButtons = ["+", "−", "×", "÷", "=", "C", "±", "%"];
  const scientificButtons = [
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
  ];

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
          {["padrao", "cientifica", "avancada"].map((opt) => (
            <button
              key={opt}
              onClick={() => setMode(opt as Mode)}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-200 ${
                mode === opt
                  ? "bg-emerald-500 text-white shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-black/40"
              }`}
            >
              {opt[0].toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>

        {/* DISPLAY */}
        <div className="bg-black/40 rounded-xl p-4 w-full mb-4 text-right">
          <div className="text-sm text-white/70">{expression}</div>
          <div className="text-3xl font-bold text-white">
            {formatDisplay(currentInput)}
          </div>
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
            {/* LINHA DE FUNÇÕES CIENTÍFICAS */}
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

            {/* TECLADO NUMÉRICO E OPERADORES */}
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

        {/* Limites e Integrais */}
        {mode === "avancada" && (
          <div className="flex flex-col gap-6 mt-4">
            <div className="bg-black/20 rounded-xl p-4 flex flex-col gap-3">
              <h3 className="text-white font-semibold text-lg mb-2">
                Cálculo de Limites
              </h3>
              <input
                type="text"
                placeholder="Expressão f(x)"
                value={limitExpr}
                onChange={(e) => setLimitExpr(e.target.value)}
                className="p-2 rounded-lg bg-black/30 text-white w-full outline-none"
              />
              <input
                type="text"
                placeholder="Variável"
                value={limitVar}
                onChange={(e) => setLimitVar(e.target.value)}
                className="p-2 rounded-lg bg-black/30 text-white w-full outline-none"
              />
              <input
                type="text"
                placeholder="Aproxima de"
                value={limitAt}
                onChange={(e) => setLimitAt(e.target.value)}
                className="p-2 rounded-lg bg-black/30 text-white w-full outline-none"
              />
              <button
                onClick={calculateLimit}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-xl mt-2"
              >
                Calcular Limite
              </button>
            </div>

            <div className="bg-black/20 rounded-xl p-4 flex flex-col gap-3">
              <h3 className="text-white font-semibold text-lg mb-2">
                Cálculo de Integrais
              </h3>
              <input
                type="text"
                placeholder="Expressão f(x)"
                value={integralExpr}
                onChange={(e) => setIntegralExpr(e.target.value)}
                className="p-2 rounded-lg bg-black/30 text-white w-full outline-none"
              />
              <input
                type="text"
                placeholder="Limite Inferior"
                value={integralFrom}
                onChange={(e) => setIntegralFrom(e.target.value)}
                className="flex-1 p-2 rounded-lg bg-black/30 text-white outline-none"
              />
              <input
                type="text"
                placeholder="Limite Superior"
                value={integralTo}
                onChange={(e) => setIntegralTo(e.target.value)}
                className="flex-1 p-2 rounded-lg bg-black/30 text-white outline-none"
              />
              <button
                onClick={calculateIntegral}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-xl mt-2"
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
