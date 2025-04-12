async function handler({ id }) {
  console.log("API obtercupcake recebeu ID:", id, "tipo:", typeof id);

  if (!id) {
    console.log("ID não fornecido");
    return {
      success: false,
      message: "ID do cupcake não fornecido",
    };
  }

  try {
    // Converter o ID para número inteiro
    const cupcakeId = parseInt(id);
    console.log("ID convertido para número:", cupcakeId);

    if (isNaN(cupcakeId)) {
      console.log("ID inválido (não é um número)");
      return {
        success: false,
        message: "ID do cupcake inválido",
      };
    }

    console.log("Executando consulta SQL com ID:", cupcakeId);
    const cupcakes = await sql`
      SELECT id, nome, preco, imagem, descricao, disponivel 
      FROM cupcakes 
      WHERE id = ${cupcakeId}
    `;
    console.log("Resultado da consulta:", cupcakes);

    if (cupcakes.length === 0) {
      console.log("Cupcake não encontrado");
      return {
        success: false,
        message: "Cupcake não encontrado",
      };
    }

    console.log("Cupcake encontrado:", cupcakes[0]);
    return {
      success: true,
      cupcake: cupcakes[0],
    };
  } catch (error) {
    console.error("Erro ao buscar cupcake:", error);
    return {
      success: false,
      message: "Erro ao buscar detalhes do cupcake",
      error: error.message,
    };
  }
}