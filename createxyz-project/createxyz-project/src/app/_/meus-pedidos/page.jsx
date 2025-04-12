"use client";
import React from "react";

function MainComponent() {
  const [pedidos, setPedidos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [pedidoSelecionado, setPedidoSelecionado] = React.useState(null);
  const { data: user } = useUser();

  React.useEffect(() => {
    const carregarPedidos = async () => {
      try {
        const response = await fetch("/api/listarpedidos", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error(`Erro ao carregar pedidos: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setPedidos(data.pedidos);
        } else {
          throw new Error(data.message || "Erro ao carregar pedidos");
        }
      } catch (err) {
        console.error("Erro ao buscar pedidos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      carregarPedidos();
    }
  }, [user]);

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatarPreco = (preco) => {
    return `R$ ${Number(preco).toFixed(2)}`;
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      pendente: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
      confirmado: { label: "Confirmado", color: "bg-blue-100 text-blue-800" },
      em_preparo: {
        label: "Em preparo",
        color: "bg-indigo-100 text-indigo-800",
      },
      em_entrega: {
        label: "Em entrega",
        color: "bg-purple-100 text-purple-800",
      },
      entregue: { label: "Entregue", color: "bg-green-100 text-green-800" },
      cancelado: { label: "Cancelado", color: "bg-red-100 text-red-800" },
    };

    return (
      statusMap[status] || { label: status, color: "bg-gray-100 text-gray-800" }
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-pink-800 mb-4">
            Acesso Restrito
          </h2>
          <p className="text-gray-600 mb-6">
            Você precisa estar logado para ver seus pedidos.
          </p>
          <a
            href="/account/signin?callbackUrl=/meus-pedidos"
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full inline-block"
          >
            Fazer Login
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
            <a href="/" className="hover:underline">
              Início
            </a>
            <a href="/meus-pedidos" className="font-bold underline">
              Meus Pedidos
            </a>
            <a
              href="/account/logout"
              className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-full"
            >
              Sair
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="bg-pink-200 rounded-lg p-6 mb-8 text-center">
          <h2 className="text-3xl font-bold text-pink-800 mb-2">
            Meus Pedidos
          </h2>
          <p className="text-pink-700">Histórico de todos os seus pedidos</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-pink-800 text-xl">Carregando pedidos...</div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        ) : pedidos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-semibold text-pink-800 mb-4">
              Você ainda não fez nenhum pedido
            </h3>
            <p className="text-gray-600 mb-6">
              Que tal experimentar nossos deliciosos cupcakes?
            </p>
            <a
              href="/"
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full inline-block"
            >
              Ver Cardápio
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pedidoSelecionado ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-pink-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-pink-800">
                      Pedido #{pedidoSelecionado.id}
                    </h3>
                    <button
                      onClick={() => setPedidoSelecionado(null)}
                      className="text-pink-500 hover:text-pink-700"
                    >
                      Voltar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600">
                        <span className="font-semibold">Data:</span>{" "}
                        {formatarData(pedidoSelecionado.data_pedido)}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Total:</span>{" "}
                        {formatarPreco(pedidoSelecionado.total)}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">
                          Método de Pagamento:
                        </span>{" "}
                        {pedidoSelecionado.metodo_pagamento || "Não informado"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">
                        <span className="font-semibold">Nome:</span>{" "}
                        {pedidoSelecionado.nome}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Endereço:</span>{" "}
                        {pedidoSelecionado.endereco}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Telefone:</span>{" "}
                        {pedidoSelecionado.telefone}
                      </p>
                    </div>
                  </div>

                  {pedidoSelecionado.observacoes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">
                        <span className="font-semibold">Observações:</span>{" "}
                        {pedidoSelecionado.observacoes}
                      </p>
                    </div>
                  )}

                  <div
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      getStatusLabel(pedidoSelecionado.status || "pendente")
                        .color
                    }`}
                  >
                    {
                      getStatusLabel(pedidoSelecionado.status || "pendente")
                        .label
                    }
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-lg font-semibold text-pink-800 mb-4">
                    Itens do Pedido
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-pink-200">
                      <thead className="bg-pink-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-pink-800 uppercase tracking-wider">
                            Produto
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-pink-800 uppercase tracking-wider">
                            Preço
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-pink-800 uppercase tracking-wider">
                            Quantidade
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-pink-800 uppercase tracking-wider">
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-pink-100">
                        {pedidoSelecionado.itens &&
                          pedidoSelecionado.itens.map((item) => (
                            <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {item.nome}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {formatarPreco(item.preco)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {item.quantidade}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {formatarPreco(item.preco * item.quantidade)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                      <tfoot className="bg-pink-50">
                        <tr>
                          <td
                            colSpan="3"
                            className="px-6 py-4 text-right font-medium text-pink-800"
                          >
                            Total
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-pink-800">
                            {formatarPreco(pedidoSelecionado.total)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              pedidos.map((pedido) => (
                <div
                  key={pedido.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-pink-800">
                        Pedido #{pedido.id}
                      </h3>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          getStatusLabel(pedido.status || "pendente").color
                        }`}
                      >
                        {getStatusLabel(pedido.status || "pendente").label}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <p className="text-gray-600">
                        <span className="font-semibold">Data:</span>{" "}
                        {formatarData(pedido.data_pedido)}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Total:</span>{" "}
                        {formatarPreco(pedido.total)}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Itens:</span>{" "}
                        {pedido.itens ? pedido.itens.length : 0}
                      </p>
                    </div>

                    <button
                      onClick={() => setPedidoSelecionado(pedido)}
                      className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full w-full md:w-auto"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))
            )}
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