"use client";
import React from "react";

function MainComponent() {
  const [carrinho, setCarrinho] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [mostrarCarrinho, setMostrarCarrinho] = React.useState(false);
  const [mostrarMenu, setMostrarMenu] = React.useState(false);
  const [dadosEntrega, setDadosEntrega] = React.useState({
    nome: "",
    endereco: "",
    telefone: "",
    observacoes: "",
  });
  const [pedidoEnviado, setPedidoEnviado] = React.useState(false);
  const [metodoPagamento, setMetodoPagamento] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [cupcakes, setCupcakes] = React.useState([]);
  const { data: user } = useUser();
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const fetchCupcakes = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/listarcupcakes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ apenasDisponiveis: true }),
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar cupcakes: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setCupcakes(data.cupcakes);
        } else {
          throw new Error(data.message || "Erro ao buscar cupcakes");
        }
      } catch (err) {
        console.error("Erro ao buscar cupcakes:", err);
        setError(err.message);
        setCupcakes([
          {
            id: 1,
            nome: "Chocolate",
            preco: 8.5,
            imagem:
              "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=1000&auto=format&fit=crop",
          },
          {
            id: 2,
            nome: "Morango",
            preco: 8.0,
            imagem:
              "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?q=80&w=1000&auto=format&fit=crop",
          },
          {
            id: 3,
            nome: "Baunilha",
            preco: 7.5,
            imagem:
              "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?q=80&w=1000&auto=format&fit=crop",
          },
          {
            id: 4,
            nome: "Red Velvet",
            preco: 9.0,
            imagem:
              "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1000&auto=format&fit=crop",
          },
          {
            id: 5,
            nome: "Limão",
            preco: 7.5,
            imagem:
              "https://images.unsplash.com/photo-1603532648955-039310d9ed75?q=80&w=1000&auto=format&fit=crop",
          },
          {
            id: 6,
            nome: "Caramelo",
            preco: 8.5,
            imagem:
              "https://images.unsplash.com/photo-1587668178277-295251f900ce?q=80&w=1000&auto=format&fit=crop",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCupcakes();

    if (typeof window !== "undefined") {
      const carrinhoSalvo = localStorage.getItem("carrinho");
      if (carrinhoSalvo) {
        const carrinhoObj = JSON.parse(carrinhoSalvo);
        setCarrinho(carrinhoObj);
        calcularTotal(carrinhoObj);
      }

      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("mostrarCarrinho") === "true") {
        setMostrarCarrinho(true);
      }
    }
  }, []);

  React.useEffect(() => {
    if (user) {
      let enderecoCompleto = "";

      if (user.endereco) {
        const end = user.endereco;
        const partes = [];

        if (end.rua) partes.push(end.rua);
        if (end.numero) partes.push(end.numero);
        if (end.complemento) partes.push(end.complemento);
        if (end.bairro) partes.push(end.bairro);
        if (end.cidade) partes.push(end.cidade);
        if (end.estado) partes.push(end.estado);
        if (end.cep) partes.push(`CEP: ${end.cep}`);

        enderecoCompleto = partes.join(", ");
      }

      setDadosEntrega((prevDados) => ({
        ...prevDados,
        nome: user.name || prevDados.nome,
        endereco: enderecoCompleto || prevDados.endereco,
      }));
    }
  }, [user]);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMostrarMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const getPrimeiroNome = (nomeCompleto) => {
    if (!nomeCompleto) return "Usuário";
    return nomeCompleto.split(" ")[0];
  };

  const adicionarAoCarrinho = (cupcake) => {
    const itemNoCarrinho = carrinho.find((item) => item.id === cupcake.id);

    if (itemNoCarrinho) {
      const novoCarrinho = carrinho.map((item) =>
        item.id === cupcake.id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      );
      setCarrinho(novoCarrinho);
      calcularTotal(novoCarrinho);

      if (typeof window !== "undefined") {
        localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
      }
    } else {
      const novoCarrinho = [...carrinho, { ...cupcake, quantidade: 1 }];
      setCarrinho(novoCarrinho);
      calcularTotal(novoCarrinho);

      if (typeof window !== "undefined") {
        localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
      }
    }
  };

  const removerDoCarrinho = (id) => {
    const itemNoCarrinho = carrinho.find((item) => item.id === id);

    if (itemNoCarrinho.quantidade > 1) {
      const novoCarrinho = carrinho.map((item) =>
        item.id === id ? { ...item, quantidade: item.quantidade - 1 } : item
      );
      setCarrinho(novoCarrinho);
      calcularTotal(novoCarrinho);

      if (typeof window !== "undefined") {
        localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
      }
    } else {
      const novoCarrinho = carrinho.filter((item) => item.id !== id);
      setCarrinho(novoCarrinho);
      calcularTotal(novoCarrinho);

      if (typeof window !== "undefined") {
        localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
      }
    }
  };

  const calcularTotal = (itens) => {
    const novoTotal = itens.reduce((soma, item) => {
      return soma + item.preco * (item.quantidade || 1);
    }, 0);
    setTotal(novoTotal);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDadosEntrega({
      ...dadosEntrega,
      [name]: value,
    });
  };

  const enviarPedido = async () => {
    if (!user) {
      setError("Você precisa estar logado para fazer um pedido");
      return;
    }

    if (!metodoPagamento) {
      setError("Selecione um método de pagamento");
      return;
    }

    if (
      !dadosEntrega.nome ||
      !dadosEntrega.endereco ||
      !dadosEntrega.telefone
    ) {
      setError("Preencha todos os dados de entrega");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/salvarpedido", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itens: carrinho,
          total: total,
          dadosEntrega: dadosEntrega,
          metodoPagamento: metodoPagamento,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao enviar pedido: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setCarrinho([]);
        setTotal(0);
        setPedidoEnviado(true);
        setMostrarCarrinho(false);
        setMetodoPagamento("");

        // Limpar o carrinho do localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("carrinho");
        }

        setTimeout(() => {
          setPedidoEnviado(false);
        }, 5000);
      } else {
        throw new Error(data.message || "Erro ao enviar pedido");
      }
    } catch (err) {
      console.error("Erro ao enviar pedido:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50">
      <header className="bg-pink-500 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Cupcake Delícia</h1>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="hidden md:block mr-2">
                  <span className="font-medium">
                    Olá, {getPrimeiroNome(user.name)}!
                  </span>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setMostrarMenu(!mostrarMenu)}
                    className="flex items-center space-x-2 hover:bg-pink-600 px-3 py-2 rounded-lg transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className={`w-5 h-5 transition-transform ${
                        mostrarMenu ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </button>

                  {mostrarMenu && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                    >
                      <button
                        onClick={() => setMostrarCarrinho(true)}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-100 hover:text-pink-800"
                      >
                        <div className="flex items-center">
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
                              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                            />
                          </svg>
                          Meu Carrinho
                        </div>
                      </button>
                      <a
                        href="/meus-pedidos"
                        className="block px-4 py-2 text-gray-700 hover:bg-pink-100 hover:text-pink-800"
                      >
                        <div className="flex items-center">
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
                              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                            />
                          </svg>
                          Meus Pedidos
                        </div>
                      </a>
                      <a
                        href="/perfil"
                        className="block px-4 py-2 text-gray-700 hover:bg-pink-100 hover:text-pink-800"
                      >
                        <div className="flex items-center">
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
                              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                            />
                          </svg>
                          Meu Perfil
                        </div>
                      </a>
                      <div className="border-t border-gray-100 my-1"></div>
                      <a
                        href="/account/logout"
                        className="block px-4 py-2 text-gray-700 hover:bg-pink-100 hover:text-pink-800"
                      >
                        <div className="flex items-center">
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
                              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                            />
                          </svg>
                          Sair
                        </div>
                      </a>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <a href="/account/signin" className="hover:underline">
                Entrar
              </a>
            )}
            <button
              onClick={() => setMostrarCarrinho(!mostrarCarrinho)}
              className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-full flex items-center"
            >
              <span className="mr-2 text-white">🛒</span>
              <span>{carrinho.length}</span>
            </button>
          </div>
        </div>
      </header>

      {pedidoEnviado && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded fixed top-20 right-4 z-50">
          <p>
            Seu pedido foi enviado com sucesso! Em breve entraremos em contato.
          </p>
        </div>
      )}

      <main className="container mx-auto p-4">
        <div className="bg-pink-200 rounded-lg p-6 mb-8 text-center">
          <h2 className="text-3xl font-bold text-pink-800 mb-2">
            Deliciosos Cupcakes Artesanais
          </h2>
          <p className="text-pink-700">
            Entregamos em toda a cidade! Faça seu pedido agora.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-pink-800 mb-4">
          Nossos Cupcakes
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-pink-800 text-xl">Carregando cupcakes...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
            <p className="text-red-600 mt-2">Mostrando dados de exemplo.</p>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cupcakes.map((cupcake) => (
            <div
              key={cupcake.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <a href={`/cupcake-detalhes?id=${cupcake.id}`} className="block">
                <img
                  src={cupcake.imagem}
                  alt={cupcake.nome}
                  className="w-full h-48 object-cover"
                />
              </a>
              <div className="p-4">
                <a
                  href={`/cupcake-detalhes?id=${cupcake.id}`}
                  className="block"
                >
                  <h3 className="text-xl font-semibold text-pink-800 hover:text-pink-600">
                    {cupcake.nome}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    R$ {parseFloat(cupcake.preco).toFixed(2)}
                  </p>
                </a>
                <div className="flex space-x-2">
                  <a
                    href={`/cupcake-detalhes?id=${cupcake.id}`}
                    className="bg-pink-100 hover:bg-pink-200 text-pink-800 px-4 py-2 rounded-full flex-1 text-center"
                  >
                    Ver detalhes
                  </a>
                  <button
                    onClick={() => adicionarAoCarrinho(cupcake)}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full flex-1"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {mostrarCarrinho && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-pink-800">Seu Carrinho</h2>
              <button
                onClick={() => setMostrarCarrinho(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {carrinho.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Seu carrinho está vazio
              </p>
            ) : (
              <>
                <div className="mb-4">
                  {carrinho.map((item) => {
                    const precoFormatado = parseFloat(item.preco).toFixed(2);
                    return (
                      <div
                        key={item.id}
                        className="flex justify-between items-center py-2 border-b"
                      >
                        <div>
                          <h3 className="font-medium">{item.nome}</h3>
                          <p className="text-sm text-gray-500">
                            R$ {precoFormatado} x {item.quantidade}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <button
                            onClick={() => removerDoCarrinho(item.id)}
                            className="bg-pink-100 hover:bg-pink-200 text-pink-800 px-2 py-1 rounded-full mr-2"
                          >
                            -
                          </button>
                          <span>{item.quantidade}</span>
                          <button
                            onClick={() => adicionarAoCarrinho(item)}
                            className="bg-pink-100 hover:bg-pink-200 text-pink-800 px-2 py-1 rounded-full ml-2"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="font-bold text-lg mb-4 text-right">
                  Total: R$ {total.toFixed(2)}
                </div>

                {!user && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                    <p className="text-yellow-700 mb-2">
                      Você precisa estar logado para finalizar o pedido
                    </p>
                    <a
                      href="/account/signin?callbackUrl=/"
                      className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full inline-block"
                    >
                      Fazer Login
                    </a>
                  </div>
                )}

                {user && (
                  <>
                    <div className="mb-4">
                      <h3 className="font-bold text-pink-800 mb-2">
                        Dados para Entrega
                      </h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          name="nome"
                          placeholder="Nome completo"
                          value={dadosEntrega.nome}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded"
                          required
                        />
                        <input
                          type="text"
                          name="endereco"
                          placeholder="Endereço completo"
                          value={dadosEntrega.endereco}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded"
                          required
                        />
                        <input
                          type="tel"
                          name="telefone"
                          placeholder="Telefone para contato"
                          value={dadosEntrega.telefone}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded"
                          required
                        />
                        <textarea
                          name="observacoes"
                          placeholder="Observações (opcional)"
                          value={dadosEntrega.observacoes}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded"
                          rows="3"
                        ></textarea>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-bold text-pink-800 mb-2">
                        Método de Pagamento
                      </h3>
                      <div className="space-y-2">
                        <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-pink-50">
                          <input
                            type="radio"
                            name="pagamento"
                            value="cartao"
                            checked={metodoPagamento === "cartao"}
                            onChange={() => setMetodoPagamento("cartao")}
                            className="mr-2"
                          />
                          <span>Cartão de Crédito/Débito (na entrega)</span>
                        </label>
                        <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-pink-50">
                          <input
                            type="radio"
                            name="pagamento"
                            value="pix"
                            checked={metodoPagamento === "pix"}
                            onChange={() => setMetodoPagamento("pix")}
                            className="mr-2"
                          />
                          <span>PIX</span>
                        </label>
                        <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-pink-50">
                          <input
                            type="radio"
                            name="pagamento"
                            value="dinheiro"
                            checked={metodoPagamento === "dinheiro"}
                            onChange={() => setMetodoPagamento("dinheiro")}
                            className="mr-2"
                          />
                          <span>Dinheiro</span>
                        </label>
                      </div>
                    </div>

                    {error && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700">{error}</p>
                      </div>
                    )}

                    <button
                      onClick={enviarPedido}
                      disabled={
                        loading ||
                        !dadosEntrega.nome ||
                        !dadosEntrega.endereco ||
                        !dadosEntrega.telefone ||
                        !metodoPagamento
                      }
                      className={`w-full py-2 rounded-full text-white font-bold 
                        ${
                          loading ||
                          !dadosEntrega.nome ||
                          !dadosEntrega.endereco ||
                          !dadosEntrega.telefone ||
                          !metodoPagamento
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-pink-500 hover:bg-pink-600"
                        }`}
                    >
                      {loading ? "Processando..." : "Finalizar Pedido"}
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

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