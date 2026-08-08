import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, KeyRound, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getAdminState, saveAdminState, addSecurityLog } from '../services/storage';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@sharif.edu');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [errorMsg, setErrorMsg] = useState('');
  const [lockoutTimer, setLockoutTimer] = useState<number | null>(null);

  const adminState = getAdminState();

  // Check if locked out
  useEffect(() => {
    if (adminState.lockoutUntil && adminState.lockoutUntil > Date.now()) {
      const remainingSeconds = Math.ceil((adminState.lockoutUntil - Date.now()) / 1000);
      setLockoutTimer(remainingSeconds);
    }
  }, [adminState.lockoutUntil]);

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutTimer !== null && lockoutTimer > 0) {
      const timer = setInterval(() => {
        setLockoutTimer((prev) => (prev && prev > 1 ? prev - 1 : null));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutTimer]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Check lockout
    if (lockoutTimer !== null && lockoutTimer > 0) {
      setErrorMsg(`حساب کاربری موقتاً مسدود است. لطفاً ${lockoutTimer} ثانیه صبر کنید.`);
      return;
    }

    // Password check: check customPassword if set, or defaults ("sharif2026", "admin123", "admin")
    const validPassword = adminState.customPassword
      ? password === adminState.customPassword
      : (password === 'sharif2026' || password === 'admin123' || password === 'admin');

    if ((email === 'admin@sharif.edu' || email === 'admin') && validPassword) {
      // Reset failed attempts
      const updatedState = {
        ...adminState,
        failedAttempts: 0,
        lockoutUntil: null
      };
      saveAdminState(updatedState);

      if (adminState.requires2FA) {
        setStep('2fa');
        setErrorMsg('');
        addSecurityLog({
          action: 'مرحله اول احراز هویت ادمین',
          status: 'موفق',
          details: 'ورود نام کاربری و رمز عبور معتبر. انتقال به مرحله کد دو عاملی.'
        });
      } else {
        // Log in directly
        updatedState.isLoggedIn = true;
        saveAdminState(updatedState);

        addSecurityLog({
          action: 'ورود موفقیت‌آمیز ادمین',
          status: 'موفق',
          details: 'احراز هویت کامل و ورود به پنل مدیریت محتوا.'
        });

        navigate('/admin/dashboard');
      }
    } else {
      // Increment failed attempts
      const newFailed = adminState.failedAttempts + 1;
      let newLockout: number | null = null;

      if (newFailed >= 5) {
        newLockout = Date.now() + 5 * 60 * 1000; // 5 min lockout
        setLockoutTimer(300);
      }

      saveAdminState({
        ...adminState,
        failedAttempts: newFailed,
        lockoutUntil: newLockout
      });

      addSecurityLog({
        action: 'تلاش ناموفق برای ورود به پنل ادمین',
        status: 'هشدار',
        details: `تلاش ناموفق شماره ${newFailed} با ایمیل ${email}.`
      });

      if (newFailed >= 5) {
        setErrorMsg('تعداد تلاش‌های ناموفق بیش از حد مجاز (۵ بار) بود. دسترسی برای ۵ دقیقه مسدود گردید.');
      } else {
        setErrorMsg(`نام کاربری یا رمز عبور اشتباه است. (تلاش ${newFailed} از ۵)`);
      }
    }
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCode === '123456' || twoFactorCode.length === 6) {
      saveAdminState({
        ...adminState,
        isLoggedIn: true,
        is2FAVerified: true
      });

      addSecurityLog({
        action: 'تایید کد دو عاملی 2FA',
        status: 'موفق',
        details: 'احراز هویت دو مرحله‌ای با موفقیت انجام شد.'
      });

      navigate('/admin/dashboard');
    } else {
      setErrorMsg('کد ۲ عاملی واردشده نامعتبر است. (کد تست: 123456)');
    }
  };

  return (
    <div className="pt-28 min-h-screen pb-20 max-w-md mx-auto px-4 flex flex-col justify-center">
      
      <div className="bg-[#141416] border border-[#28282D] rounded-3xl p-8 sm:p-10 space-y-8 shadow-2xl relative">
        
        {/* Header Icon */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#E8530D]/10 border border-[#E8530D]/30 text-[#E8530D] flex items-center justify-center mx-auto shadow-lg shadow-[#E8530D]/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-white">
            ورود ایمن مدیران سیستم
          </h1>
          <p className="text-xs text-[#A0A0A0]">
            درگاه اختصاصی سیستم مدیریت محتوا (CMS) دانشکده مکانیک شریف
          </p>
        </div>

        {/* Security Alert Banner */}
        <div className="bg-[#1B1B1E] border border-[#28282D] p-3.5 rounded-2xl text-[11px] text-[#A0A0A0] flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-[#E8530D] shrink-0" />
          <span>تمام فعالیت‌ها و تلاش‌های ورود به این پنل ثبت امنیتی (Security Log) می‌شوند.</span>
        </div>

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl text-xs text-rose-400 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {lockoutTimer !== null && lockoutTimer > 0 && (
          <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl text-xs text-orange-400 text-center font-bold">
            حساب کاربری به علت ۵ تلاش ناموفق مسدود شد. زمان باقیمانده: {lockoutTimer} ثانیه
          </div>
        )}

        {step === 'credentials' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs text-[#A0A0A0] font-medium block">ایمیل یا شناسه ادمین</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A0A0A0] absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sharif.edu"
                  className="w-full bg-[#1B1B1E] border border-[#28282D] text-white text-xs sm:text-sm rounded-xl pr-10 pl-4 py-3 focus:outline-none focus:border-[#E8530D] transition-colors text-left dir-ltr"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-[#A0A0A0] font-medium block">رمز عبور اختصاصی</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#A0A0A0] absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1B1B1E] border border-[#28282D] text-white text-xs sm:text-sm rounded-xl pr-10 pl-4 py-3 focus:outline-none focus:border-[#E8530D] transition-colors text-left dir-ltr"
                />
              </div>
              <span className="text-[10px] text-[#A0A0A0] block pt-1">
                {adminState.customPassword ? (
                  <span className="text-emerald-400 font-medium">رمز عبور اختصاصی تعریف شده است.</span>
                ) : (
                  <>رمزپیش‌فرض آزمایشی: <strong className="text-white">sharif2026</strong></>
                )}
              </span>
            </div>

            <button
              type="submit"
              disabled={lockoutTimer !== null && lockoutTimer > 0}
              className="w-full bg-[#E8530D] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#F8631D] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#E8530D]/20 disabled:opacity-50"
            >
              <span>ورود به پنل مدیریت</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </form>
        ) : (
          <form onSubmit={handle2FASubmit} className="space-y-5">
            <div className="space-y-1.5 text-center">
              <span className="text-xs text-[#E8530D] font-bold block">احراز هویت دو مرحله‌ای (2FA)</span>
              <p className="text-xs text-[#A0A0A0]">کد ۶ رقمی ارسال‌شده به اپلیکیشن یا ایمیل را وارد فرمایید:</p>
            </div>

            <input
              type="text"
              maxLength={6}
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              placeholder="123456"
              className="w-full bg-[#1B1B1E] border border-[#E8530D] text-white text-center font-mono text-xl tracking-widest rounded-xl py-3 focus:outline-none"
            />
            <span className="text-[10px] text-[#A0A0A0] block text-center">کد تست: 123456</span>

            <button
              type="submit"
              className="w-full bg-[#E8530D] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#F8631D] transition-all"
            >
              تایید و احراز هویت
            </button>
          </form>
        )}

      </div>

    </div>
  );
};
