# Start Náutica ⚓

Um projeto de fim de semana que nasceu de uma necessidade bem próxima de mim: facilitar a criação de orçamentos na empresa do meu namorado.

Ele trabalha com restauração e valorização de embarcações e usava um modelo no Canva para montar as propostas pelo notebook. Quando passou a depender só do celular, esse processo ficou mais trabalhoso.

Como já trabalho com tecnologia há cinco anos, resolvi aproveitar o fim de semana para experimentar a IA na prática e ajudar a resolver esse problema. Foi assim que surgiu esse gerador de orçamentos 😊

**[Acesse o projeto aqui](https://izaamoretto.github.io/start-nautica/)**

## A ideia

Queria que ele pudesse abrir um site no celular, preencher as informações do serviço e gerar um PDF bonito, com a identidade visual da Start Náutica, pronto para enviar ao cliente.

O foco foi deixar o uso simples e o documento organizado, mesmo quando o orçamento tem bastante texto e precisa de mais de uma página.

## O que dá para fazer

- Preencher os dados do cliente e da embarcação.
- Adicionar, editar e remover serviços.
- Informar o investimento total, o prazo e as observações.
- Conferir uma prévia enquanto preenche.
- Gerar e baixar o orçamento em PDF.
- Compartilhar o arquivo diretamente nos navegadores compatíveis.

## Como desenvolvi

Usei **HTML, CSS e JavaScript**, com a biblioteca **jsPDF** para gerar os documentos e o **GitHub Pages** para publicar o site.

A IA me ajudou a escrever o código e fazer os ajustes. Minha parte foi trazer o problema, definir o que precisava funcionar, avaliar o resultado e ir refinando a experiência e o layout. Até o tamanho do valor no PDF entrou nos ajustes!

Foi uma oportunidade de explorar essa forma de desenvolver com um objetivo concreto, acompanhando o projeto desde a ideia até a publicação.

## Para usar

1. Preencha os dados do orçamento.
2. Escreva o título e a descrição de cada serviço e clique em **Adicionar serviço**.
3. Informe o valor no formato brasileiro, como `15.300,00`, e as condições do trabalho.
4. Confira as informações e clique em **Gerar PDF**.
5. Salve o arquivo ou use **Compartilhar PDF**, quando essa opção estiver disponível.

Nesta versão, o preenchimento fica apenas na memória da página. Não há cadastro nem histórico de orçamentos, então é preciso salvar o PDF antes de fechar ou recarregar o site. As informações preenchidas não são enviadas para um banco de dados: o PDF é gerado no próprio navegador.

## Para abrir no computador

Baixe ou clone o repositório e abra o arquivo `index.html` no navegador. Não precisa instalar dependências para usar o projeto.

Os principais arquivos são:

- `index.html`: estrutura da página e formulário.
- `style.css`: visual e adaptação para celular.
- `script.js`: interação dos campos, serviços e prévia.
- `pdf.js`: montagem e paginação do PDF.
- `assets/`: logo da empresa e sua versão usada no PDF.
- `vendor/`: biblioteca jsPDF e sua licença.

---

Um projeto feito com apoio de IA e uma necessidade real como ponto de partida. 💙
