import prisma from './prisma/client.js';

// 1. findMany — lista todos os alunos (deve estar vazio)
const alunosAntes = await prisma.aluno.findMany();
console.log('Alunos antes:', alunosAntes);
// Esperado: []

// 2. create — cria um aluno de teste
const novoAluno = await prisma.aluno.create({
  data: {
    nome: 'Maria Silva',
    email: 'maria@email.com',
    senhaHash: 'hash_temporario_123',
    cidade: 'Salinas',
    frase: 'Bora que bora!',
    planosFuturos: 'Cursar Ciência da Computação',
  },
});
console.log('Novo aluno criado:', novoAluno);

// 3. findMany de novo — agora tem um aluno
const alunosDepois = await prisma.aluno.findMany();
console.log('Alunos depois:', alunosDepois);

// 4. Fecha a conexão com o banco
await prisma.$disconnect();