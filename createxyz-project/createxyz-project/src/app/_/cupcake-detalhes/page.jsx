"use client";
import React from "react";

function MainComponent() {
  const [cupcake, setCupcake] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [quantidade, setQuantidade] = React.useState(1);
  const [adicionadoAoCarrinho, setAdicionadoAoCarrinho] = React.useState(false);
  const [carrinho, setCarrinho] = React.useState([]);
  const [cupcakesRelacionados, setCupcakesRelacionados] = React.useState([]);
  const { data: user } = useUser();

  const getCupcakeId = () => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");

      if (id && !isNaN(parseInt(id))) {
        return parseInt(id);
      }
    }
    return null;
  };

  const cupcakeId = getCupcakeId();

  React.useEffect(() => {
    const fetchCupcake = async () => {
      setLoading(true);
      setError(null);

      if (!cupcakeId) {
        setError("ID do cupcake não fornecido ou inválido");
        setLoading(false);
        return;
      }

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
          fetchCupcakesRelacionados();
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

    const fetchCupcakesRelacionados = async () => {
      try {
        const response = await fetch("/api/listarcupcakes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ apenasDisponiveis: true }),
        });

        if (!response.ok) {
          throw new Error(
            `Erro ao buscar cupcakes relacionados: ${response.status}`
          );
        }

        const data = await response.json();

        if (data.success) {
          const filtrados = data.cupcakes.filter((c) => c.id !== cupcakeId);
          const embaralhados = filtrados
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
          setCupcakesRelacionados(embaralhados);
        }
      } catch (err) {
        console.error("Erro ao buscar cupcakes relacionados:", err);
      }
    };

    if (typeof window !== "undefined") {
      const carrinhoSalvo = localStorage.getItem("carrinho");
      if (carrinhoSalvo) {
        try {
          setCarrinho(JSON.parse(carrinhoSalvo));
        } catch (e) {
          console.error("Erro ao carregar carrinho do localStorage:", e);
          localStorage.removeItem("carrinho");
        }
      }
    }

    if (cupcakeId) {
      fetchCupcake();
    } else {
      setError("ID do cupcake não fornecido ou inválido");
      setLoading(false);
    }
  }, [cupcakeId]);

  const aumentarQuantidade = () => {
    setQuantidade(quantidade + 1);
  };

  const diminuirQuantidade = () => {
    if (quantidade > 1) {
      setQuantidade(quantidade - 1);
    }
  };

  const adicionarAoCarrinho = () => {
    if (!cupcake) return;

    const itemNoCarrinho = carrinho.find((item) => item.id === cupcake.id);
    let novoCarrinho;

    if (itemNoCarrinho) {
      novoCarrinho = carrinho.map((item) =>
        item.id === cupcake.id
          ? { ...item, quantidade: item.quantidade + quantidade }
          : item
      );
    } else {
      novoCarrinho = [...carrinho, { ...cupcake, quantidade }];
    }

    setCarrinho(novoCarrinho);

    if (typeof window !== "undefined") {
      localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
    }

    setAdicionadoAoCarrinho(true);
    setTimeout(() => {
      setAdicionadoAoCarrinho(false);
    }, 3000);
  };

  const getPrimeiroNome = (nomeCompleto) => {
    if (!nomeCompleto) return "Usuário";
    return nomeCompleto.split(" ")[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex justify-center items-center">
        <div className="text-pink-800 text-xl">
          Carregando detalhes do cupcake...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-pink-800 mb-4">
            Ops! Algo deu errado
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/"
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full inline-block"
          >
            Voltar para a página inicial
          </a>
        </div>
      </div>
    );
  }

  if (!cupcake) {
    return (
      <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-pink-800 mb-4">
            Cupcake não encontrado
          </h2>
          <p className="text-gray-600 mb-6">
            O cupcake que você está procurando não existe.
          </p>
          <a
            href="/"
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full inline-block"
          >
            Voltar para a página inicial
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <header className="bg-pink-500 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Cupcake Delícia</h1>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="hidden md:block mr-2">
                <span className="font-medium">
                  Olá, {getPrimeiroNome(user.name)}!
                </span>
              </div>
            ) : (
              <a href="/account/signin" className="hover:underline">
                Entrar
              </a>
            )}
            <a href="/" className="hover:underline">
              Início
            </a>
            {user && (
              <a href="/meus-pedidos" className="hover:underline">
                Meus Pedidos
              </a>
            )}
            <a href="/" className="relative">
              <span className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-full flex items-center">
                <span className="mr-2 text-white">🛒</span>
                <span>{carrinho.length}</span>
              </span>
              {carrinho.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {carrinho.reduce((total, item) => total + item.quantidade, 0)}
                </span>
              )}
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="mb-6">
          <a
            href="/"
            className="text-pink-600 hover:text-pink-800 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Voltar para a página inicial
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={cupcake.imagem}
                alt={`Cupcake de ${cupcake.nome}`}
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className="p-6 md:w-1/2">
              <h1 className="text-3xl font-bold text-pink-800 mb-2">
                {cupcake.nome}
              </h1>
              <div className="text-2xl font-semibold text-pink-600 mb-4">
                R$ {parseFloat(cupcake.preco).toFixed(2)}
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                  Descrição
                </h2>
                <p className="text-gray-600">{cupcake.descricao}</p>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                  Quantidade
                </h2>
                <div className="flex items-center">
                  <button
                    onClick={diminuirQuantidade}
                    className="bg-pink-100 hover:bg-pink-200 text-pink-800 px-3 py-1 rounded-l-lg"
                  >
                    -
                  </button>
                  <span className="bg-white px-4 py-1 border-t border-b border-gray-200">
                    {quantidade}
                  </span>
                  <button
                    onClick={aumentarQuantidade}
                    className="bg-pink-100 hover:bg-pink-200 text-pink-800 px-3 py-1 rounded-r-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-lg font-semibold text-gray-700">
                  Subtotal: R${" "}
                  {(parseFloat(cupcake.preco) * quantidade).toFixed(2)}
                </div>
              </div>

              <button
                onClick={adicionarAoCarrinho}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-full font-bold flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
                Adicionar ao Carrinho
              </button>

              {adicionadoAoCarrinho && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                  <p className="text-green-700">
                    Cupcake adicionado ao carrinho!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {cupcakesRelacionados.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-pink-800 mb-6">
              Você também pode gostar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cupcakesRelacionados.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <a href={`/cupcake-detalhes?id=${c.id}`}>
                    <img
                      src={c.imagem}
                      alt={c.nome}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-pink-800">
                        {c.nome}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        R$ {parseFloat(c.preco).toFixed(2)}
                      </p>
                      <button className="bg-pink-100 hover:bg-pink-200 text-pink-800 px-4 py-2 rounded-full w-full">
                        Ver detalhes
                      </button>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-pink-500 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>© 2025 Cupcake Delícia - Todos os direitos reservados</p>
          <p className="mt-2">
            Contato: (11) 99999-9999 | contato@cupcakedelicia.com.br
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MainComponent;