# API do Yearbook — Documentação de Endpoints

    Base URL (produção): `https://yearbook-backend.vercel.app`

    ## Convenções

    - Todas as respostas são em JSON
    - Rotas protegidas exigem header `Authorization: Bearer <token>`
    - O campo `senhaHash` nunca é retornado em nenhuma resposta
    - Erros seguem o formato `{ "erro": "mensagem descritiva" }`

    ## Auth

    ### POST /auth/register

    Cria uma nova conta de aluno.

    - **Autenticação:** Não
    - **Body:**

    ```json
    {
      "nome": "Maria Silva",
      "email": "maria@email.com",
      "senha": "minhasenha123",
      "cidade": "Salinas",
      "frase": "Aqui começa o futuro.",
      "planosFuturos": "Cursar Ciência da Computação na UFMG"
    }
    ```

    - **Resposta de sucesso:** `201 Created`

    ```json
    {
      "id": 1,
      "nome": "Maria Silva",
      "email": "maria@email.com",
      "cidade": "Salinas",
      "frase": "Aqui começa o futuro.",
      "planosFuturos": "Cursar Ciência da Computação na UFMG",
      "fotoUrl": null,
      "role": "USER",
      "criadoEm": "2026-04-03T10:30:00.000Z"
    }
    ```

    - **Erros:**
      - `400` — Campos obrigatórios ausentes
      - `409` — Email já cadastrado


      ### POST /auth/login

    Autentica um aluno e retorna um token JWT.

    - **Autenticação:** Não
    - **Body:**

    ```json
    {
      "email": "maria@email.com",
      "senha": "minhasenha123"
    }
    ```

    - **Resposta de sucesso:** `200 OK`

    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

    - **Erros:**
      - `401` — Credenciais inválidas (email não existe ou senha incorreta)

      Alunos
    GET /alunos

    Lista todos os alunos cadastrados.

    Autenticação: Não

    Body: Nenhum

    Resposta de sucesso: 200 OK

    ```json

    {
        "id": 1,
        "nome": "Maria Silva",
        "email": "maria@email.com",
        "cidade": "Salinas",
        "frase": "Aqui começa o futuro.",
        "planosFuturos": "Cursar Ciência da Computação na UFMG",
        "fotoUrl": "https://...",
        "role": "USER",
        "criadoEm": "2026-04-03T10:30:00.000Z"
    }

    GET /alunos/:id

    Busca os detalhes de um aluno específico.

    Autenticação: Não

    Body: Nenhum

    Resposta de sucesso: 200 OK

    ```json

    {
        "id": 1,
        "nome": "Maria Silva",
        "email": "maria@email.com",
        "cidade": "Salinas",
        "frase": "Aqui começa o futuro.",
        "planosFuturos": "Cursar Ciência da Computação na UFMG",
        "fotoUrl": "https://...",
        "role": "USER",
        "criadoEm": "2026-04-03T10:30:00.000Z"
    }

    - **Erros:**

    404 — Aluno não encontrado


    PUT /alunos/:id

    Atualiza os dados do perfil do próprio aluno logado.

    Autenticação: Bearer Token

    Body: (Todos os campos são opcionais )

    ```json

    {
        "nome": "Maria Silva Souza",
        "cidade": "Montes Claros",
        "frase": "Nova frase inspiradora",
        "planosFuturos": "Novos planos",
        "fotoUrl": "https://..."
    }

    Resposta de sucesso: 200 OK 

    - **Erros:** 
    401 — Não autenticado
    403 — Sem permissão (tentativa de editar outro aluno )

    DELETE /alunos/:id
    Remove um aluno do sistema (apenas Admin).
    Autenticação: Bearer Token (Admin)
    Body: Nenhum
    Resposta de sucesso: 204 No Content

    - **Erros:**
    401 — Não autenticado
    403 — Sem permissão (não é administrador)

    Mensagens
    GET /mensagens
    Lista todas as mensagens do mural.
    Autenticação: Não
    Body: Nenhum
    Resposta de sucesso: 200 OK

    ```json
    [
    {
        "id": 1,
        "conteudo": "Parabéns pela formatura!",
        "autorId": 1,
        "criadoEm": "2026-04-05T14:30:00.000Z",
        "autor": {
            "id": 1,
            "nome": "Maria Silva",
            "fotoUrl": "https://..."
    }
    }
    ]


    POST /mensagens
    Cria uma nova mensagem no mural.
    Autenticação: Bearer Token
    Body:

    ```json
    {
        "conteudo": "Minha primeira mensagem no mural!"
    }

    Resposta de sucesso: 201 Created

    ```json
    {
        "id": 2,
        "conteudo": "Minha primeira mensagem no mural!",
        "autorId": 1,
        "criadoEm": "2026-04-05T15:00:00.000Z"
    }

    - **Erros:**
    400 — Conteúdo vazio
    401 — Não autenticado

    DELETE /mensagens/:id
    Exclui uma mensagem (apenas o autor ou Admin ).
    Autenticação: Bearer Token
    Body: Nenhum
    Resposta de sucesso: 204 No Content

    - **Erros:**
    401 — Não autenticado
    403 — Sem permissão (não é o dono da mensagem nem admin)
    404 — Mensagem não encontrada