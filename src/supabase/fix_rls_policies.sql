-- =====================================================
-- CORREÇÃO DAS POLÍTICAS RLS (Row Level Security)
-- Execute este script no Supabase SQL Editor para corrigir
-- o erro: "new row violates row-level security policy"
-- =====================================================

-- Remover políticas antigas do ranking_familia (se existirem)
DROP POLICY IF EXISTS "Ranking é visível para todos" ON ranking_familia;
DROP POLICY IF EXISTS "Ranking pode ser criado por todos" ON ranking_familia;
DROP POLICY IF EXISTS "Ranking pode ser atualizado por todos" ON ranking_familia;

-- Recriar políticas com permissões corretas

-- Política de SELECT (leitura)
CREATE POLICY "Ranking é visível para todos"
ON ranking_familia FOR SELECT
USING (true);

-- Política de INSERT (criação) - NECESSÁRIA para o trigger
CREATE POLICY "Ranking pode ser criado por todos"
ON ranking_familia FOR INSERT
WITH CHECK (true);

-- Política de UPDATE (atualização) - NECESSÁRIA para o trigger
CREATE POLICY "Ranking pode ser atualizado por todos"
ON ranking_familia FOR UPDATE
USING (true);

-- Verificar se as políticas foram criadas corretamente
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'ranking_familia'
ORDER BY policyname;

-- Mensagem de sucesso
SELECT 'Políticas RLS corrigidas com sucesso! ✅' AS status;
