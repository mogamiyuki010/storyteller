-- ============================================
-- Supabase 資料庫設置 SQL
-- ============================================
-- 請在 Supabase Dashboard -> SQL Editor 中執行此檔案

-- 1. 創建 user_leads 表（用戶報名表）
CREATE TABLE IF NOT EXISTS user_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 為 email 添加唯一約束（可選，防止重複報名）
-- ALTER TABLE user_leads ADD CONSTRAINT unique_email UNIQUE (email);

-- 2. 創建 user_actions 表（行為追蹤表）
CREATE TABLE IF NOT EXISTS user_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 創建索引以提高查詢效能
CREATE INDEX IF NOT EXISTS idx_user_leads_created_at ON user_leads(created_at);
CREATE INDEX IF NOT EXISTS idx_user_leads_email ON user_leads(email);
CREATE INDEX IF NOT EXISTS idx_user_actions_session_id ON user_actions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_action_type ON user_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_user_actions_created_at ON user_actions(created_at);

-- 4. 啟用 Row Level Security (RLS)
ALTER TABLE user_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_actions ENABLE ROW LEVEL SECURITY;

-- 5. 創建 RLS 策略 - 允許匿名用戶插入資料
-- user_leads 表策略
CREATE POLICY "Allow anonymous insert on user_leads"
  ON user_leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 允許認證用戶查看所有資料（可選，用於管理後台）
-- CREATE POLICY "Allow authenticated read on user_leads"
--   ON user_leads
--   FOR SELECT
--   TO authenticated
--   USING (true);

-- user_actions 表策略
CREATE POLICY "Allow anonymous insert on user_actions"
  ON user_actions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 允許認證用戶查看所有資料（可選）
-- CREATE POLICY "Allow authenticated read on user_actions"
--   ON user_actions
--   FOR SELECT
--   TO authenticated
--   USING (true);

-- 6. 驗證設置
-- 執行以下查詢確認表已創建：
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT * FROM user_leads LIMIT 5;
-- SELECT * FROM user_actions LIMIT 5;

