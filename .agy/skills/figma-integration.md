# Skill: Integração com Figma via MCP (`figma-integration.md`)

Esta skill documenta o fluxo de trabalho para inspecionar componentes, extrair design tokens (cores, tipografia, espaçamentos) e baixar imagens/assets vetoriais a partir do arquivo do Figma utilizando o **Figma Developer MCP**.

---

## 🛠️ Ferramentas Disponíveis no MCP

O servidor `figma-developer-mcp` disponibiliza duas ferramentas principais:

1. **`get_figma_data`**:
   - Obtém a árvore de nós, estilos, cores, propriedades de auto-layout, vetores e metadados do arquivo ou de nós específicos.
   - Parâmetros:
     - `fileKey`: ID do arquivo Figma (ex: `https://www.figma.com/design/:fileKey/...`).
     - `nodeIds`: Array de IDs de nós (ex: `["1:23", "4:56"]`).
     - `depth`: Profundidade de inspeção na árvore de elementos.

2. **`download_figma_images`**:
   - Baixa e salva imagens e ícones renderizados diretamente na pasta do projeto (ex: `src/assets/figma/` ou `public/images/`).
   - Parâmetros:
     - `fileKey`: ID do arquivo.
     - `nodeIds`: IDs dos nós a exportar.
     - `format`: Formato de saída (`svg`, `png`, `jpg`, `pdf`).
     - `scale`: Escala (`1`, `2`, `3`).
     - `outputDir`: Diretório de destino no workspace.

---

## 📋 Fluxo de Trabalho Passo a Passo

### 1. Obtenção do `fileKey` e Nós do Projeto
Quando o usuário fornecer o link do Figma (ex: `https://www.figma.com/design/AbCdEfGhIjK/Leve-o-Mar?node-id=1-23`), extrair:
- `fileKey`: `AbCdEfGhIjK`
- `nodeIds`: `["1:23"]`

### 2. Inspeção de Tokens Visuais
Executar chamada para `get_figma_data` a fim de mapear:
- Paleta de cores exata (RGB/Hex) para atualizar `src/assets/base.css` e `.agy/tech-stack.md`.
- Escalas tipográficas (tamanhos de fonte, line-height, letter-spacing).
- Espaçamentos e raios de borda.

### 3. Download Automatizado de Assets
Executar `download_figma_images` para baixar:
- Logomarca oficial do **Leve o Mar** (`svg` em `src/assets/logo.svg`).
- Ícones ilustrados das garrafas e conchas.
- Texturas de fundo e rótulos vetoriais.

### 4. Aplicação no Código Vue 3
- Criar componentes fiéis ao layout do Figma seguindo a receita em `.agy/skills/create-component.md`.
- Assegurar responsividade (mobile 375px, tablet 768px, desktop 1280px+).
