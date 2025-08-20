export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      <section className="p-4 flex flex-col gap-2 items-center justify-center">
        <h1 className="font-lobster font-bold text-3xl">
          Calculadora Científica
        </h1>
        <span className="text-lg text-center">
          Cálculos básicos aos avançados.{" "}
          <span className="font-lobster font-bold">
            (sen, cos, tan, log, ln)
          </span>
        </span>
      </section>
    </div>
  );
}
