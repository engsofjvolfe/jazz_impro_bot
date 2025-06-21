**Fluxo Detalhado do Aplicativo (Para Leigos)**

Este documento descreve de forma simples e passo a passo como o nosso bot de Telegram funciona, desde o momento em que o usuário inicia a conversa até a geração dos acordes para improvisação. Cada etapa é explicada de forma clara, sem jargões técnicos.

---

## 1. Início da Conversa (`/start`)

1. O usuário abre o Telegram e envia o comando **`/start`** para nosso bot.
2. O bot responde com uma mensagem: **“Escolha a nota base:”** e apresenta botões para as notas **C, D, E, F, G, A, B**.

   * Cada botão é clicável. Isso evita que o usuário tenha que digitar texto livre e reduz erros.

## 2. Escolha da Raiz (Fundamental)

1. O usuário clica em uma das notas base (por exemplo, **D**).
2. O bot *confirma* a escolha, editando a mensagem para **“✅ Nota base selecionada: D”** e removendo os botões.
3. Em seguida, o bot envia a próxima pergunta: **“Escolha o tipo de acorde:”**, com botões para **Maior, Menor, Dominante, Meio Diminuído, Diminuto**.

## 3. Escolha do Tipo de Acorde

1. O usuário clica em um tipo (por exemplo, **Menor**).
2. O bot confirma, editando a mensagem para **“✅ Tipo de acorde selecionado: m7”** e removendo esses botões.
3. Em seguida, o bot pergunta: **“Escolha acidente (opcional):”**, com botões para **♭**, **♯** e **—** (nenhum).

## 4. Escolha do Acidente (♭/♯/")

1. O usuário escolhe se deseja adicionar sustenido (♯), bemol (♭) ou nenhum acidente.
2. O bot confirma, editando a mensagem para **“✅ Acidente selecionado: ♭”** (ou “nenhum”) e removendo os botões.
3. Agora o bot tem três informações armazenadas: **nota base** (ex: D), **tipo** (ex: m7) e **acidente** (ex: ♭).

## 5. Cálculo dos Acordes (Lógica Interna)

1. **Engine de Acordes** (módulos em código) recebe a string completa, por exemplo **"Dbm7"**.
2. **Parser**: divide em **raiz** ("Db") e **tipo** ("m7").
3. **Normalização**: transforma a raiz em uma forma interna padrão ("D♭" → semitom número x).
4. **Fórmula de Acorde**: mistura intervalos (1ª, 3ª, 5ª, 7ª) para gerar cada nota do acorde base.
5. **Grafia Dinâmica**: escolhe se cada nota deve ser nomeada como Sustenido, Bemol, Duplo Sust. ou Duplo Bemol, de modo musicalmente correto.
6. **Resultado Base**: monta uma string como **"Dbm7: Db, Fb, Ab, Cb"**.
7. **Regra de Improvisação**: aplica a "quinta acima" (ou quinta diminuta), criando um novo acorde com lógica semelhante.
8. **Resultado Improviso**: monta uma string como **"Gbm7: Gb, Bbb, Db, Fb"**.

## 6. Resposta Final ao Usuário

1. O bot envia uma mensagem final com:

   * **Acorde base**: exibido com notas corretas.
   * **Acorde para improviso**: seguindo a regra musical.
2. Exemplo:

   ```
   🎵 Acorde base: Dbm7: Db, Fb, Ab, Cb
   🎸 Acorde p/ improviso: Gbm7: Gb, Bbb, Db, Fb
   ```
3. A conversa é encerrada, e o bot limpa o estado para permitir novas sequências.

---

### Pontos Importantes

* **Botões Guiados**: evitam erros de digitação e tornam o fluxo intuitivo.
* **Confirmações Visuais**: cada etapa confirma a escolha e bloqueia a etapa anterior.
* **Cálculo Musical Completo**: cobre enarmonias complexas (bb, ##) sem listas manuais.
* **Modularidade**: o código está organizado em partes (notas, intervalos, fórmulas, parsing, improvisação).

Este é o fluxo completo, do **/start** até a geração de acordes prontos para improvisar. Ideal para músicos de nível intermediário/avançado, sem necessidade de lidar com sintaxe ou teoria avançada.
