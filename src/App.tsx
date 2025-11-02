import { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Card, CardContent } from './components/ui/card';
import { Gift, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from './components/Toaster';
import { supabase } from './lib/supabase';
import heroImage from './assets/23f4297c2a58fc435226e2f9ee4884b7fb62f065.png';
import journeyImage from './assets/3b62e4e7830ed013107b9911de7665b77982b6cd.png';

export default function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionID] = useState(() => crypto.randomUUID());

  // 行為追蹤函式
  const trackAction = async (actionType: string, details: Record<string, any> = {}) => {
    try {
      const { error } = await supabase
        .from('user_actions')
        .insert({
          session_id: sessionID,
          action_type: actionType,
          details: details
        });

      if (error) {
        console.error('追蹤行為時發生錯誤:', error.message);
      } else {
        console.log('行為已記錄:', actionType, details);
      }
    } catch (err) {
      console.error('追蹤函式執行失敗:', err);
    }
  };

  // 頁面載入時追蹤
  useEffect(() => {
    trackAction('page_view', { path: window.location.pathname });

    // 滾動深度追蹤
    const scrollTracked: Record<number, boolean> = { 25: false, 50: false, 75: false, 100: false };
    
    const handleScroll = () => {
      const scrollDepth = (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100;
      
      for (const percentage of [25, 50, 75, 100]) {
        if (scrollDepth >= percentage && !scrollTracked[percentage]) {
          trackAction('scroll_depth', { percentage: percentage });
          scrollTracked[percentage] = true;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const leadData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
      };

      const { error } = await supabase
        .from('user_leads')
        .insert(leadData);

      if (error) {
        throw error;
      }

      // 成功
      toast.success('報名成功！感謝您的填寫。');
      setFormData({ name: '', email: '', phone: '' });
      
      // 追蹤成功報名
      trackAction('form_submit_success', { formId: 'form-leads' });
      
    } catch (err: any) {
      // 失敗
      toast.error(`報名失敗：${err.message || '請稍後再試'}`);
      console.error('表單提交錯誤:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    trackAction('click', { elementId: id });
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-white">
        {/* Hero Section - 使用設計圖 */}
        <header className="relative bg-white overflow-hidden">
          <div className="container mx-auto px-4">
            <img 
              src={heroImage} 
              alt="好想把的事變故事" 
              className="w-full max-w-4xl mx-auto"
            />
          </div>
          
          {/* 互動按鈕覆蓋層 */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 flex-wrap justify-center px-4">
            <button 
              onClick={() => scrollToSection('journey')}
              className="bg-[#5A9A9E] hover:bg-[#4A8A8E] text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
            >
              腦海尋寶
            </button>
            <button 
              onClick={() => scrollToSection('journey')}
              className="bg-[#5A9A9E] hover:bg-[#4A8A8E] text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
            >
              書山踏青
            </button>
            <button 
              onClick={() => scrollToSection('cta')}
              className="bg-[#5A9A9E] hover:bg-[#4A8A8E] text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
            >
              故事DIY
            </button>
          </div>
        </header>

        <main>
          {/* 介紹區 */}
          <section id="intro" className="bg-gradient-to-b from-white to-[#F5F9FA] py-16 md:py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="mb-6 text-[#3D4C6B]">創作號帶你發現故事的魔法</h2>
                <p className="text-gray-700 leading-relaxed">
                  你是否常覺得生活中的點滴，明明充滿感動、驚奇，卻不知如何分享？或是腦中有許多想法，卻難以化為動人的文字？「觀光列車創作號」正是為你打造，我們將帶你探索、採集、編織，讓生命中的每一個「●■▲」都成為獨一無二的故事！
                </p>
              </div>
            </div>
          </section>

          {/* Journey Section - 使用設計圖 */}
          <section id="journey" className="bg-[#F5F9FA] py-16 md:py-20">
            <div className="container mx-auto px-4">
              <img 
                src={journeyImage} 
                alt="本趟列車沿途停靠站" 
                className="w-full max-w-4xl mx-auto"
              />
            </div>
          </section>

          {/* 詳細說明區 - 補充資訊 */}
          <section className="bg-white py-16 md:py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-center mb-12 text-[#3D4C6B]">旅程站點詳解</h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {/* 站點 1 */}
                  <Card className="border-2 border-[#F9D857] hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-[#F9D857] rounded-full flex items-center justify-center mb-4 mx-auto">
                        <span className="text-white text-3xl font-bold">1</span>
                      </div>
                      <h3 className="text-center mb-3 text-[#3D4C6B]">腦海尋寶</h3>
                      <p className="text-gray-600 text-center text-sm">
                        三鏡觀察法，陪你垂釣靈感
                      </p>
                      <p className="text-gray-600 text-center text-sm mt-2">
                        發掘內心深處的寶藏故事，用系統化方法挖掘生活中的感動時刻
                      </p>
                    </CardContent>
                  </Card>

                  {/* 站點 2 */}
                  <Card className="border-2 border-[#F9D857] hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-[#F9D857] rounded-full flex items-center justify-center mb-4 mx-auto">
                        <span className="text-white text-3xl font-bold">2</span>
                      </div>
                      <h3 className="text-center mb-3 text-[#3D4C6B]">書山踏青</h3>
                      <p className="text-gray-600 text-center text-sm">
                        拆解圖文架構，推薦優質參考書單
                      </p>
                      <p className="text-gray-600 text-center text-sm mt-2">
                        學習優秀作品的寫作技巧，建立紮實的故事基礎
                      </p>
                    </CardContent>
                  </Card>

                  {/* 站點 3 */}
                  <Card className="border-2 border-[#F9D857] hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-[#F9D857] rounded-full flex items-center justify-center mb-4 mx-auto">
                        <span className="text-white text-3xl font-bold">3</span>
                      </div>
                      <h3 className="text-center mb-3 text-[#3D4C6B]">故事DIY</h3>
                      <p className="text-gray-600 text-center text-sm">
                        選一件事／一個主題
                      </p>
                      <p className="text-gray-600 text-center text-sm mt-2">
                        手把手教學，變成故事初稿，完成你的第一個創作
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Form Section */}
          <section id="cta" className="bg-gradient-to-br from-[#FFF9E6] to-white py-16 md:py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                {/* 禮物標題 */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-lg mb-4">
                    <div className="w-12 h-12 bg-[#F9D857] rounded-full flex items-center justify-center">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-[#3D4C6B] m-0">贈：故事模板／AI助理指令</h3>
                      <p className="text-sm text-gray-600 m-0">只要願意開始，就不怕卡關！</p>
                    </div>
                  </div>
                </div>

                <Card className="shadow-2xl border-0 bg-white">
                  <CardContent className="p-8">
                    <h2 className="text-center mb-4 text-[#F9A825]">限時免費 體驗席</h2>
                    <p className="text-center text-gray-600 mb-8">
                      留下資料，我們將<span className="font-bold">立即</span>寄送「故事模板」與「AI助理指令」給您！
                    </p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-[#5A9A9E]">你的姓名：</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="請輸入姓名"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="border-2 border-gray-300 focus:border-[#5A9A9E] focus:ring-[#5A9A9E] rounded-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[#5A9A9E]">你的Email：</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="請輸入Email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="border-2 border-gray-300 focus:border-[#5A9A9E] focus:ring-[#5A9A9E] rounded-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-[#5A9A9E]">你的手機：</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="選填：09XX-XXX-XXX"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="border-2 border-gray-300 focus:border-[#5A9A9E] focus:ring-[#5A9A9E] rounded-lg"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-[#5FAD56] hover:bg-[#4F9D46] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 py-6 rounded-full"
                        disabled={isSubmitting}
                      >
                        <Sparkles className="mr-2 h-5 w-5" />
                        {isSubmitting ? '處理中...' : '立刻領取創作秘笈！'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-[#3D4C6B] text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-300">&copy; 2023 觀光列車創作號. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

