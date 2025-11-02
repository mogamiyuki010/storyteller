import { createClient } from '@supabase/supabase-js';

// 從環境變數讀取 Supabase 配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 檢查環境變數是否設定
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = 
    '❌ 錯誤：缺少 Supabase 環境變數！\n' +
    '請確保 .env.local 檔案中有設定：\n' +
    '  - VITE_SUPABASE_URL\n' +
    '  - VITE_SUPABASE_ANON_KEY\n\n' +
    '如果還沒設定，請參考 .env.example 檔案。';
  
  if (import.meta.env.DEV) {
    // 開發環境：顯示警告但繼續執行（使用空字串，會導致 API 錯誤但不會崩潰）
    console.error(errorMsg);
  } else {
    // 生產環境：直接拋出錯誤
    throw new Error(errorMsg);
  }
}

// 創建 Supabase 客戶端
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

