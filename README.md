# Diário de Viagens

Aplicativo acadêmico desenvolvido em React Native com Expo. Nele você cadastra lugares que quer conhecer ou já visitou, localiza cada endereço no mapa, adiciona fotos e acompanha estatísticas atualizadas.

## Integrantes


- Francisco Rodrigues Rocha
- Marcelo Morais Bueno
- Murilo Pessoni Cândido

## Funcionalidades

- Lista de lugares com busca, filtro por status, foto, cidade e situação da viagem.
- Cadastro e edição de nome, descrição, rua, número, cidade, estado e status.
- Conversão do endereço em coordenadas com `Location.geocodeAsync` e conferência reversa da rua, cidade e estado antes de salvar.
- Foto selecionada na galeria ou tirada pela câmera nativa do aparelho; fotos capturadas são salvas na galeria.
- Detalhes, mapa individual, alteração do status e remoção de lugares.
- Mapa com marcadores dos destinos e marcador da localização atual do aparelho.
- Gráfico de pizza por status e gráfico de barras por cidade/estado, ambos baseados nos dados cadastrados.
- Avisos para permissões negadas e falhas de geolocalização, câmera, galeria ou geocodificação.

## Requisitos

- Node.js 22.13 ou superior (ou Node.js 24.3 ou superior).
- npm, incluso com o Node.js.
- Expo Go compatível com o SDK do projeto ou um emulador/dispositivo configurado para executar o app.
- Para os recursos nativos de câmera, localização e mapas, recomendamos executar em um aparelho Android/iOS. A localização depende do GPS e o geocoding depende de conexão com a internet.

O projeto foi criado com Expo SDK 58, React Native 0.88 e React 19.3. As bibliotecas nativas do Expo estão alinhadas ao SDK 58. `react-native-svg-charts` é mantida em sua versão publicada pelo comando com `--legacy-peer-deps`, conforme a orientação do trabalho.

## Instalação e execução

1. Instale o Node.js e o Git, se ainda não estiverem instalados.
2. Clone o repositório e entre na pasta:

   ```bash
   git clone https://github.com/MuriloPessoni/DiarioViagens.git
   cd DiarioViagens
   ```

   Se você baixou o ZIP, extraia-o e abra a pasta `DiarioViagens` no terminal ou no VS Code.

3. Instale as dependências (a flag é necessária por causa da declaração de peer dependency antiga do pacote de gráficos):

   ```bash
   npm install --legacy-peer-deps
   ```

4. Inicie o Expo:

   ```bash
   npx expo start
   ```

5. Escaneie o QR code com o Expo Go compatível. Para usar emulador, pressione `a` para Android (com o Android Studio/emulador configurado) ou `i` para iOS em um computador macOS.

Se necessário, limpe o cache do Metro com `npx expo start --clear`.

## Permissões

O app pede acesso à localização em primeiro plano para mostrar sua posição no mapa e à câmera para tirar fotos. A galeria abre pelo seletor de fotos do sistema. No Android, o app tenta adicionar a foto capturada diretamente à galeria sem pedir acesso amplo de leitura. Se o Expo Go instalado no aparelho bloquear essa gravação, teste em um development build; a foto capturada continua anexada ao formulário enquanto o app está aberto.

## Organização do código

```text
DiarioViagens/
├── App.js
├── app.json
├── src/
│   ├── components/       # Botões, cartões e etiquetas de status
│   ├── context/          # Estado compartilhado dos lugares
│   ├── hooks/            # Hook de localização atual
│   ├── navigation/       # Navegação por abas
│   ├── screens/          # Lista, cadastro, detalhes, mapa e estatísticas
│   └── theme.js          # Cores e estilos comuns
├── package.json
└── README.md
```

Os dados ficam no estado compartilhado do app e permanecem disponíveis enquanto ele está aberto. Eles não são sincronizados com uma conta ou servidor.

## Publicação no GitHub

1. Crie um repositório público no GitHub (o professor precisa conseguir acessá-lo).
2. Preencha os nomes dos integrantes neste README.
3. Na pasta do projeto, execute:

   ```bash
   git init
   git add .
   git commit -m "Projeto Diário de Viagens"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
   git push -u origin main
   ```

4. Confira em uma janela anônima que o repositório está público e que o README está correto.
5. Envie pelo Teams o link do repositório até **24/11/2026 às 23h59**.

Não inclua `node_modules` no repositório.
