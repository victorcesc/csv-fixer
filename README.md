# CSV Fix Tool

Uma ferramenta simples para corrigir arquivos CSV corrompidos, especialmente aqueles com problemas de formatação de aspas.

## Descrição

Este projeto contém um script Node.js que corrige automaticamente problemas comuns em arquivos CSV:

- Remove BOM (Byte Order Mark) do início do arquivo
- Corrige aspas duplas malformadas (`""` → `"`)
- Repara campos de cabeçalho com aspas faltando
- Adiciona valores vazios para campos ausentes
- Remove aspas extras no início e fim das linhas

## Pré-requisitos

- Node.js instalado no sistema
- Acesso ao terminal/linha de comando

## Instalação

1. Clone ou baixe este repositório
2. Navegue até a pasta do projeto:

```bash
cd csv-fixer
```

## Uso

### Sintaxe Básica

```bash
node fix_csv.js <arquivo_entrada> [arquivo_saida]
```

### Exemplos de Uso

**Uso básico** (arquivo de saída será `target-fixed.csv`):

```bash
node fix_csv.js target.csv
```

**Com nome de arquivo de saída personalizado**:

```bash
node fix_csv.js target.csv arquivo-corrigido.csv
```

**Corrigir qualquer arquivo CSV**:

```bash
node fix_csv.js meus-dados.csv
node fix_csv.js dados.txt dados-limpos.csv
```

### Parâmetros

- `arquivo_entrada`: Caminho para o arquivo CSV que precisa ser corrigido (obrigatório)
- `arquivo_saida`: Caminho para o arquivo de saída corrigido (opcional)

Se o `arquivo_saida` não for especificado, o script automaticamente adicionará `-fixed` ao nome do arquivo de entrada.

## Exemplo de Saída

### Arquivo Original (corrompido)

```csv
"TB_ID,""CEP_INICIAL"",""CEP_FINAL"",""PESO_INICIAL"",""PESO_FINAL"",""VALOR_FRETE"",""VALOR_PRECO"",""VALOR_PESO"",""PRAZO_ENTREGA"""
",""01000000"",""01099999"",""0"",""300"",""9.36"",""0.6"",""0"",""1"""
```

### Arquivo Corrigido

```csv
"TB_ID","CEP_INICIAL","CEP_FINAL","PESO_INICIAL","PESO_FINAL","VALOR_FRETE","VALOR_PRECO","VALOR_PESO","PRAZO_ENTREGA"
"","01000000","01099999","0","300","9.36","0.6","0","1"
```

## Funcionalidades

### Correções Automáticas

1. **Detecção de Cabeçalho**: Identifica automaticamente a linha de cabeçalho baseada no número de campos com aspas
2. **Correção de Aspas**: Converte aspas duplas (`""`) para aspas simples (`"`)
3. **Reparo de Campos**: Corrige campos de cabeçalho com aspas faltando
4. **Campos Vazios**: Adiciona valores vazios para campos ausentes na primeira coluna
5. **Limpeza de Formatação**: Remove aspas extras no início e fim das linhas

### Compatibilidade

- Funciona com qualquer estrutura de CSV
- Não depende de nomes específicos de colunas
- Suporta arquivos com diferentes codificações
- Remove BOM automaticamente

## Tratamento de Erros

O script inclui tratamento de erros para:

- Arquivo de entrada não encontrado
- Arquivo vazio
- Argumentos de linha de comando inválidos
- Problemas de leitura/escrita de arquivo

## Mensagens de Saída

### Sucesso

CSV file fixed successfully!
Input: target.csv
Output: target-fixed.csv
First 3 lines of fixed file:
1: "TB_ID","CEP_INICIAL","CEP_FINAL","PESO_INICIAL","PESO_FINAL","VALOR_FRETE","VALOR_PRECO","VALOR_PESO","PRAZO_ENTREGA"
2: "","01000000","01099999","0","300","9.36","0.6","0","1"
3: "","01000000","01099999","301","500","10.44","0.6","0","1"

### Erro

Error: Input file 'arquivo-inexistente.csv' not found.

Usage: node fix_csv.js <input_file> [output_file]
Example: node fix_csv.js target.csv target-fixed.csv
