async function handler({ nome, endereco, telefone }) {
  const session = getSession();

  if (!session || !session.user) {
    return {
      success: false,
      message: "Usuário não autenticado",
    };
  }

  const userId = session.user.id;

  if (!nome || typeof nome !== "string") {
    return {
      success: false,
      message: "Nome inválido",
    };
  }

  try {
    await sql`
      UPDATE auth_users 
      SET name = ${nome}
      WHERE id = ${userId}
    `;

    if (endereco) {
      if (telefone && !endereco.telefone) {
        endereco.telefone = telefone;
      }

      const enderecoJSON = JSON.stringify(endereco);

      const [userExists] = await sql`
        SELECT 1 FROM auth_users WHERE id = ${userId}
      `;

      if (userExists) {
        await sql`
          UPDATE auth_users 
          SET endereco = ${enderecoJSON}::jsonb 
          WHERE id = ${userId}
        `;
      }
    } else if (telefone) {
      await sql`
        UPDATE auth_users 
        SET endereco = jsonb_set(
          COALESCE(endereco, '{}'::jsonb),
          '{telefone}',
          ${JSON.stringify(telefone)}::jsonb
        )
        WHERE id = ${userId}
      `;
    }

    return {
      success: true,
      message: "Perfil atualizado com sucesso",
    };
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return {
      success: false,
      message: "Erro ao atualizar perfil",
      error: error.message,
    };
  }
}