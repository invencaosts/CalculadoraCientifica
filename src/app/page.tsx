"use client";
import { useEffect, useState } from "react";

type Mode = "padrao" | "cientifica" | "avancada";

export default function Home() {
  const [expression, setExpression] = useState("");
  const [currentInput, setCurrentInput] = useState("0");
  const [history, setHistory] = useState<string[]>([]);
  const [mode, setMode] = useState<Mode>("padrao");

  const evaluateExpression = (expr: string) => {
    try {
      const parsed = expr
        .replace(/÷/g, "/")
        .replace(/×/g, "*")
        .replace(/−/g, "-");
      return eval(parsed).toString();
    } catch {
      return "Erro";
    }
  };

  const handleButtonClick = (value: string) => {
    if (["+", "−", "×", "÷"].includes(value)) {
      setExpression(currentInput + " " + value);
      setCurrentInput("0");
    } else if (value === "=") {
      const expr = expression + " " + currentInput;
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
    } else {
      setCurrentInput((prev) => (prev === "0" ? value : prev + value));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isNaN(Number(e.key))) {
        handleButtonClick(e.key);
      } else if (["+", "-", "*", "/"].includes(e.key)) {
        const symbol =
          e.key === "+" ? "+" : e.key === "-" ? "−" : e.key === "*" ? "×" : "÷";
        handleButtonClick(symbol);
      } else if (e.key === "Enter") {
        handleButtonClick("=");
      } else if (e.key === "Backspace") {
        setCurrentInput((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
      } else if (e.key === "Escape") {
        handleButtonClick("C");
      } else if (e.key === ".") {
        handleButtonClick(".");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentInput, expression]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-emerald-400 to-sky-300 flex flex-col items-center justify-center p-6">
      {/* TÍTULO */}
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 font-playwrite text-center">
        Calculadora Científica
        <span className="block text-lg font-normal text-white/80">
          cálculos básicos até avançados
        </span>
      </h1>

      {/* BLOCO DA CALCULADORA */}
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
          <div className="grid grid-cols-4 gap-3 w-full">
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
              "C",
              "=",
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
        )}

        {/* MODO AVANÇADA */}
        {mode === "avancada" && (
          <div className="flex flex-col gap-6">
            {/* Limites */}
            <div className="bg-black/20 rounded-xl p-4 flex flex-col gap-3">
              <h3 className="text-white font-semibold text-lg mb-2">
                Cálculo de Limites
              </h3>
              <div className="flex flex-col gap-2">
                <label className="text-white/80 text-sm font-semibold">
                  Expressão f(x)
                </label>
                <input
                  type="text"
                  placeholder="ex: (x^2 - 1)/(x - 1)"
                  className="p-2 rounded-lg bg-black/30 text-white w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-white/80 text-sm font-semibold">
                  Variável
                </label>
                <input
                  type="text"
                  placeholder="ex: x"
                  className="p-2 rounded-lg bg-black/30 text-white w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-white/80 text-sm font-semibold">
                  Aproxima de
                </label>
                <input
                  type="text"
                  placeholder="ex: 1"
                  className="p-2 rounded-lg bg-black/30 text-white w-full"
                />
              </div>
            </div>

            {/* Integrais */}
            <div className="bg-black/20 rounded-xl p-4 flex flex-col gap-3">
              <h3 className="text-white font-semibold text-lg mb-2">
                Cálculo de Integrais
              </h3>
              <div className="flex flex-col gap-2">
                <label className="text-white/80 text-sm font-semibold">
                  Expressão f(x)
                </label>
                <input
                  type="text"
                  placeholder="ex: x^2 + 3x"
                  className="p-2 rounded-lg bg-black/30 text-white w-full"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-white/80 text-sm font-semibold">
                    Limite Inferior
                  </label>
                  <input
                    type="text"
                    placeholder="ex: 0"
                    className="p-2 rounded-lg bg-black/30 text-white w-full"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-white/80 text-sm font-semibold">
                    Limite Superior
                  </label>
                  <input
                    type="text"
                    placeholder="ex: 5"
                    className="p-2 rounded-lg bg-black/30 text-white w-full"
                  />
                </div>
              </div>
            </div>

            <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-xl mt-3">
              Calcular
            </button>
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
