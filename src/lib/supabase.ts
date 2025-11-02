import { createClient } from '@supabase/supabase-js';

// 從環境變數讀取 Supabase 配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 檢查環境變數是否設定
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = 
    '❌ 警告：缺少 Supabase 環境變數！\n' +
    '請在 Render Dashboard 設定環境變數：\n' +
    '  - VITE_SUPABASE_URL\n' +
    '  - VITE_SUPABASE_ANON_KEY\n\n' +
    '應用程式將繼續運行，但 Supabase 功能無法使用。';
  
  // 顯示警告但繼續執行（避免應用程式崩潰）
  console.warn(errorMsg);
}

// 創建 Supabase 客戶端（即使環境變數缺失也創建，避免應用程式崩潰）
export const supabase = createClient(
  supabaseUrl || 'https://yesrdworllzcwetirpxp.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllc3Jkd29ybGx6Y3dldGlycHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTIzNTQsImV4cCI6MjA3NzU4ODM1NH0.GD-njFtrCPvlqzhMHD1tZv0Qiv--NRe5uWJqpvBdrGo'
);

