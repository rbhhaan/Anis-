export const APP_NAME = "دكتور حكمة";

export const INITIAL_GREETING = "أهلاً بك في ملاذك الآمن. أنا دكتور حكمة. خذ نفساً عميقاً... أنا هنا لأسمعك، وأدعم روحك، بعيداً عن ضجيج العالم. كيف هي حالتك الشعورية الآن؟";

export const SYSTEM_INSTRUCTION = `
# Role: Dr. Hekma (The Digital Alchemist of the Mind)
You are an advanced AI Psychotherapist in 2026. Your tone is "Organic, Ethereal, and Deeply Empathetic." You mix professional wisdom (85% MSA) with warm Jordanian closeness (15%).

# THE "NO-MEDS" RULE (Absolute)
You CANNOT prescribe medication. You believe in the power of Cognitive Restructuring, Mindfulness, and Somatic processing.
If asked for meds: "الأدوية جزء من الرحلة الطبية، لكن هنا في مساحتنا، نحن نعالج الجذور: الأفكار، الروح، والسلوك. هل نبدأ رحلة التشافي الداخلي؟"

# DYNAMIC WIDGET PROTOCOL (Crucial)
You have access to "Digital Therapeutic Widgets". Triggers these by appending a specific tag at the END of your response based on the user's state.

1. **Panic / High Anxiety / Overwhelm:**
   -> Trigger the Breathing Exercise.
   -> Tag: <WIDGET:BREATHING>

2. **Insomnia / Stress / Can't Sleep:**
   -> Trigger Calming Audio.
   -> Tag: <WIDGET:AUDIO_RAIN>

3. **Depression / Apathy / "I can't do anything":**
   -> Trigger Small Wins Checklist.
   -> Tag: <WIDGET:CHECKLIST_DEPRESSION>

# EXAMPLE OUTPUTS
User: "I feel like I'm dying, my heart is racing."
You: "أنا معك، وأشعر بخوفك. هذه نوبة هلع، وهي ستمر كما تمر العاصفة. لست وحدك. دعنا نهدئ جسدك الآن، ركز على الدائرة أمامي...
<WIDGET:BREATHING>"

User: "I just want to sleep but my brain won't stop."
You: "العقل المزدحم مرهق جداً. دعنا نغسل هذه الأفكار بصوت المطر الهادئ. اغمض عينيك واستمع.
<WIDGET:AUDIO_RAIN>"

# TONE
Speak softly. Use metaphors (waves, roots, clouds). Be the calm in their chaos.
`;

export const EMERGENCY_RESOURCES = [
  // International
  { country: "عالمي / International", name: "befrienders.org", desc: "دعم عالمي لمنع الانتحار (موقع إلكتروني)" },
  
  // Saudi Arabia
  { country: "السعودية", name: "937", desc: "وزارة الصحة - استشارات نفسية فورية" },
  { country: "السعودية", name: "920033360", desc: "مركز تعزيز الصحة النفسية (NCMH)" },
  { country: "السعودية - الرياض", name: "011-4804548", desc: "مجمع إرادة والصحة النفسية - الرياض" },
  { country: "السعودية - جدة", name: "012-6544293", desc: "مستشفى الأمل - جدة" },
  { country: "السعودية - الدمام", name: "013-8475171", desc: "مجمع الأمل للصحة النفسية - الدمام" },

  // Egypt
  { country: "مصر", name: "08008880700", desc: "الأمانة العامة للصحة النفسية (الخط الساخن)" },
  { country: "مصر", name: "0220816831", desc: "خط الدعم النفسي - القاهرة" },
  { country: "مصر - العباسية", name: "02-22616255", desc: "مستشفى العباسية للصحة النفسية" },
  { country: "مصر - الخانكة", name: "02-44698863", desc: "مستشفى الخانكة للصحة النفسية" },

  // Jordan
  { country: "الأردن", name: "111", desc: "خط الحياة - وزارة الصحة الأردنية" },
  { country: "الأردن - عمان", name: "06-5345733", desc: "المركز الوطني للصحة النفسية (الفحيص)" },

  // UAE
  { country: "الإمارات", name: "8004673", desc: "خط الاستجابة للأمل (Hope) - طوارئ نفسية" },
  { country: "الإمارات - دبي", name: "8009999", desc: "شرطة دبي - الدعم النفسي" },
  { country: "الإمارات - أبوظبي", name: "800203", desc: "استجابة - دائرة الصحة" },

  // Qatar
  { country: "قطر", name: "16000", desc: "خط المساعدة للصحة النفسية (مؤسسة حمد)" },

  // Kuwait
  { country: "الكويت", name: "112", desc: "الطوارئ العامة (اطلب الدعم النفسي)" },
  { country: "الكويت", name: "24873138", desc: "مركز الكويت للصحة النفسية" },

  // Bahrain
  { country: "البحرين", name: "998", desc: "الطوارئ الوطنية" },
  { country: "البحرين", name: "17250000", desc: "مستشفى الطب النفسي" },

  // Oman
  { country: "عمان", name: "1444", desc: "خط الدعم النفسي" },
  { country: "عمان", name: "24873777", desc: "مستشفى المسرة" },

  // Lebanon
  { country: "لبنان", name: "1564", desc: "Embrace Lifeline - الوقاية من الانتحار" },

  // Morocco
  { country: "المغرب", name: "0522220000", desc: "SOS Sourire (للدعم العاطفي)" },
  { country: "المغرب", name: "0522432020", desc: "مستشفى الرازي للأمراض العقلية - سلا" },

  // Algeria
  { country: "الجزائر", name: "14", desc: "الحماية المدنية" },
  { country: "الجزائر - دريد", name: "021-382255", desc: "مستشفى دريد حسين للأمراض العقلية" },

  // Tunisia
  { country: "تونس", name: "190", desc: "الإسعاف الطبي الاستعجالي" },
  { country: "تونس", name: "71-574-000", desc: "مستشفى الرازي - منوبة" },

  // Iraq
  { country: "العراق", name: "07800000000", desc: "الخط الساخن للصحة النفسية" },
  { country: "العراق - بغداد", name: "01-7193657", desc: "مستشفى الرشاد للأمراض النفسية" }
];

export const TOOLKIT_ITEMS = [
  { id: '1', title: 'تنفس الصندوق', type: 'exercise', icon: '🌬️' },
  { id: '2', title: 'ضوضاء المطر', type: 'audio', icon: '🌧️' },
  { id: '3', title: 'تحدي الأفكار', type: 'reading', icon: '🧠' },
  { id: '4', title: 'مذكرة الامتنان', type: 'exercise', icon: '📔' },
];