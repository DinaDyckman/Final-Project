import { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'en' | 'he'

interface LanguageContextType {
  language: Language
  toggleLanguage: () => void
  t: (key: string) => string
}

const translations = {
  en: {
    luxuryRentals: 'LUXURY RENTALS',
    experiencePremium: 'Experience premium quality at your convenience',
    exploreCollection: 'Explore Collection',
    signIn: 'Sign In',
    products: 'Products',
    inspirationGallery: 'Inspiration Gallery',
    ourServices: 'Our Services',
    premiumSelection: 'Premium Selection',
    curatedCollection: 'Curated collection of high-end products',
    flexibleTerms: 'Flexible Terms',
    rentAsLong: 'Rent for as long as you need',
    trustedService: 'Trusted Service',
    professionalSupport: 'Professional and reliable support',
    ourCollection: 'OUR COLLECTION',
    browsePremium: 'Browse our premium selection',
    reserveNow: 'Reserve Now',
    createAccount: 'CREATE ACCOUNT',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    password: 'Password',
    alreadyAccount: 'Already have an account?',
    newCustomer: 'New customer?',
    createAnAccount: 'Create an account',
    perDay: '/day'
  },
  he: {
    luxuryRentals: 'השכרה יוקרתית',
    experiencePremium: 'חוו איכות פרימיום בנוחות שלכם',
    exploreCollection: 'גלו את הקולקציה',
    signIn: 'התחברות',
    products: 'מוצרים',
    inspirationGallery: 'גלריית השראה',
    ourServices: 'השירותים שלנו',
    premiumSelection: 'מבחר פרימיום',
    curatedCollection: 'אוסף מוקפד של מוצרים יוקרתיים',
    flexibleTerms: 'תנאים גמישים',
    rentAsLong: 'השכירו לכל פרק זמן שתרצו',
    trustedService: 'שירות אמין',
    professionalSupport: 'תמיכה מקצועית ואמינה',
    ourCollection: 'הקולקציה שלנו',
    browsePremium: 'עיינו במבחר הפרימיום שלנו',
    reserveNow: 'הזמינו עכשיו',
    createAccount: 'יצירת חשבון',
    fullName: 'שם מלא',
    emailAddress: 'כתובת אימייל',
    password: 'סיסמה',
    alreadyAccount: 'כבר יש לך חשבון?',
    newCustomer: 'לקוח חדש?',
    createAnAccount: 'צור חשבון',
    perDay: '/יום'
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'he' : 'en')
    document.dir = language === 'en' ? 'rtl' : 'ltr'
  }

  const t = (key: string) => translations[language][key as keyof typeof translations.en] || key

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
