async function handler() {
  const session = getSession();

  if (!session || !session.user) {
    return {
      success: false,
      message: "Usuário não autenticado",
    };
  }

  const userId = session.user.id;

  try {
    const pedidos = await sql`
      SELECT * FROM pedidos 
      WHERE usuario_id = ${userId} 
      ORDER BY data_pedido DESC
    `;

    const pedidosCompletos = await Promise.all(
      pedidos.map(async (pedido) => {
        const itens = await sql`
          SELECT * FROM itens_pedido 
          WHERE pedido_id = ${pedido.id}
        `;

        return {
          ...pedido,
          itens,
        };
      })
    );

    return {
      success: true,
      pedidos: pedidosCompletos,
    };
  } catch (error) {
    console.error("Erro ao listar pedidos:", error);
    return {
      success: false,
      message: "Erro ao listar pedidos",
      error: error.message,
    };
  }
}