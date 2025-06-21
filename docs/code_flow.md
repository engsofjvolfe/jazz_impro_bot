**Documentação do Fluxo de Código**

Este documento descreve, em alto nível, como as partes do código interagem e qual o caminho dos dados desde a entrada do usuário até a saída final.

---

## 1. Arquitetura de Módulos

1. **`src/notes.js`**

   * **Funções**: `normalize`, `getDegree`, `spellNote`
   * **Responsabilidade**: tratar entradas de notas (validação, padronização), calcular semitons e gerar o nome correto (com acidentes simples/duplos).

2. **`src/intervals.js`**

   * **Objeto**: `intervals`
   * **Responsabilidade**: mapear rótulos de intervalo (`5J`, `5b`, `3M`, `7m`, etc.) para valores de semitons (0–11).

3. **`src/chordFormulas.js`**

   * **Objeto**: `chordFormulas`
   * **Responsabilidade**: definir, para cada tipo de acorde (`maj7`, `m7`, `7`, `m7b5`, `dim7`), um array de intervalos que formam o acorde.

4. **`src/chord.js`**

   * **Classe**: `Chord`
   * **Métodos**:

     * `static parse(input: string) → Chord`
     * `getNotes() → string[]`
     * `toString() → string`
   * **Responsabilidade**: parser de string de acorde (raiz + tipo), uso de `notes`, `intervals` e `chordFormulas` para gerar as notas, formatação da saída.

5. **`src/improvisation.js`**

   * **Função**: `getImprovisationChord(input: string|Chord) → Chord`
   * **Responsabilidade**: aplicar regra de quinta (justa ou diminuta) para gerar novo acorde de improviso, usando `notes` e `intervals`, e chamando `Chord.parse` para normalizar.

6. **`src/bot.js`**

   * **Dependências**: `node-telegram-bot-api`, `dotenv`, `Chord`, `getImprovisationChord`
   * **Fluxo**:

     1. **`/start`**: inicializa `state[chatId] = { step: 'root' }`, pergunta raiz via inline keyboard.
     2. **`callback_query`**: trata três etapas (`root`, `type`, `acc`), confirmando cada escolha (editMessageText), removendo botões e avançando `state`.
     3. **Cálculo final**: monta string `fullChord`, chama `Chord.parse` e `getImprovisationChord`, envia resposta com `toString()`.

---

## 2. Fluxo de Dados (Step-by-Step)

### 2.1 Início (`/start`)

* **Entrada**: usuário envia `/start`.
* **Ação**: `bot.onText` cria `state[chatId] = { step: 'root' }` e envia botões de notas.

### 2.2 Seleção de Raiz

* **Entrada**: usuário clica em `root:X`.
* **Ação**:

  1. `state[chatId].root = X`; `state[chatId].step = 'type'`.
  2. `editMessageText` confirma a raiz e remove botões.
  3. `sendMessage` apresenta botões de tipo.

### 2.3 Seleção de Tipo

* **Entrada**: usuário clica em `type:Y`.
* **Ação**:

  1. `state[chatId].type = Y`; `state[chatId].step = 'acc'`.
  2. `editMessageText` confirma o tipo e remove botões.
  3. `sendMessage` apresenta botões de acidentes.

### 2.4 Seleção de Acidente

* **Entrada**: usuário clica em `acc:Z`.
* **Ação**:

  1. `editMessageText` confirma o acidente e remove botões.
  2. Monta `fullChord = root + Z + type`.
  3. Chama `Chord.parse(fullChord)` → instancia `Chord`.
  4. Chama `getImprovisationChord(chord)` → nova instância `Chord`.
  5. `sendMessage` com:

     * `chord.toString()`
     * `improv.toString()`
  6. `delete state[chatId]` (fluxo concluído).

### 2.5 Internamente em `Chord.parse` → `getNotes()` → `spellNote`

1. **`parse`**:

   * Regex separa `rawRoot` e `rawType`.
   * `normalize(rawRoot)` → `inputRoot`, `normRoot`.
   * `typeMap[rawType]` → tipo canônico.
   * Retorna `new Chord(inputRoot, type, normRoot)`.

2. **`getNotes()`**:

   * `getDegree(normRoot)` → semitom da raiz.
   * `chordFormulas[type]` → array de intervalos.
   * Para cada `intervalKey`:

     * `intervals[intervalKey]` → semitons a somar.
     * `targetDeg = (deg + semis) % 12`.
     * `spellNote(targetDeg, grau, inputRoot[0])` → nota grafada corretamente.
   * Retorna array de notas.

3. **`toString()`** monta `"inputRoot+type: notas.join(', ')"`.

### 2.6 `getImprovisationChord`:

* Recebe `Chord` ou string.
* Usa `Chord.parse` para garantir instância.
* Mapeia `type` para `intervalKey` e `targetType`.
* Usa `getDegree()` e `intervals` para calcular `targetDeg`.
* `spellNote(targetDeg, 5, inputRoot[0])` → nova raiz.
* **Chama** `Chord.parse(newRoot+targetType)` para instanciar acorde de improviso.

---

## 3. Conclusão

Este documento detalha o caminho completo dos dados e decisões lógicas, de **entrada (botão)** até **saída (mensagem final)**. Assim, qualquer desenvolvedor que veja o código entenderá:

* Onde cada módulo é invocado.
* Como os dados fluem e são transformados.
* Em quais pontos de falha (erros) são capturados.

Mantendo esse diagrama atualizado junto com o código, garantimos clareza e facilidade de manutenção a longo prazo.
