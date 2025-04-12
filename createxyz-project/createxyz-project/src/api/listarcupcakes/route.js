async function handler({ apenasDisponiveis }) {
  try {
    let query =
      "SELECT id, nome, preco, imagem, descricao, disponivel FROM cupcakes";
    const values = [];

    if (apenasDisponiveis === true) {
      query += " WHERE disponivel = $1";
      values.push(true);
    }

    query += " ORDER BY nome ASC";

    const cupcakes = await sql(query, values);

    return {
      success: true,
      cupcakes: cupcakes,
    };
  } catch (error) {
    console.error("Erro ao listar cupcakes:", error);
    return {
      success: false,
      message: "Erro ao listar cupcakes",
      error: error.message,
    };
  }
}