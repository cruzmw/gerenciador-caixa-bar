# Banco de Dados e Exportação - Gerenciador de Caixa

## 📊 Estrutura do Banco de Dados CSV

O sistema utiliza um banco de dados simples em formato **CSV (Comma-Separated Values)** com delimitador de **ponto e vírgula (;)** para separar os campos. Os dados são armazenados no **localStorage** do navegador e podem ser exportados a qualquer momento.

### Campos do CSV

| Campo | Descrição | Formato |
|-------|-----------|---------|
| ID | Identificador único do fechamento | `caixa_TIMESTAMP` |
| Data/Hora | Data e hora do fechamento | `DD/MM/YYYY HH:MM:SS` |
| Abertura | Valor de abertura do caixa | `0.00` |
| Entradas | Total de entradas em dinheiro | `0.00` |
| Saídas | Total de saídas de dinheiro | `0.00` |
| Suprimentos | Total de suprimentos adicionados | `0.00` |
| Retiradas | Total de retiradas para financeiro | `0.00` |
| Saldo Final | Saldo final calculado | `0.00` |

### Exemplo de Arquivo CSV

```
ID;Data/Hora;Abertura;Entradas;Saidas;Suprimentos;Retiradas;Saldo Final
caixa_1705770000000;20/01/2026 11:00:00;100.00;250.50;75.25;50.00;25.00;300.25
caixa_1705773600000;20/01/2026 12:00:00;300.25;180.00;120.00;0.00;100.00;260.25
```

## 📄 Exportação em PDF

Quando você clica no botão **"Fechar Caixa"**, o sistema realiza automaticamente as seguintes ações:

### 1. Geração de PDF

Um arquivo PDF é gerado contendo:

- **Cabeçalho:** Título "RELATÓRIO DE FECHAMENTO DE CAIXA"
- **Data e Hora:** Momento exato do fechamento
- **Resumo Executivo:** Valores principais (Abertura, Entradas, Saídas, Suprimentos, Retiradas)
- **Saldo Final:** Destacado em verde (positivo) ou vermelho (negativo)
- **Detalhamento Completo:**
  - Lista de todas as entradas com horário
  - Lista de todas as saídas com descrição e horário
  - Lista de todos os suprimentos com horário
  - Lista de todas as retiradas com horário
- **Cálculo da Fórmula:** Exibição clara da fórmula utilizada
- **Rodapé:** Data e hora de geração do documento

**Nome do arquivo:** `fechamento_caixa_[ID].pdf`

### 2. Salvamento em CSV

Os dados são automaticamente salvos no banco de dados CSV (localStorage) com a seguinte estrutura:

```
ID;Data/Hora;Abertura;Entradas;Saidas;Suprimentos;Retiradas;Saldo Final
caixa_1705770000000;20/01/2026 11:00:00;100.00;250.50;75.25;50.00;25.00;300.25
```

## 🔄 Fluxo de Fechamento de Caixa

1. **Clique no botão "Fechar Caixa"** no canto superior direito
2. **Confirmação:** Uma caixa de diálogo solicita confirmação com o saldo final
3. **Geração de PDF:** O arquivo PDF é gerado e baixado automaticamente
4. **Salvamento em CSV:** Os dados são salvos no banco de dados
5. **Limpeza:** O caixa é fechado e a aplicação retorna à tela de abertura
6. **Notificações:** Mensagens de sucesso confirmam cada etapa

## 💾 Acesso ao Banco de Dados

### Via Navegador (DevTools)

1. Abra o navegador e pressione **F12** para abrir o DevTools
2. Vá para a aba **"Application"** ou **"Storage"**
3. Clique em **"Local Storage"**
4. Procure por **"caixa-historico"**
5. O valor contém todo o histórico em formato CSV

### Exportação de Histórico

1. Clique no botão **"Exportar Histórico"** no canto superior direito
2. Um arquivo `historico_caixa.csv` será baixado
3. Abra em um editor de texto ou planilha (Excel, Calc, etc.)

## 📋 Fórmula de Cálculo

O saldo final é calculado automaticamente usando a seguinte fórmula:

```
Saldo Final = Abertura + Entradas + Suprimentos - Saídas - Retiradas
```

Exemplo:
```
Saldo Final = 100.00 + 250.50 + 50.00 - 75.25 - 25.00 = 300.25
```

## 🔐 Persistência de Dados

- **Dados Atuais:** Armazenados em `caixa-data` no localStorage
- **Histórico:** Armazenado em `caixa-historico` no localStorage
- **Duração:** Os dados persistem enquanto o navegador não limpar o cache
- **Backup:** Exporte regularmente o histórico em CSV para ter um backup seguro

## 📱 Compatibilidade

- ✅ Funciona em todos os navegadores modernos (Chrome, Firefox, Safari, Edge)
- ✅ Responsivo para mobile, tablet e desktop
- ✅ Funciona offline (dados armazenados localmente)
- ⚠️ Dados podem ser perdidos se o cache do navegador for limpo

## 🛠️ Dicas de Uso

1. **Faça backup regularmente:** Exporte o histórico em CSV periodicamente
2. **Revise antes de fechar:** Verifique todos os valores antes de clicar em "Fechar Caixa"
3. **Guarde os PDFs:** Os PDFs gerados servem como comprovante do fechamento
4. **Use descrições claras:** Ao registrar saídas, use descrições detalhadas para melhor rastreabilidade

## 📞 Suporte

Se tiver dúvidas sobre como usar o banco de dados ou exportar dados, consulte esta documentação ou entre em contato com o administrador do sistema.
