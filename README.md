O projeto é um aplicativo mobile desenvolvido com React Native + Expo Router, organizado em rotas do tipo (auth) e (drawer), com integração a uma API externa de filmes (IMDB API).

Ele funciona como um gerenciador de filmes assistidos / para assistir, permitindo que o usuário:

Crie uma conta

Faça login

Pesquise filmes

Liste filmes recomendados / populares

Marque filmes como “Assistidos”

Marque filmes como “Quero Assistir”

Visualize detalhes de cada filme

Navegue por meio de um Drawer Menu

Todo o estado é organizado com contextos (Contexts API), incluindo autenticação e lista de filmes.

Principais Módulos do Projeto
Autenticação – pasta app/(auth)

Inclui:

login.tsx

register.tsx

index.tsx

/_layout.tsx

Funções:

Tela de login
 Tela de registro
Navegação protegida por layout
Acesso ao AuthContext (token, usuário logado etc.)
