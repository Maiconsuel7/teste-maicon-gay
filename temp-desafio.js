import prisma from './prisma/client.js';

const novaMensagem = await prisma.mensagem.create({
  data: {
    texto: 'Salve turma!',
    autorId: 1,
  },
});

console.log(novaMensagem);

const mensagens = await prisma.mensagem.findMany({
  include: {
    autor: {
      select: {
        nome: true,
        fotoUrl: true,
      },
    },
  },
});

console.log(mensagens);

await prisma.$disconnect();