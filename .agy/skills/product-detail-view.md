# Skill: Página de Detalhes do Produto e Avaliações (`product-detail-view.md`)

Esta skill documenta a arquitetura, experiência de usuário (UX) e padrões de implementação da tela de detalhes de garrafas (**Product Detail View**) no **Leve o Mar**.

---

## 🌊 Foco Central do Produto: A Garrafa & a Água do Mar

O coração do **Leve o Mar** é a **garrafa artesanal e a água do mar capturada de cada praia brasileira**:
- **A Garrafa**: Frasco de vidro nobre (lapidado, fosco ou âmbar), rolha de cortiça natural selada e rótulo artesanal em papel algodão com coordenadas geográficas reais da enseada.
- **A Água do Mar**: Pureza cristalina, nuances de cores oceânicas únicas (turquesa de Noronha, esmeralda do Espelho, verde-piscina de Maragogi, azul cobalto do Arpoador), luz e reflexos da maré.

---

## 🎯 Requisitos da Experiência da Página

1. **Galeria de Fotos com Miniaturas Laterais**:
   - **Foto Principal em Destaque**: Alta resolução destacando a transparência da garrafa, a cor da água contra a luz, a rolha e o rótulo.
   - **Miniaturas (Thumbnails)**: Coluna vertical lateral com fotos de diferentes ângulos (garrafa inteira, close no rótulo com coordenadas, detalhe da vedação da rolha e ambientação em decoração).
   - Troca suave ao clicar na miniatura com transição de opacidade.

2. **Painel de Informações & Compra**:
   - **Origem & Localização**: Nome da praia, Cidade, Estado, Região e coordenadas geográficas exatas.
   - **Tom da Água & Características**: Selo com o tom oceânico (ex: *Turquesa Translúcido*, *Verde Esmeralda*, *Piscinas Naturais*).
   - **Preço & Parcelamento**: Preço formatado em BRL (`R$ XX,XX`), parcelamento em até 3x sem juros e estoque do lote atual.
   - **Personalização do Rótulo**: Opção de gravar dedicatória afetiva para presente.
   - **Ação Principal**: Botão *Adicionar às Minhas Aventuras* com abertura imediata do carrinho lateral.

3. **Seções Informativas & Abas de Conteúdo**:
   - **Aba 1: A Água & o Mar do Destino**: Detalhes da enseada, temperatura média, tom das águas, luminosidade e marés.
   - **Aba 2: História & Lendas da Praia**: A memória do lugar, curiosidades e tradição dos pescadores locais.
   - **Aba 3: A Garrafa & Artesanato**: Tipo de vidro, vedação da rolha de cortiça, papel do rótulo e selo numerado de lote.
   - **Aba 4: Embalagem Antiimpacto & Envio**: Como o vidro é protegido com segurança até a entrega na sua casa.

4. **Sistema Completo de Avaliações (Reviews)**:
   - **Score Geral & Distribuição**: Nota média (ex: `4.9 / 5.0`) e barras de porcentagem para 5★, 4★, 3★, 2★ e 1★.
   - **Filtro Reativo por Estrelas**: Botões em pílula (*Todas*, *5 estrelas*, *4 estrelas*, etc.) que filtram a lista instantaneamente.
   - **Formulário de Nova Opinião**:
     - Seletor interativo de estrelas douradas clicáveis (1 a 5).
     - Campos de Nome, Cidade e Depoimento.
     - Validação, notificação via `vue-sonner` e inclusão instantânea na lista.
