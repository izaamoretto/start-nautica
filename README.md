# Start Náutica — Orçamentos

Site estático em HTML, CSS e JavaScript, compatível com GitHub Pages. Abra `index.html` no navegador para usar localmente. Não requer Node, instalação de pacotes ou servidor para o uso básico.

## Uso

1. Preencha os dados do cliente e da embarcação.
2. Escreva título e descrição e toque em **Adicionar serviço**. É possível editar e remover cada serviço.
3. Preencha valor total e prazo. Valores usam o formato brasileiro: `15.300,00`.
4. Clique em **Gerar PDF**. O documento será gerado localmente e o navegador tentará baixá-lo. O botão **Baixar PDF** permanece disponível.
5. Em navegadores compatíveis, o botão **Compartilhar PDF** abre o compartilhamento do aparelho. Caso não apareça, salve e anexe o arquivo manualmente.

Dados ficam apenas na memória da página. Fechar ou recarregar perde o preenchimento; salve o PDF antes. Não há login, banco de dados, histórico ou envio automático ao WhatsApp.

## Publicação no GitHub Pages

Envie os arquivos deste diretório a um repositório. Em Settings → Pages, escolha Deploy from a branch, a branch `main` e a pasta `/ (root)`. O arquivo `.nojekyll` mantém a publicação estática. Não inclua PDFs reais de clientes no repositório.

## Arquivos

- `index.html`: formulário e estrutura.
- `style.css`: interface responsiva e prévia.
- `script.js`: edição, validação, prévia, download e compartilhamento.
- `pdf.js`: paginação e desenho do PDF A4 com texto selecionável.
- `assets/logo.jpeg`: logo fornecida.
- `assets/logo-data.js`: a mesma logo em base64 para geração local sem requisição de rede. Atualize este arquivo ao substituir a logo.
- `vendor/jspdf.umd.min.js`: jsPDF 4.2.1, licença MIT no mesmo diretório.

A prévia HTML mostra o conteúdo; as quebras de página são calculadas pelo gerador PDF. Verificar download e compartilhamento em um iPhone real após a publicação por HTTPS.
