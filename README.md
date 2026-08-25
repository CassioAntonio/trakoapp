# TrakoApp

https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwj8rO2K3buWAxUqIbkGHcgaMPUQFnoECAwQAQ&url=https%3A%2F%2Fwww.strava.com%2F%3Fhl%3Dpt-BR&usg=AOvVaw19UaCGDheKhyPpJ3k83C3v&opi=89978449 

https://www.strava.com  - clone strava

# APP MOBILE DE TRILHAS OFF-ROAD — ESPECIFICAÇÃO COMPLETA

Você é um **Product Designer, UX/UI Designer e Senior Mobile App Engineer**, especialista em aplicativos de geolocalização, GPS, mapas, atividades esportivas, comunidades e produtos mobile de alta qualidade.

Quero criar um aplicativo mobile inspirado conceitualmente em aplicativos como Strava, Wikiloc e Komoot, porém com **produto, identidade visual, experiência e funcionalidades próprias**, focado exclusivamente em **motociclismo off-road, trilhas, enduro, rally e exploração por terrenos não pavimentados**.

O aplicativo deve parecer um produto real, moderno e pronto para evoluir para produção — não um protótipo genérico.

O nome definitivo do aplicativo ainda será escolhido. Portanto, utilize temporariamente o nome **TRAILX** em textos, componentes e placeholders, deixando a arquitetura preparada para alteração posterior.

---

# 1. CONCEITO DO PRODUTO

O aplicativo será uma plataforma social e de navegação para motociclistas off-road.

O usuário poderá:

* Criar uma conta;
* Criar seu perfil de piloto;
* Registrar suas trilhas;
* Gravar atividades utilizando GPS;
* Visualizar sua posição em um mapa em tempo real;
* Criar e salvar rotas;
* Seguir rotas existentes;
* Descobrir novas trilhas;
* Compartilhar atividades;
* Curtir e comentar atividades;
* Seguir outros pilotos;
* Criar grupos;
* Participar de desafios;
* Visualizar estatísticas;
* Acompanhar distância, velocidade, altitude e tempo;
* Consultar histórico de atividades;
* Avaliar trilhas;
* Classificar dificuldade das trilhas;
* Marcar pontos de interesse;
* Navegar utilizando GPS;
* Utilizar o aplicativo durante uma trilha com pouca ou nenhuma conectividade, quando tecnicamente possível.

O produto deve ter uma forte sensação de:

**aventura + liberdade + competição + comunidade + exploração.**

Não quero que o aplicativo pareça um aplicativo corporativo ou um simples sistema CRUD.

---

# 2. EXPERIÊNCIA MOBILE FIRST

O produto será desenvolvido prioritariamente para smartphones.

A experiência deve ser pensada para:

* Uso com uma mão;
* Uso em ambientes externos;
* Sol forte;
* Uso durante atividades físicas;
* Botões grandes;
* Informações importantes extremamente legíveis;
* Interações rápidas;
* Poucos passos para iniciar uma atividade.

A navegação principal deve utilizar uma estrutura semelhante a:

* Início
* Explorar
* Gravar
* Atividades
* Perfil

O botão de **GRAVAR** deve possuir grande destaque visual, pois será uma das principais ações do aplicativo.

---

# 3. DESIGN SYSTEM

Criar uma identidade visual própria para o aplicativo.

Direção visual:

* Premium;
* Esportiva;
* Aventureira;
* Tecnológica;
* Masculina sem exageros;
* Moderna;
* Alto contraste;
* Inspirada em motociclismo off-road e exploração.

Evitar copiar a identidade visual do Strava.

Não utilizar:

* Logo do Strava;
* Ícones proprietários do Strava;
* Textos do Strava;
* Screenshots;
* Assets;
* Cores ou identidade visual que façam o produto parecer uma cópia.

Criar um design system próprio.

Sugestão inicial:

* Fundo escuro;
* Tons grafite;
* Preto;
* Cinza;
* Branco;
* Uma cor de destaque relacionada à aventura/off-road;
* Elementos de mapa com alto contraste.

A interface deve parecer uma mistura de:

**aplicativo esportivo premium + GPS de aventura + rede social.**

---

# 4. TELA DE LOGIN E ONBOARDING

Criar:

* Splash Screen;
* Login;
* Cadastro;
* Recuperação de senha;
* Login social quando possível;
* Onboarding.

No onboarding perguntar:

* Nome;
* Nome de piloto;
* Foto;
* Localização;
* Tipo de moto;
* Cilindrada;
* Modalidade favorita;
* Nível de experiência.

Modalidades:

* Enduro;
* Trilha;
* Rally;
* Motocross;
* Adventure;
* Trail;
* Hard Enduro;
* Dual Sport;
* Passeio Off-Road.

O onboarding deve ser visualmente forte e curto.

---

# 5. HOME

A Home deve funcionar como um feed social.

Mostrar:

* Atividades recentes dos usuários seguidos;
* Trilhas próximas;
* Recomendações;
* Desafios;
* Ranking;
* Sugestões de pilotos;
* Atividades populares.

Cada atividade deve apresentar:

* Foto;
* Nome do piloto;
* Foto do perfil;
* Tipo de atividade;
* Distância;
* Tempo;
* Velocidade média;
* Ganho de elevação;
* Pequeno mapa da rota;
* Curtidas;
* Comentários.

Exemplo:

"João completou uma trilha"

"42,8 km • 2h 31min • +823m"

---

# 6. TELA EXPLORAR

Criar uma área extremamente importante para descoberta.

O usuário deve conseguir explorar:

* Trilhas;
* Rotas;
* Pilotos;
* Grupos;
* Eventos;
* Desafios.

A tela deve possuir um mapa interativo.

Permitir filtros:

* Distância;
* Dificuldade;
* Tipo de terreno;
* Modalidade;
* Elevação;
* Região;
* Avaliação;
* Trilhas populares;
* Trilhas próximas.

Categorias de dificuldade:

🟢 Fácil
🟡 Moderada
🟠 Difícil
🔴 Extrema

---

# 7. MAPA GPS

O mapa é um dos elementos centrais do produto.

Criar uma experiência de mapa semelhante à de aplicativos modernos de navegação esportiva.

O usuário deve conseguir:

* Visualizar localização atual;
* Ver sua direção;
* Acompanhar rota;
* Dar zoom;
* Mover o mapa;
* Centralizar posição;
* Visualizar trilha;
* Visualizar pontos de interesse;
* Visualizar altitude;
* Visualizar distância percorrida.

Preparar a arquitetura para integração com um serviço real de mapas/GPS.

Não utilizar um mapa falso como solução definitiva.

A arquitetura deve permitir integração futura ou imediata com serviços como:

* Mapbox;
* Google Maps;
* OpenStreetMap;
* MapLibre.

Priorizar uma solução adequada para mapas de trilhas e navegação.

---

# 8. GRAVAÇÃO DE ATIVIDADE

Criar uma tela dedicada para iniciar uma trilha.

Antes de começar:

* Tipo de atividade;
* Nome da atividade;
* Privacidade;
* Moto utilizada.

Durante a atividade mostrar:

DISTÂNCIA
TEMPO
VELOCIDADE
VELOCIDADE MÉDIA
ALTITUDE
GANHO DE ELEVAÇÃO

Também mostrar:

* Mapa em tempo real;
* Trajeto percorrido;
* Localização atual;
* Indicador GPS;
* Status da gravação.

Controles:

▶ INICIAR

⏸ PAUSAR

⏹ FINALIZAR

Ao finalizar:

mostrar resumo completo da atividade.

---

# 9. RESUMO DA ATIVIDADE

Após terminar uma trilha, mostrar:

* Mapa completo;
* Distância;
* Tempo total;
* Tempo em movimento;
* Velocidade média;
* Velocidade máxima;
* Elevação mínima;
* Elevação máxima;
* Ganho total de elevação;
* Descida total;
* Quantidade de pausas;
* Data;
* Local;
* Tipo de atividade.

Criar gráficos para:

* Velocidade;
* Altitude;
* Ritmo da atividade.

A tela deve ser visualmente impressionante e compartilhável.

---

# 10. ROTAS

Permitir que o usuário:

* Criar uma rota;
* Salvar uma rota;
* Importar uma rota;
* Compartilhar uma rota;
* Duplicar uma rota;
* Seguir uma rota;
* Favoritar uma rota.

Preparar suporte para formatos comuns de GPS, especialmente:

* GPX.

Uma rota deve possuir:

* Nome;
* Descrição;
* Distância;
* Elevação;
* Dificuldade;
* Tipo de terreno;
* Região;
* Fotos;
* Avaliação;
* Autor.

---

# 11. PONTOS DE INTERESSE

Permitir adicionar pontos ao mapa.

Exemplos:

⛽ Posto
💧 Água
🏕 Acampamento
🍔 Restaurante
⚠ Perigo
🛠 Oficina
🏁 Ponto de encontro
📍 Mirante
🌲 Local turístico

Cada ponto poderá possuir:

* Nome;
* Descrição;
* Fotos;
* Localização;
* Avaliações.

---

# 12. PERFIL DO PILOTO

Criar um perfil semelhante a uma página esportiva.

Mostrar:

* Foto;
* Nome;
* @username;
* Bio;
* Localização;
* Moto;
* Modalidades;
* Seguidores;
* Seguindo;
* Atividades;
* Distância total;
* Elevação total;
* Tempo total;
* Maior trilha;
* Recordes pessoais.

Criar uma seção visual de estatísticas.

Também criar uma área de conquistas/badges.

Exemplos:

🏆 Primeira trilha
🔥 100 km off-road
⛰ 5.000m de elevação
🏍 10 trilhas concluídas
🌎 Explorador
💀 Hard Enduro

---

# 13. FEED SOCIAL

Implementar conceito de rede social.

Usuários podem:

* Seguir;
* Deixar de seguir;
* Curtir;
* Comentar;
* Compartilhar;
* Salvar atividades.

Criar feed visual e moderno.

As atividades devem priorizar o mapa e as estatísticas.

---

# 14. GRUPOS

Criar funcionalidade de grupos de trilheiros.

Um grupo pode possuir:

* Nome;
* Foto;
* Descrição;
* Região;
* Administradores;
* Membros;
* Trilhas;
* Eventos;
* Feed próprio.

Exemplo:

"Trilheiros de Passos - MG"

---

# 15. DESAFIOS

Criar sistema de desafios.

Exemplos:

"100 km em uma semana"

"Suba 2.000 metros este mês"

"Complete 5 trilhas"

"Explore 3 novas regiões"

Mostrar:

* Progresso;
* Ranking;
* Participantes;
* Recompensa;
* Data de início;
* Data de término.

---

# 16. RANKING

Criar ranking baseado em diferentes métricas.

Filtros:

* Distância;
* Elevação;
* Número de atividades;
* Tempo;
* Região;
* Grupo;
* Período.

Períodos:

* Semana;
* Mês;
* Ano;
* Geral.

---

# 17. GAMIFICAÇÃO

Criar sistema de XP e níveis.

Exemplo:

Nível 1 — Novato
Nível 2 — Explorador
Nível 3 — Trilheiro
Nível 4 — Aventureiro
Nível 5 — Endurista
Nível 6 — Veterano
Nível 7 — Lenda Off-Road

XP pode ser obtido através de:

* Trilhas;
* Distância;
* Elevação;
* Novas regiões;
* Desafios;
* Conquistas.

---

# 18. NOTIFICAÇÕES

Criar central de notificações.

Exemplos:

* Novo seguidor;
* Curtida;
* Comentário;
* Convite para grupo;
* Novo desafio;
* Conquista desbloqueada;
* Evento próximo;
* Atualização de rota.

---

# 19. PRIVACIDADE

Criar controles de privacidade para atividades.

Opções:

* Pública;
* Seguidores;
* Privada.

Também preparar arquitetura para ocultar automaticamente o início/fim da atividade próximo à residência do usuário.

---

# 20. BACKEND E BANCO DE DADOS

Estruturar o projeto pensando em produção.

Utilizar uma arquitetura que permita:

* Autenticação;
* Banco de dados;
* Storage;
* Perfil;
* Atividades;
* Rotas;
* GPS;
* Comentários;
* Curtidas;
* Seguidores;
* Grupos;
* Desafios;
* Notificações.

Caso utilize Supabase, estruturar corretamente:

* Auth;
* PostgreSQL;
* Storage;
* Row Level Security;
* Realtime quando necessário.

Criar banco preparado para geolocalização.

As atividades devem armazenar dados como:

* latitude;
* longitude;
* timestamp;
* altitude;
* velocidade;
* distância;
* direção.

---

# 21. ARQUITETURA DO PROJETO

Não construir tudo como uma única tela ou componente gigante.

Organizar por módulos.

Exemplo:

/auth
/home
/explore
/activity
/routes
/groups
/challenges
/profile
/settings
/components
/services
/hooks
/utils
/types

Criar componentes reutilizáveis.

Manter separação clara entre:

* UI;
* lógica;
* dados;
* serviços;
* GPS;
* mapas;
* autenticação.

---

# 22. DADOS MOCKADOS

Inicialmente utilizar dados mockados realistas para permitir que toda a interface seja visualizada.

Criar:

* Pilotos;
* Atividades;
* Rotas;
* Trilhas;
* Comentários;
* Grupos;
* Desafios;
* Rankings.

Não utilizar lorem ipsum.

Utilizar nomes e dados realistas.

---

# 23. EXPERIÊNCIA VISUAL

Quero uma experiência visual de alto nível.

Priorizar:

* Microinterações;
* Transições suaves;
* Cards modernos;
* Bottom sheets;
* Mapas;
* Gráficos;
* Skeleton loading;
* Estados vazios;
* Feedback visual;
* Animações discretas.

O aplicativo deve transmitir a sensação de um produto que poderia estar publicado na App Store e Google Play.

Não quero aparência de dashboard web adaptado para celular.

---

# 24. RESPONSIVIDADE

Embora o foco seja mobile, criar estrutura que também funcione em diferentes tamanhos de tela.

Priorizar:

* iPhone;
* Android;
* telas pequenas;
* telas grandes.

---

# 25. IMPORTANTE — GPS REAL

Não simular permanentemente funcionalidades que dependem de hardware.

A arquitetura deve deixar claramente separado:

MOCK GPS

versus

GPS REAL.

Quando houver integração com dispositivo real, utilizar APIs nativas adequadas para:

* localização em primeiro plano;
* localização em segundo plano;
* permissões;
* economia de bateria;
* atualização periódica de posição;
* funcionamento durante a atividade.

---

# 26. OFFLINE

Considerar desde o início que trilhas podem acontecer em locais sem internet.

Preparar a arquitetura para futuramente permitir:

* Download de mapas;
* Download de rotas;
* Armazenamento local da atividade;
* Sincronização posterior;
* Continuação da gravação sem internet.

Não assumir que o usuário terá conexão durante toda a trilha.

---

# 27. SEGURANÇA E PERFORMANCE

Priorizar:

* Performance;
* Baixo consumo de bateria;
* Segurança de dados;
* Controle de permissões;
* RLS no banco;
* Validação de dados;
* Tratamento de erros;
* Estados de loading;
* Estados offline;
* Recuperação de conexão.

---

# 28. ROADMAP TÉCNICO

Estruturar o projeto para evoluir em fases.

FASE 1 — MVP VISUAL

* Login;
* Home;
* Feed;
* Explorar;
* Mapa;
* Perfil;
* Atividades;
* Rotas;
* Navegação.

FASE 2 — GPS REAL

* Localização;
* Gravação;
* Background location;
* Estatísticas;
* Histórico.

FASE 3 — SOCIAL

* Seguidores;
* Curtidas;
* Comentários;
* Grupos;
* Compartilhamento.

FASE 4 — AVENTURA

* Trilhas;
* GPX;
* Pontos de interesse;
* Offline;
* Mapas baixáveis.

FASE 5 — GAMIFICAÇÃO

* XP;
* Níveis;
* Badges;
* Desafios;
* Ranking.

---

# 29. REGRA PRINCIPAL DO PROJETO

Não quero apenas uma cópia visual do Strava.

Quero que você use aplicativos como Strava, Wikiloc e outros produtos de aventura esportiva **apenas como referência de UX e funcionalidades**, mas crie uma identidade própria para o produto.

O diferencial deve ser:

**OFF-ROAD + MOTOCICLETA + TRILHAS + GPS + COMUNIDADE + AVENTURA.**

O resultado precisa parecer uma startup real de tecnologia esportiva.

Antes de implementar funcionalidades complexas, construa uma base sólida de navegação, design system, componentes reutilizáveis e arquitetura.

Comece pela experiência mobile e pelas telas principais.

Depois evolua progressivamente para GPS, mapas, backend e funcionalidades sociais.

Não criar apenas uma landing page.

Criar a estrutura de um **aplicativo mobile real**, preparado para evolução e publicação.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/02860050-8929-4c82-b214-e083844e8451).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
