async function handler({ telefone }) {
  const session = getSession();

  if (!session || !session.user) {
    return {
      success: false,
      message: "Usuário não autenticado",
    };
  }

  if (!telefone) {
    return {
      success: false,
      message: "Telefone não fornecido",
    };
  }

  try {
    const userId = session.user.id;

    const userResult = await sql`
      SELECT id FROM auth_users WHERE id = ${userId}
    `;

    if (userResult.length === 0) {
      return {
        success: false,
        message: "Usuário não encontrado",
      };
    }

    await sql`
      UPDATE auth_users 
      SET endereco = jsonb_set(
        COALESCE(endereco, '{}'::jsonb),
        '{telefone}',
        ${JSON.stringify(telefone)}::jsonb
      )
      WHERE id = ${userId}
    `;

    return {
      success: true,
      message: "Telefone atualizado com sucesso",
    };
  } catch (error) {
    console.error("Erro ao atualizar telefone:", error);
    return {
      success: false,
      message: "Erro ao atualizar telefone",
    };
  }
}