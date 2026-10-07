// El Gouna Film Festival Photo Booth — Translation System

import type { Language } from '../types';

export const translations = {
  ar: {
    // Welcome Screen
    welcome: {
      festivalName: 'مهرجان الجونة السينمائي',
      tagline: 'كن نجم الملصق',
      subtitle: 'اختر أحد أفلامنا الكلاسيكية وشاهد نفسك بطلاً للرواية',
      startButton: 'ابدأ التجربة',
      selectLanguage: 'اختر اللغة',
    },
    // Poster Selection
    posterSelection: {
      title: 'اختر ملصقك',
      subtitle: 'اختر من مجموعتنا من الأفلام المصرية الكلاسيكية',
      categories: {
        all: 'الكل',
        drama: 'دراما',
        comedy: 'كوميديا',
        action: 'أكشن',
        romance: 'رومانسي',
      },
      backButton: 'رجوع',
      step: 'الخطوة',
      of: 'من',
    },
    // Poster Confirm
    posterConfirm: {
      title: 'ملصقك المختار',
      changeButton: 'تغيير الملصق',
      continueButton: 'متابعة',
      selectedLabel: 'الفيلم المختار:',
    },
    // Camera
    camera: {
      title: 'التقط صورتك',
      subtitle: 'ضع وجهك في الإطار والتقط صورتك',
      captureButton: 'التقاط',
      retakeButton: 'إعادة التقاط',
      continueButton: 'متابعة',
      backButton: 'رجوع',
      errorDenied: 'تم رفض إذن الكاميرا. يرجى السماح بالوصول للكاميرا',
      errorUnavailable: 'الكاميرا غير متاحة',
      errorGeneric: 'حدث خطأ في الكاميرا',
      countdown: 'التقاط الصورة في...',
      position: 'ضع وجهك هنا',
    },
    // Generating
    generating: {
      title: 'جاري الإنشاء...',
      subtitle: 'الذكاء الاصطناعي يضعك في ملصق الفيلم',
      steps: [
        'تحليل صورتك...',
        'دمج الملصق...',
        'إضافة اللمسات الفنية...',
        'الانتهاء من التحفة الفنية...',
      ],
    },
    // Result
    result: {
      title: 'تحفتك الفنية!',
      subtitle: 'أنت الآن نجم الفيلم',
      regenerateButton: 'إعادة الإنشاء',
      editButton: 'تعديل الصورة',
      continueButton: 'احصل على صورتك',
      backButton: 'رجوع',
    },
    // Edit
    edit: {
      title: 'تعديل صورتك',
      filters: {
        original: 'أصلي',
        warm: 'دافئ',
        bw: 'أبيض وأسود',
        cinematic: 'سينمائي',
        bright: 'مضيء',
      },
      saveButton: 'حفظ التعديلات',
      cancelButton: 'إلغاء',
    },
    // QR Screen
    qr: {
      title: 'جاهز!',
      subtitle: 'امسح الـ QR واحفظ صورتك',
      instruction: 'وجّه كاميرا هاتفك نحو رمز الاستجابة السريعة',
      newExperience: 'تجربة جديدة',
      downloading: 'التحميل...',
    },
    // Errors
    errors: {
      generationFailed: 'فشل إنشاء الصورة. يرجى المحاولة مرة أخرى',
      uploadFailed: 'فشل رفع الصورة. يرجى المحاولة مرة أخرى',
      networkError: 'خطأ في الشبكة. يرجى التحقق من الاتصال',
      unknownError: 'حدث خطأ غير متوقع',
    },
    // Progress
    progress: {
      step1: 'اختيار الملصق',
      step2: 'التقاط الصورة',
      step3: 'إنشاء الصورة',
      step4: 'احفظ نتيجتك',
    },
  },
  en: {
    // Welcome Screen
    welcome: {
      festivalName: 'El Gouna Film Festival',
      tagline: 'Become the Poster Star',
      subtitle: 'Choose a classic Egyptian film and see yourself as the hero',
      startButton: 'Start Experience',
      selectLanguage: 'Select Language',
    },
    // Poster Selection
    posterSelection: {
      title: 'Choose Your Poster',
      subtitle: 'Select from our collection of classic Egyptian films',
      categories: {
        all: 'All',
        drama: 'Drama',
        comedy: 'Comedy',
        action: 'Action',
        romance: 'Romance',
      },
      backButton: 'Back',
      step: 'Step',
      of: 'of',
    },
    // Poster Confirm
    posterConfirm: {
      title: 'Your Selected Poster',
      changeButton: 'Change Poster',
      continueButton: 'Continue',
      selectedLabel: 'Selected Film:',
    },
    // Camera
    camera: {
      title: 'Take Your Photo',
      subtitle: 'Position your face in the frame and capture your photo',
      captureButton: 'Capture',
      retakeButton: 'Retake',
      continueButton: 'Continue',
      backButton: 'Back',
      errorDenied: 'Camera permission denied. Please allow camera access',
      errorUnavailable: 'Camera unavailable',
      errorGeneric: 'Camera error occurred',
      countdown: 'Taking photo in...',
      position: 'Place your face here',
    },
    // Generating
    generating: {
      title: 'Creating...',
      subtitle: 'AI is placing you into the movie poster',
      steps: [
        'Analyzing your photo...',
        'Merging with poster...',
        'Adding artistic touches...',
        'Finalizing your masterpiece...',
      ],
    },
    // Result
    result: {
      title: 'Your Masterpiece!',
      subtitle: 'You are now the movie star',
      regenerateButton: 'Regenerate',
      editButton: 'Edit Photo',
      continueButton: 'Get My Photo',
      backButton: 'Back',
    },
    // Edit
    edit: {
      title: 'Edit Your Photo',
      filters: {
        original: 'Original',
        warm: 'Warm',
        bw: 'Black & White',
        cinematic: 'Cinematic',
        bright: 'Bright',
      },
      saveButton: 'Save Edits',
      cancelButton: 'Cancel',
    },
    // QR Screen
    qr: {
      title: 'Ready!',
      subtitle: 'Scan the QR code to save your photo',
      instruction: 'Point your phone camera at the QR code',
      newExperience: 'New Experience',
      downloading: 'Downloading...',
    },
    // Errors
    errors: {
      generationFailed: 'Image generation failed. Please try again',
      uploadFailed: 'Image upload failed. Please try again',
      networkError: 'Network error. Please check your connection',
      unknownError: 'An unexpected error occurred',
    },
    // Progress
    progress: {
      step1: 'Choose Poster',
      step2: 'Take Photo',
      step3: 'Generate Image',
      step4: 'Save Result',
    },
  },
} as const;

export type TranslationKey = typeof translations;

export function t(lang: Language, path: string): string {
  const keys = path.split('.');
  let current: any = translations[lang];
  for (const key of keys) {
    if (current === undefined) return path;
    current = current[key];
  }
  return typeof current === 'string' ? current : path;
}
