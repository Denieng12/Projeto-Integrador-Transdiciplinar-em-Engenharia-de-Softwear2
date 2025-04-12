"use client";
import React from "react";

function MainComponent() {
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  const { data: user, loading: userLoading, refetch } = useUser();
  const [formData, setFormData] = useState({
    nome: "",
    endereco: {
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
    },
  });
  const [editMode, setEditMode] = useState(false);

  React.useEffect(() => {
    if (user) {
      setFormData({
        nome: user.name || "",
        endereco: user.endereco || {
          rua: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          estado: "",
          cep: "",
        },
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEnderecoChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      endereco: {
        ...formData.endereco,
        [name]: value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const response = await fetch("/api/atualizarperfil", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar perfil: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSaveSuccess(true);
        await refetch();
        setEditMode(false);

        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        throw new Error(data.message || "Erro ao atualizar perfil");
      }
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user && !userLoading) {
    return (
      <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-pink-800 mb-4">
            Acesso Restrito
          </h2>
          <p className="text-gray-600 mb-6">
            Você precisa estar logado para acessar seu perfil.
          </p>
          <a
            href="/account/signin?callbackUrl=/perfil"
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full inline-block"
          >
            Fazer Login
          </a>
        </div>
      </div>
    );
  }

  const formatarEnderecoCompleto = () => {
    const end = formData.endereco;
    const partes = [];

    if (end.rua) partes.push(end.rua);
    if (end.numero) partes.push(end.numero);
    if (end.complemento) partes.push(end.complemento);
    if (end.bairro) partes.push(end.bairro);
    if (end.cidade) partes.push(end.cidade);
    if (end.estado) partes.push(end.estado);
    if (end.cep) partes.push(`CEP: ${end.cep}`);

    return partes.join(", ");
  };

  return (
    <div className="min-h-screen bg-pink-50">
      <header className="bg-pink-500 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Cupcake Delícia</h1>
          <div className="flex items-center space-x-4">
            <a href="/" className="hover:underline">
              Início
            </a>
            <a href="/meus-pedidos" className="hover:underline">
              Meus Pedidos
            </a>
            <button
              onClick={() => (window.location.href = "/?mostrarCarrinho=true")}
              className="hover:underline flex items-center"
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
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              Carrinho
            </button>
            <a href="/perfil" className="font-bold underline">
              Meu Perfil
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
          <h2 className="text-3xl font-bold text-pink-800 mb-2">Meu Perfil</h2>
          <p className="text-pink-700">Gerencie suas informações pessoais</p>
        </div>

        {userLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-pink-800 text-xl">Carregando dados...</div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-pink-800">
                  Informações Pessoais
                </h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="text-pink-500 hover:text-pink-700 flex items-center"
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
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                    {editMode ? "Cancelar Edição" : "Editar Dados"}
                  </button>
                  <a
                    href="/"
                    className="text-pink-500 hover:text-pink-700 flex items-center"
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
                        d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                      />
                    </svg>
                    Voltar
                  </a>
                </div>
              </div>

              {saveSuccess && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700">
                    Suas informações foram atualizadas com sucesso!
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {editMode ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome
                      </label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user?.email || ""}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        O email não pode ser alterado
                      </p>
                    </div>
                  </div>

                  <h4 className="text-lg font-semibold text-pink-800 mb-4 border-b border-pink-100 pb-2">
                    Endereço de Entrega
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rua
                      </label>
                      <input
                        type="text"
                        name="rua"
                        value={formData.endereco.rua}
                        onChange={handleEnderecoChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Número
                        </label>
                        <input
                          type="text"
                          name="numero"
                          value={formData.endereco.numero}
                          onChange={handleEnderecoChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Complemento
                        </label>
                        <input
                          type="text"
                          name="complemento"
                          value={formData.endereco.complemento}
                          onChange={handleEnderecoChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bairro
                      </label>
                      <input
                        type="text"
                        name="bairro"
                        value={formData.endereco.bairro}
                        onChange={handleEnderecoChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CEP
                      </label>
                      <input
                        type="text"
                        name="cep"
                        value={formData.endereco.cep}
                        onChange={handleEnderecoChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cidade
                      </label>
                      <input
                        type="text"
                        name="cidade"
                        value={formData.endereco.cidade}
                        onChange={handleEnderecoChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado
                      </label>
                      <input
                        type="text"
                        name="estado"
                        value={formData.endereco.estado}
                        onChange={handleEnderecoChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-6 py-3 rounded-full text-white font-bold 
                        ${
                          loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-pink-500 hover:bg-pink-600"
                        }`}
                    >
                      {loading ? "Salvando..." : "Salvar Alterações"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-pink-800 mb-2">Nome</h4>
                      <p>{formData.nome || "Não informado"}</p>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-pink-800 mb-2">
                        Email
                      </h4>
                      <p>{user?.email || "Não informado"}</p>
                    </div>
                  </div>

                  <div className="bg-pink-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-pink-800 mb-2">
                      Endereço de Entrega
                    </h4>
                    <p>
                      {formatarEnderecoCompleto() ||
                        "Nenhum endereço cadastrado"}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-6 py-3 rounded-full text-white font-bold bg-pink-500 hover:bg-pink-600 flex items-center"
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
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                      Editar Informações
                    </button>
                  </div>
                </div>
              )}
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