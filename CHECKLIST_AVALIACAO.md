# Revisão dos critérios de avaliação

| Critério | Peso | Implementação no projeto | Situação |
|---|---:|---|---|
| Navegação e lista com foto, nome, cidade e status | 1,00 | Abas Lista/Mapa/Estatísticas e pilha Cadastro/Detalhes; cartões mostram os dados | Implementado; revisar em dispositivo |
| Cadastro com campos e status | 1,00 | Formulário com nome, descrição, rua, número, cidade, estado e status | Implementado; revisar em dispositivo |
| Detalhes, edição, marcar como Visitado e remover | 1,00 | Tela de detalhes com edição, alternância de status e confirmação de remoção | Implementado; revisar em dispositivo |
| Geocodificação e aviso se não encontrado | 1,50 | `Location.geocodeAsync` e comparação reversa da rua, cidade e estado antes de salvar | Implementado; depende de conexão/serviço de geocoding |
| Mapa com marcador e nome de cada lugar | 1,00 | `MapView` e `Marker` com nome, endereço e status | Implementado; revisar em dispositivo |
| Localização atual via hook `useLocation` | 0,50 | `src/hooks/useLocation.js` solicita permissão e consulta GPS | Implementado; depende de permissão/GPS |
| Foto da câmera ou galeria exibida no app | 1,00 | Câmera nativa pelo seletor do sistema e seletor de fotos; imagem mostrada em lista e detalhes | Implementado; revisar em dispositivo |
| Foto da câmera salva na galeria | 0,50 | `Asset.create` após solicitar permissão | Implementado; revisar em dispositivo |
| Gráfico de pizza com legendas, cores e dados reais | 1,50 | `PieChart`, legenda com quantidade/percentual e dados do estado | Implementado; revisar o empacotamento |
| Segundo gráfico por cidade/estado | 0,50 | `BarChart` agrupa registros por cidade e UF | Implementado; revisar o empacotamento |
| GitHub no prazo e README com nomes/instruções | 0,50 | README com campos de nomes e passos; repositório/entrega dependem do grupo | README pronto; publicação e envio pendentes |

## Limitações da verificação automatizada

- O ambiente de desenvolvimento não oferece um aparelho/emulador Android ou iOS ativo para validar interface, mapas, GPS, câmera e permissões em execução.
- Os testes de empacotamento JavaScript e a checagem de versões podem ser executados localmente; eles não substituem os testes em aparelho.
- O geocoding depende de endereço reconhecido e conexão com a internet.
- O estado dos lugares existe em memória e é reiniciado ao fechar o aplicativo.
- O PDF informa os nomes dos repositórios de referência, sem endereços ou nomes de usuário do GitHub. As buscas pelos nomes exatos não localizaram os quatro projetos, então não foi possível estudar aqueles repositórios específicos; usei a descrição do enunciado e a documentação oficial das APIs.
- `react-native-svg-charts` declara peer dependency para `react-native-svg` 6/7, enquanto o Expo SDK 58 instala `react-native-svg` 15. A instalação exige `--legacy-peer-deps`; o bundle JavaScript foi gerado, mas a renderização dos gráficos precisa de confirmação em aparelho.
- O comando automático `npx expo lint` tentou configurar ESLint e falhou ao buscar dependências por timeout do proxy. O app está em JavaScript e não possui configuração TypeScript. A verificação de sintaxe/empacotamento foi feita pelo export do Expo.
- Em Android, o Expo Go pode bloquear pedidos de acesso amplo à galeria. A captura agora tenta inserir diretamente a foto sem solicitar essa permissão ampla; se o runtime ainda rejeitar a inserção, é necessário repetir a validação em um development build.
