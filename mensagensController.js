import prisma from '../prisma/client.js'; // importa o singleton do Prisma

// GET /mensagens — lista todas as mensagens (mais recentes primeiro, com dados do autor)
export async function listarMensagens(req, res) {
  const mensagens = await prisma.mensagem.findMany({
    orderBy: { criadoEm: 'desc' },  // mais recente primeiro
    include: {
      autor: {                        // traz dados do autor junto
        select: {
          nome: true,                 // nome do autor
          fotoUrl: true,              // foto do autor
        },
      },
    },
  });
  res.json(mensagens); // retorna a lista com autor embutido
}

// 🎯 POST /mensagens — cria uma nova mensagem
// Siga o mesmo padrão do criarAluno
// Valide que texto não está vazio (400 se faltar)
export async function criarMensagem(req, res) {
  // 1. Extraia texto, imagemUrl e autorId de req.body
  const { texto, imagemUrl, autorId } = req.body;

  // 2. Valide: se texto não existir, retorne 400
  if (!texto || texto.trim() === '') {
    return res.status(400).json({ erro: 'O campo texto é obrigatório.' });
  }

  // Atenção: O campo autorId precisa ser um número inteiro.
  // Se vier como string do req.body, converta com Number(autorId).
  // Sem a conversão, o Prisma pode reclamar do tipo.
  const autorIdNumerico = Number(autorId);
  if (isNaN(autorIdNumerico)) {
    return res.status(400).json({ erro: 'O autorId deve ser um número válido.' });
  }

  try {
    // 3. Crie com prisma.mensagem.create()
    // Certifique-se de que 'prisma' está definido e importado no seu controller
    const mensagemCriada = await prisma.mensagem.create({
      data: {
        texto,
        imagemUrl,
        autorId: autorIdNumerico, // Usa o ID numérico convertido
      },
      // Mensagens não têm senhaHash, então não precisa de selectSemSenha
    });

    // 4. Retorne 201 com a mensagem criada
    return res.status(201).json(mensagemCriada);
  } catch (error) {
    console.error("Erro ao criar mensagem:", error);
    // Se o autorId não existir, o Prisma pode lançar um erro de chave estrangeira
    if (error.code === 'P2003') { // Código de erro do Prisma para falha de FK
      return res.status(400).json({ erro: 'Autor não encontrado. Verifique o autorId.' });
    }
    return res.status(500).json({ erro: 'Não foi possível criar a mensagem.' });
  }
}

// 🎯 DELETE /mensagens/:id — deleta uma mensagem
// Siga o mesmo padrão do deletarAluno
export async function deletarMensagem(req, res) {
  // 1. Extraia o id de req.params
  const { id } = req.params;

  try {
    // 2. Use prisma.mensagem.delete() para remover a mensagem
    await prisma.mensagem.delete({
      where: { id: Number(id) }, // Converte o id para número
    });
    // 3. Retorne status 204 (sem conteúdo) com res.status(204).end()
    return res.status(204).end(); // Retorna 204 No Content
  } catch (error) {
    console.error("Erro ao deletar mensagem:", error);
    // Se a mensagem não existir, o Prisma lança um erro
    return res.status(404).json({ erro: 'Mensagem não encontrada' });
  }
}
