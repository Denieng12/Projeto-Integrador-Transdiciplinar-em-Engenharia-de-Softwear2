async function handler({ itens, total, dadosEntrega, metodoPagamento }) {
  const session = getSession();

  if (!session || !session.user) {
    return {
      success: false,
      message: "Usuário não autenticado",
    };
  }

  const userId = session.user.id;

  try {
    const [pedidoResult] = await sql`
      INSERT INTO pedidos (
        usuario_id, 
        total, 
        metodo_pagamento, 
        nome, 
        endereco, 
        telefone, 
        observacoes
      ) 
      VALUES (
        ${userId}, 
        ${total}, 
        ${metodoPagamento}, 
        ${dadosEntrega.nome}, 
        ${dadosEntrega.endereco}, 
        ${dadosEntrega.telefone}, 
        ${dadosEntrega.observacoes || ""}
      ) 
      RETURNING id
    `;

    const pedidoId = pedidoResult.id;

    for (const item of itens) {
      await sql`
        INSERT INTO itens_pedido (
          pedido_id, 
          cupcake_id, 
          nome, 
          preco, 
          quantidade
        ) 
        VALUES (
          ${pedidoId}, 
          ${item.id}, 
          ${item.nome}, 
          ${item.preco}, 
          ${item.quantidade}
        )
      `;
    }

    return {
      success: true,
      message: "Pedido salvo com sucesso",
      pedidoId: pedidoId,
    };
  } catch (error) {
    console.error("Erro ao salvar pedido:", error);
    return {
      success: false,
      message: "Erro ao salvar o pedido",
      error: error.message,
    };
  }
}