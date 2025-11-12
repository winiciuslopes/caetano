# 📄 Schema SQL - Instruções de Instalação

## ⚡ Instalação Rápida

1. Abra o Supabase Dashboard do seu projeto
2. Vá em **SQL Editor** (menu lateral esquerdo)
3. Clique em **New Query**
4. Copie **TODO** o conteúdo do arquivo `schema.sql`
5. Cole no editor
6. Clique em **Run** (ou pressione `Ctrl + Enter`)
7. Aguarde a mensagem: **"Schema criado com sucesso!"**

## ✅ Verificação

Após executar, você deve ver:

### No SQL Editor:
```
┌──────────────────────────────────┬──────────────┬──────────────────┬─────────────────┐
│ mensagem                         │ total_perfis │ total_jogadas    │ total_ranking   │
├──────────────────────────────────┼──────────────┼──────────────────┼─────────────────┤
│ Schema criado com sucesso!       │ 3            │ 1                │ 1               │
└──────────────────────────────────┴──────────────┴──────────────────┴─────────────────┘
```

### No Table Editor:
- ✅ Tabela `perfis` (3 registros de exemplo)
- ✅ Tabela `historico_jogadas` (1 registro de exemplo)
- ✅ Tabela `ranking_familia` (1 registro de exemplo)

### No Database > Functions:
- ✅ `gerar_token_familiar()`
- ✅ `validar_token_familiar()`
- ✅ `atualizar_estatisticas_perfil()`
- ✅ `atualizar_ranking_familia()`
- ✅ `obter_ranking_familia()`
- ✅ `obter_ranking_global()`
- ✅ `obter_estatisticas_gerais()`

## 🔄 Reinstalação

Se precisar reinstalar (apagar tudo e começar do zero):

1. O próprio script já remove as tabelas antigas antes de criar
2. Basta executar o `schema.sql` novamente
3. Tudo será recriado do zero

## 🧪 Testar Manualmente

Depois de executar o schema, teste no SQL Editor:

```sql
-- 1. Gerar novo token
SELECT gerar_token_familiar();

-- 2. Validar token
SELECT validar_token_familiar('ABC123');

-- 3. Ver perfis
SELECT * FROM perfis;

-- 4. Ver histórico
SELECT * FROM historico_jogadas;

-- 5. Ver ranking
SELECT * FROM obter_ranking_familia('ABC123');

-- 6. Ver estatísticas
SELECT * FROM obter_estatisticas_gerais();
```

## 📊 Dados de Exemplo

O script cria automaticamente uma família de exemplo:

**Token:** `ABC123`

**Membros:**
- João Silva 👨
- Maria Silva 👩
- Pedro Silva 👦

**Jogada:** 1 jogada no quiz (João Silva, 100 pontos)

Use este token para testar antes de criar sua própria família.

## 🐛 Erros Comuns

### "syntax error at or near..."
- **Causa:** Você copiou apenas parte do arquivo
- **Solução:** Copie **TODO** o conteúdo do `schema.sql`

### "permission denied"
- **Causa:** Usuário sem permissões
- **Solução:** Use o projeto como Owner (criador do projeto)

### "already exists"
- **Causa:** Tabelas já existem de execução anterior
- **Solução:** O script remove automaticamente, execute novamente

## 📝 O que o Schema Cria

### Tabelas (3)
1. **perfis** - Jogadores/integrantes das famílias
2. **historico_jogadas** - Log de todas as jogadas
3. **ranking_familia** - Classificação familiar

### Funções SQL (7)
1. **gerar_token_familiar()** - Gera token único de 6 caracteres
2. **validar_token_familiar()** - Valida formato do token
3. **atualizar_estatisticas_perfil()** - Trigger para atualizar stats
4. **atualizar_ranking_familia()** - Trigger para atualizar ranking
5. **obter_ranking_familia()** - Retorna ranking de uma família
6. **obter_ranking_global()** - Retorna ranking global
7. **obter_estatisticas_gerais()** - Retorna estatísticas do sistema

### Triggers (2)
1. **trigger_atualizar_estatisticas** - Atualiza perfil ao registrar jogada
2. **trigger_atualizar_ranking** - Atualiza ranking ao registrar jogada

### Segurança (RLS)
- Row Level Security habilitado em todas as tabelas
- Políticas de acesso configuradas
- Todos podem ler, apenas donos podem atualizar

## 🔐 Segurança

O schema já vem com:
- ✅ RLS (Row Level Security) habilitado
- ✅ Políticas de acesso configuradas
- ✅ Validações de formato (token 6 caracteres)
- ✅ Constraints de integridade referencial
- ✅ Checks de valores válidos

## 📚 Próximos Passos

Após executar este schema:

1. Configure as credenciais em `/utils/supabase/info.tsx`
2. Execute os testes: `npm run test` ou use o componente TesteDoBanco
3. Comece a usar o cliente TypeScript em `/lib/supabaseClient.ts`

## 🆘 Precisa de Ajuda?

Consulte:
- `/README.md` - Documentação completa
- `/SETUP_RAPIDO.md` - Guia rápido de setup
- `/COMO_MIGRAR.md` - Como migrar do mockData

---

**Importante:** Execute este schema **ANTES** de tentar usar o cliente TypeScript.
