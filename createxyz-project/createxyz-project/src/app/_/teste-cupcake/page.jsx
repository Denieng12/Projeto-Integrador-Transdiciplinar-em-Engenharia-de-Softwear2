"use client";
import React from "react";

function MainComponent() {
  const [cupcake, setCupcake] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const cupcakeId = 1; // ID fixo para teste

  React.useEffect(() => {
    const fetchCupcake = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/obtercupcake", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: cupcakeId }),
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar cupcake: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setCupcake(data.cupcake);
        } else {
          throw new Error(data.message || "Erro ao buscar cupcake");
        }
      } catch (err) {
        console.error("Erro ao buscar cupcake:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCupcake();
  }, []);

  return (
    <div className="min-h-screen bg-pink-50 p-4">
      <header className="bg-pink-500 text-white p-4 shadow-md mb-6 rounded-lg">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Teste de Detalhes do Cupcake</h1>
          <p className="text-sm">Testando API com ID fixo: {cupcakeId}</p>
        </div>
      </header>

      <main className="container mx-auto">
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-pink-800 text-xl">
              Carregando detalhes do cupcake...
            </p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-pink-800 mb-4">
              Erro ao carregar dados
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
            </div>
            <div className="mt-6">
              <a
                href="/"
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full inline-block"
              >
                Voltar para a página inicial
              </a>
            </div>
          </div>
        ) : cupcake ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={cupcake.imagem}
                  alt={`Cupcake de ${cupcake.nome}`}
                  className="w-full h-[300px] object-cover"
                />
              </div>
              <div className="p-6 md:w-1/2">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                  <p className="text-green-700">
                    API funcionando corretamente! Dados obtidos com sucesso.
                  </p>
                </div>

                <h2 className="text-xl font-bold text-pink-800 mb-2">
                  Dados do Cupcake:
                </h2>

                <div className="space-y-4 mt-4">
                  <div className="border-b border-gray-100 pb-2">
                    <p className="text-gray-600">
                      <span className="font-semibold">ID:</span> {cupcake.id}
                    </p>
                  </div>
                  <div className="border-b border-gray-100 pb-2">
                    <p className="text-gray-600">
                      <span className="font-semibold">Nome:</span>{" "}
                      {cupcake.nome}
                    </p>
                  </div>
                  <div className="border-b border-gray-100 pb-2">
                    <p className="text-gray-600">
                      <span className="font-semibold">Preço:</span> R${" "}
                      {parseFloat(cupcake.preco).toFixed(2)}
                    </p>
                  </div>
                  <div className="border-b border-gray-100 pb-2">
                    <p className="text-gray-600">
                      <span className="font-semibold">Disponível:</span>{" "}
                      {cupcake.disponivel ? "Sim" : "Não"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      <span className="font-semibold">Descrição:</span>{" "}
                      {cupcake.descricao}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <a
                    href="/"
                    className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full inline-block"
                  >
                    Voltar para a página inicial
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-pink-800 mb-4">
              Cupcake não encontrado
            </h2>
            <p className="text-gray-600 mb-6">
              Não foi possível encontrar um cupcake com o ID {cupcakeId}.
            </p>
            <a
              href="/"
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full inline-block"
            >
              Voltar para a página inicial
            </a>
          </div>
        )}
      </main>

      <footer className="mt-8 text-center text-gray-600">
        <p>Página de teste para verificar a API de detalhes do cupcake</p>
      </footer>
    </div>
  );
}

export default MainComponent;