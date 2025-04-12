async function handler() {
  const session = getSession();

  if (!session || !session.user) {
    return {
      success: false,
      message: "Usuário não autenticado",
    };
  }

  try {
    const userId = session.user.id;

    const users = await sql`
      SELECT id, name, email, endereco 
      FROM auth_users 
      WHERE id = ${userId}
    `;

    if (users.length === 0) {
      return {
        success: false,
        message: "Usuário não encontrado",
      };
    }

    const user = users[0];

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        endereco: user.endereco,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return {
      success: false,
      message: "Erro ao buscar dados do usuário",
    };
  }
}