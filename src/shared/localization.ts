/**
 * Localization Service Utility & Academic Arabic Content Translation Engine
 * MIT OpenCourseWare Arabic, King Abdulaziz University, & Regional Academic Standards
 */
import { LanguageCode, Course, Module, Lesson, QuizQuestion, Flashcard } from './types';

export const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    welcome: "Welcome",
    dashboard: "Hub Overview",
    hub: "Hub",
    courses: "Courses & Training",
    degrees: "Degree Programs",
    knowledge_base: "Knowledge Drive",
    analytics: "Learning Analytics",
    planner: "Weekly Schedule",
    social_forums: "Social Forums & Q&A",
    leaderboard: "Leaderboard & Points",
    study_rooms: "Study Rooms & Voice",
    achievements: "Badges & Certificates",
    teacher_dashboard: "Teacher & Faculty Studio",
    api_engine: "Developer API Engine",
    admin_portal: "Admin Portal & IAM",
    settings: "Platform Settings",
    about: "About Project",
    donate: "Documentation",
    quick_study: "Quick Study",
    synced: "Synced",
    syncing: "Syncing...",
    search_placeholder: "Search degree catalog, courses, research docs...",
    more_suite: "More Suite",
    view_profile: "View Profile & Scholar Level",
    privacy_terms: "Privacy & Terms",
    legal: "Legal",
    all_categories: "All Categories",
    all_levels: "All Levels",
    search: "Search",
    filter: "Filter",
    enrolled: "Enrolled",
    completed: "Completed",
    in_progress: "In Progress",
    not_started: "Not Started",
    start_course: "Start Learning",
    continue_course: "Continue Learning",
    view_details: "View Syllabus & Degree Path",
    modules_count: "Modules",
    lessons_count: "Lessons",
    duration: "Estimated Duration",
    hours: "Hours",
    minutes: "Minutes",
    level: "Academic Level",
    rating: "Rating",
    instructor: "Faculty / Instructor",
    curriculum: "Academic Curriculum",
    learning_outcomes: "Learning Competencies",
    capstone: "Capstone Project",
    quizzes: "Interactive Quizzes",
    flashcards: "Smart Flashcards",
    ai_tutor: "Socratic AI Tutor",
    generate_summary: "AI Lesson Summary",
    export_notes: "Export Notes",
    share_progress: "Share Credential",
    streak_days: "Days Streak",
    total_xp: "Total XP Points",
    scholar_level: "Scholar Level",
    daily_goal: "Daily Study Goal",
    daily_goal_desc: "Track daily progress towards mastery",
    discovery_feed: "AI Academic Discovery Feed",
    knowledge_gaps: "Active Knowledge Gaps",
    recommended_for_you: "Recommended For You",
    weekly_summary: "Weekly Learning Summary",
    challenge_arena: "Challenge Arena",
    recent_activity: "Recent Activity",
    upcoming_deadlines: "Upcoming Deadlines",
    enrolled_courses: "My Enrolled Courses",
    degree_catalog: "Accredited Academic Degrees",
    degree_catalog_desc: "Rigorous university-grade curricula in Autonomous Systems, AI, and Quantum Computing.",
    language: "Language",
    theme: "Theme",
    dark_theme: "True Black Theme",
    light_theme: "High-Contrast Light Theme",
    voice_assistant: "Voice Assistant",
    speech_rate: "Speech Rate",
    pitch: "Voice Pitch",
    save_settings: "Save Settings",
    saved_successfully: "Settings saved successfully",
    close: "Close",
    cancel: "Cancel",
    confirm: "Confirm",
    back_to_dashboard: "Back to Dashboard",
    next_lesson: "Next Lesson",
    previous_lesson: "Previous Lesson",
    mark_as_completed: "Mark as Completed",
    take_quiz: "Start Diagnostic Quiz",
    submit_quiz: "Submit Answers",
    quiz_results: "Quiz Results",
    correct: "Correct",
    incorrect: "Incorrect",
    score: "Score",
    explanation: "Explanation",
    try_again: "Try Again",
    key_takeaways: "Key Takeaways",
  },
  ar: {
    welcome: "أهلاً بك",
    dashboard: "الرئيسية الأكاديمية",
    hub: "الرئيسية",
    courses: "المساقات والدورات التدريبية",
    degrees: "البرامج الأكاديمية والدرجات",
    knowledge_base: "مكتبة المعرفة والملفات",
    analytics: "تحليلات التعلم والأداء",
    planner: "الجدول والخطط الأسبوعية",
    social_forums: "المجتمع الأكاديمي والمنتديات",
    leaderboard: "لوحة الصدارة والترتيب",
    study_rooms: "غرف الدراسة والمحادثة الصوتية",
    achievements: "الأوسمة والشهادات المعتمدة",
    teacher_dashboard: "استوديو الهيئة التدريسية",
    api_engine: "محرك المطورين والربط البرمجي",
    admin_portal: "بوابة الإدارة والصلاحيات",
    settings: "إعدادات المنصة",
    about: "عن المشروع والمنظومة",
    donate: "التوثيق والدليل الأكاديمي",
    quick_study: "دراسة مكثفة وسريعة",
    synced: "مُتزامن مع السحابة",
    syncing: "جاري التزامن...",
    search_placeholder: "ابحث في الكتالوج الأكاديمي، المساقات، والأبحاث...",
    more_suite: "المزيد من الخدمات",
    view_profile: "عرض الملف الشخصي والمستوى الأكاديمي",
    privacy_terms: "الخصوصية والشروط",
    legal: "الشؤون القانونية",
    all_categories: "جميع التخصصات",
    all_levels: "كافة المستويات",
    search: "بحث",
    filter: "تصفية",
    enrolled: "مسجل بالمساق",
    completed: "مكتمل بنجاح",
    in_progress: "قيد الدراسة",
    not_started: "لم يبدأ بعد",
    start_course: "ابدأ التعلم الآن",
    continue_course: "متابعة الدراسة",
    view_details: "عرض الخطة الدراسية والمنهج",
    modules_count: "الوحدات الدراسية",
    lessons_count: "الدروس التعليمية",
    duration: "المدة الزمنية التقديرية",
    hours: "ساعات",
    minutes: "دقائق",
    level: "المستوى الأكاديمي",
    rating: "التقييم الأكاديمي",
    instructor: "المحاضر / الهيئة الأكاديمية",
    curriculum: "المنهج والمحتوى الدراسي",
    learning_outcomes: "المخرجات والكفاءات التعليمية",
    capstone: "مشروع التخرج العملي",
    quizzes: "الاختبارات التفاعلية والتقييم",
    flashcards: "بطاقات الاستذكار السريعة",
    ai_tutor: "المعلم السقراطي الذكي",
    generate_summary: "ملخص الدرس بالذكاء الاصطناعي",
    export_notes: "تصدير الملاحظات الدراسية",
    share_progress: "مشاركة الشهادة والتقدم",
    streak_days: "أيام متتالية من التعلم",
    total_xp: "إجمالي نقاط الخبرة (XP)",
    scholar_level: "المستوى الأكاديمي",
    daily_goal: "الهدف الدراسي اليومي",
    daily_goal_desc: "تتبع التقدم اليومي نحو الإتقان المعرفي",
    discovery_feed: "خلاصة الاستكشاف الأكاديمي الذكية",
    knowledge_gaps: "الفجوات المعرفية النشطة",
    recommended_for_you: "مساقات مقترحة لك خصيصاً",
    weekly_summary: "ملخص التعلم والنمو الأسبوعي",
    challenge_arena: "ساحة التحديات الأكاديمية",
    recent_activity: "النشاط الأخير ومتابعة الدروس",
    upcoming_deadlines: "المواعيد والمهام القادمة",
    enrolled_courses: "المساقات المسجل بها",
    degree_catalog: "دليل البرامج والدرجات الأكاديمية",
    degree_catalog_desc: "مناهج جامعية معتمدة ومتقدمة في الأنظمة الذكية، هندسة الذكاء الاصطناعي، والحوسبة الكمية.",
    language: "اللغة",
    theme: "المظهر",
    dark_theme: "المظهر الليلي (الأسود الحالك مع لمسات زرقاء)",
    light_theme: "المظهر النهاري (عالي التباين والوضوح)",
    voice_assistant: "المساعد الصوتي الأكاديمي",
    speech_rate: "سرعة النطق",
    pitch: "طبقة الصوت",
    save_settings: "حفظ الإعدادات",
    saved_successfully: "تم حفظ الإعدادات بنجاح",
    close: "إغلاق",
    cancel: "إلغاء",
    confirm: "تأكيد",
    back_to_dashboard: "العودة إلى لوحة التحكم",
    next_lesson: "الدرس التالي",
    previous_lesson: "الدرس السابق",
    mark_as_completed: "تحديد كمكتمل",
    take_quiz: "بدء الاختبار التشخيصي",
    submit_quiz: "إرسال الإجابات",
    quiz_results: "نتائج الاختبار",
    correct: "إجابة صحيحة",
    incorrect: "إجابة غير صحيحة",
    score: "الدرجة المستحقة",
    explanation: "التفسير العلمي والشرح",
    try_again: "إعادة المحاولة",
    key_takeaways: "أهم النقاط والمكتسبات التعليمية",
  },
  es: {
    welcome: "Bienvenido",
    dashboard: "Panel Principal",
    hub: "Inicio",
    courses: "Cursos y Capacitación",
    degrees: "Programas Académicos",
    knowledge_base: "Unidad de Conocimiento",
    analytics: "Análisis de Aprendizaje",
    planner: "Plan Semanal",
    social_forums: "Foros Académicos y Preguntas",
    leaderboard: "Clasificación y Puntos",
    study_rooms: "Salas de Estudio y Voz",
    achievements: "Insignias y Certificados",
    teacher_dashboard: "Estudio de Profesores",
    api_engine: "Motor API para Desarrolladores",
    admin_portal: "Portal de Administración",
    settings: "Configuración de Plataforma",
    about: "Acerca del Proyecto",
    donate: "Documentación",
    quick_study: "Estudio Rápido",
    synced: "Sincronizado",
    syncing: "Sincronizando...",
    search_placeholder: "Buscar en el catálogo académico, cursos...",
    more_suite: "Más Servicios",
    view_profile: "Ver Perfil y Nivel",
    privacy_terms: "Privacidad y Términos",
    legal: "Legal",
    all_categories: "Todas las categorías",
    all_levels: "Todos los niveles",
    search: "Buscar",
    filter: "Filtrar",
    enrolled: "Inscrito",
    completed: "Completado",
    in_progress: "En Progreso",
    not_started: "No Iniciado",
    start_course: "Comenzar a Aprender",
    continue_course: "Continuar Aprendiendo",
    view_details: "Ver Plan de Estudios",
    modules_count: "Módulos",
    lessons_count: "Lecciones",
    duration: "Duración Estimada",
    hours: "Horas",
    minutes: "Minutos",
    level: "Nivel Académico",
    rating: "Calificación",
    instructor: "Profesor / Facultad",
    curriculum: "Plan de Estudios",
    learning_outcomes: "Competencias de Aprendizaje",
    capstone: "Proyecto Final",
    quizzes: "Cuestionarios Interactivos",
    flashcards: "Tarjetas de Memoria",
    ai_tutor: "Tutor Socrático IA",
    generate_summary: "Resumen IA",
    export_notes: "Exportar Notas",
    share_progress: "Compartir Credential",
    streak_days: "Días de Racha",
    total_xp: "Puntos XP Totales",
    scholar_level: "Nivel Académico",
    daily_goal: "Meta Diaria de Estudio",
    daily_goal_desc: "Sigue el progreso diario hacia el dominio",
    discovery_feed: "Feed de Descubrimiento IA",
    knowledge_gaps: "Brechas de Conocimiento",
    recommended_for_you: "Recomendado para ti",
    weekly_summary: "Resumen Semanal",
    challenge_arena: "Arena de Desafíos",
    recent_activity: "Actividad Reciente",
    upcoming_deadlines: "Próximas Fechas Límite",
    enrolled_courses: "Mis Cursos Inscritos",
    degree_catalog: "Catálogo de Grados Académicos",
    degree_catalog_desc: "Currículos rigurosos de nivel universitario.",
    language: "Idioma",
    theme: "Tema",
    dark_theme: "Tema Oscuro Puro",
    light_theme: "Tema Claro de Alto Contraste",
    voice_assistant: "Asistente de Voz",
    speech_rate: "Velocidad de Voz",
    pitch: "Tono de Voz",
    save_settings: "Guardar Configuración",
    saved_successfully: "Configuración guardada",
    close: "Cerrar",
    cancel: "Cancelar",
    confirm: "Confirmar",
    back_to_dashboard: "Volver al Panel",
    next_lesson: "Siguiente Lección",
    previous_lesson: "Lección Anterior",
    mark_as_completed: "Marcar como Completado",
    take_quiz: "Iniciar Cuestionario",
    submit_quiz: "Enviar Respuestas",
    quiz_results: "Resultados",
    correct: "Correcto",
    incorrect: "Incorrecto",
    score: "Puntuación",
    explanation: "Explicación",
    try_again: "Intentar de Nuevo",
    key_takeaways: "Conclusiones Clave",
  },
  fr: {
    welcome: "Bienvenue",
    dashboard: "Tableau de Bord",
    hub: "Accueil",
    courses: "Cours & Formations",
    degrees: "Programmes Académiques",
    knowledge_base: "Base de Connaissances",
    analytics: "Analytique d'Apprentissage",
    planner: "Planning Hebdomadaire",
    social_forums: "Forums & Questions",
    leaderboard: "Classement & Points",
    study_rooms: "Salles d'Étude & Vocal",
    achievements: "Badges & Certificats",
    teacher_dashboard: "Studio Enseignants",
    api_engine: "Moteur API Développeur",
    admin_portal: "Portail d'Administration",
    settings: "Paramètres de Plateforme",
    about: "À Propos",
    donate: "Documentation",
    quick_study: "Étude Rapide",
    synced: "Synchronisé",
    syncing: "Synchronisation...",
    search_placeholder: "Rechercher dans le catalogue, cours...",
    more_suite: "Plus de Services",
    view_profile: "Voir Profil et Niveau",
    privacy_terms: "Confidentialité & Conditions",
    legal: "Mentions Légales",
    all_categories: "Toutes les catégories",
    all_levels: "Tous les niveaux",
    search: "Rechercher",
    filter: "Filtrer",
    enrolled: "Inscrit",
    completed: "Terminé",
    in_progress: "En Cours",
    not_started: "Non Commencé",
    start_course: "Commencer le Cours",
    continue_course: "Continuer le Cours",
    view_details: "Voir le Programme",
    modules_count: "Modules",
    lessons_count: "Leçons",
    duration: "Durée Estimée",
    hours: "Heures",
    minutes: "Minutes",
    level: "Niveau Académique",
    rating: "Évaluation",
    instructor: "Professeur / Faculté",
    curriculum: "Programme Académique",
    learning_outcomes: "Compétences Visées",
    capstone: "Projet de Synthèse",
    quizzes: "Quiz Interactifs",
    flashcards: "Cartes Mémoire",
    ai_tutor: "Tuteur IA Socratique",
    generate_summary: "Résumé IA",
    export_notes: "Exporter les Notes",
    share_progress: "Partager le Certificat",
    streak_days: "Jours Consécutifs",
    total_xp: "Points XP Totaux",
    scholar_level: "Niveau Académique",
    daily_goal: "Objectif d'Étude Quotidien",
    daily_goal_desc: "Suivi des progrès quotidiens",
    discovery_feed: "Flux de Découverte IA",
    knowledge_gaps: "Lacunes de Connaissances",
    recommended_for_you: "Recommandé pour vous",
    weekly_summary: "Résumé Hebdomadaire",
    challenge_arena: "Arène des Défis",
    recent_activity: "Activité Récente",
    upcoming_deadlines: "Échéances à Venir",
    enrolled_courses: "Mes Cours Inscrits",
    degree_catalog: "Catalogue des Diplômes",
    degree_catalog_desc: "Programmes universitaires rigoureux.",
    language: "Langue",
    theme: "Thème",
    dark_theme: "Thème Noir Pur",
    light_theme: "Thème Clair Haute Lisibilité",
    voice_assistant: "Assistant Vocal",
    speech_rate: "Vitesse Vocale",
    pitch: "Hauteur de Voix",
    save_settings: "Enregistrer",
    saved_successfully: "Paramètres enregistrés",
    close: "Fermer",
    cancel: "Annuler",
    confirm: "Confirmer",
    back_to_dashboard: "Retour au Tableau de Bord",
    next_lesson: "Leçon Suivante",
    previous_lesson: "Leçon Précédente",
    mark_as_completed: "Marquer comme Terminé",
    take_quiz: "Commencer le Quiz",
    submit_quiz: "Soumettre les Réponses",
    quiz_results: "Résultats du Quiz",
    correct: "Correct",
    incorrect: "Incorrect",
    score: "Score",
    explanation: "Explication",
    try_again: "Réessayer",
    key_takeaways: "Points Clés",
  },
  de: {
    welcome: "Willkommen",
    dashboard: "Übersicht",
    hub: "Zentrale",
    courses: "Kurse & Training",
    degrees: "Studiengänge",
    knowledge_base: "Wissensspeicher",
    analytics: "Lernanalysen",
    planner: "Wochenplaner",
    social_forums: "Foren & Diskussionen",
    leaderboard: "Bestenliste & Punkte",
    study_rooms: "Lernräume & Sprachchat",
    achievements: "Abzeichen & Zertifikate",
    teacher_dashboard: "Dozenten-Studio",
    api_engine: "Entwickler-API-Engine",
    admin_portal: "Admin-Portal",
    settings: "Plattform-Einstellungen",
    about: "Über das Projekt",
    donate: "Dokumentation",
    quick_study: "Schnellstudium",
    synced: "Synchronisiert",
    syncing: "Synchronisiere...",
    search_placeholder: "Katalog, Kurse & Dokumente durchsuchen...",
    more_suite: "Weitere Dienste",
    view_profile: "Profil & Level anzeigen",
    privacy_terms: "Datenschutz & AGB",
    legal: "Rechtliches",
    all_categories: "Alle Kategorien",
    all_levels: "Alle Stufen",
    search: "Suchen",
    filter: "Filtern",
    enrolled: "Eingeschrieben",
    completed: "Abgeschlossen",
    in_progress: "In Bearbeitung",
    not_started: "Nicht begonnen",
    start_course: "Jetzt lernen",
    continue_course: "Weiterlernen",
    view_details: "Lehrplan ansehen",
    modules_count: "Module",
    lessons_count: "Lektionen",
    duration: "Geschätzte Dauer",
    hours: "Stunden",
    minutes: "Minuten",
    level: "Akademisches Niveau",
    rating: "Bewertung",
    instructor: "Dozent / Fakultät",
    curriculum: "Curriculum",
    learning_outcomes: "Lernziele",
    capstone: "Abschlussprojekt",
    quizzes: "Interaktive Quizze",
    flashcards: "Lernkarten",
    ai_tutor: "Sokratischer KI-Tutor",
    generate_summary: "KI-Zusammenfassung",
    export_notes: "Notizen exportieren",
    share_progress: "Zertifikat teilen",
    streak_days: "Tage Serie",
    total_xp: "Gesamt-XP",
    scholar_level: "Akademisches Level",
    daily_goal: "Tägliches Lernziel",
    daily_goal_desc: "Täglichen Fortschritt verfolgen",
    discovery_feed: "KI-Entdeckungsfeed",
    knowledge_gaps: "Wissenslücken",
    recommended_for_you: "Für dich empfohlen",
    weekly_summary: "Wöchentlicher Lernbericht",
    challenge_arena: "Herausforderungs-Arena",
    recent_activity: "Letzte Aktivitäten",
    upcoming_deadlines: "Anstehende Fristen",
    enrolled_courses: "Meine Kurse",
    degree_catalog: "Akademische Studiengänge",
    degree_catalog_desc: "Universitätslehrpläne.",
    language: "Sprache",
    theme: "Design",
    dark_theme: "Echtes Schwarz-Design",
    light_theme: "Helles Kontrast-Design",
    voice_assistant: "Sprachassistent",
    speech_rate: "Sprachgeschwindigkeit",
    pitch: "Tonhöhe",
    save_settings: "Einstellungen speichern",
    saved_successfully: "Erfolgreich gespeichert",
    close: "Schließen",
    cancel: "Abbrechen",
    confirm: "Bestätigen",
    back_to_dashboard: "Zurück zur Übersicht",
    next_lesson: "Nächste Lektion",
    previous_lesson: "Vorherige Lektion",
    mark_as_completed: "Als abgeschlossen markieren",
    take_quiz: "Quiz starten",
    submit_quiz: "Antworten absenden",
    quiz_results: "Quiz-Ergebnisse",
    correct: "Richtig",
    incorrect: "Falsch",
    score: "Punktzahl",
    explanation: "Erklärung",
    try_again: "Erneut versuchen",
    key_takeaways: "Wichtigste Erkenntnisse",
  },
  ja: {
    welcome: "ようこそ",
    dashboard: "ハブ概要",
    hub: "ハブ",
    courses: "コースとトレーニング",
    degrees: "学位プログラム",
    knowledge_base: "ナレッジドライブ",
    analytics: "学習アナリティクス",
    planner: "週間スケジュール",
    social_forums: "フォーラムとQ&A",
    leaderboard: "リーダーボード",
    study_rooms: "自習室とボイス",
    achievements: "バッジと修了証",
    teacher_dashboard: "講師スタジオ",
    api_engine: "開発者APIエンジン",
    admin_portal: "管理ポータル",
    settings: "プラットフォーム設定",
    about: "プロジェクトについて",
    donate: "ドキュメント",
    quick_study: "クイック学習",
    synced: "同期完了",
    syncing: "同期中...",
    search_placeholder: "カタログ、コース、文書を検索...",
    more_suite: "その他の機能",
    view_profile: "プロフィールとレベル",
    privacy_terms: "利用規約とプライバシー",
    legal: "法的情報",
    all_categories: "すべてのカテゴリー",
    all_levels: "すべてのレベル",
    search: "検索",
    filter: "フィルター",
    enrolled: "受講中",
    completed: "修了済み",
    in_progress: "進行中",
    not_started: "未開始",
    start_course: "学習を開始",
    continue_course: "学習を続ける",
    view_details: "カリキュラムを見る",
    modules_count: "モジュール",
    lessons_count: "レッスン",
    duration: "推定時間",
    hours: "時間",
    minutes: "分",
    level: "レベル",
    rating: "評価",
    instructor: "講師",
    curriculum: "カリキュラム",
    learning_outcomes: "学習成果",
    capstone: "最終課題",
    quizzes: "クイズ",
    flashcards: "フラッシュカード",
    ai_tutor: "AIチューター",
    generate_summary: "AI要約",
    export_notes: "ノートをエクスポート",
    share_progress: "証明書を共有",
    streak_days: "連続学習日数",
    total_xp: "総XPポイント",
    scholar_level: "学術レベル",
    daily_goal: "毎日の目標",
    daily_goal_desc: "学習の進捗を追跡",
    discovery_feed: "AI発見フィード",
    knowledge_gaps: "知識ギャップ",
    recommended_for_you: "あなたへのおすすめ",
    weekly_summary: "週間サマリー",
    challenge_arena: "チャレンジアリーナ",
    recent_activity: "最近のアクティビティ",
    upcoming_deadlines: "期限が近い課題",
    enrolled_courses: "受講中のコース",
    degree_catalog: "学位プログラム一覧",
    degree_catalog_desc: "大学水準のカリキュラム。",
    language: "言語",
    theme: "テーマ",
    dark_theme: "ダークテーマ",
    light_theme: "ライトテーマ",
    voice_assistant: "音声アシスタント",
    speech_rate: "音声速度",
    pitch: "声の高さ",
    save_settings: "設定を保存",
    saved_successfully: "保存しました",
    close: "閉じる",
    cancel: "キャンセル",
    confirm: "確認",
    back_to_dashboard: "ダッシュボードに戻る",
    next_lesson: "次のレッスン",
    previous_lesson: "前のレッスン",
    mark_as_completed: "完了にする",
    take_quiz: "クイズを開始",
    submit_quiz: "回答を送信",
    quiz_results: "結果",
    correct: "正解",
    incorrect: "不正解",
    score: "スコア",
    explanation: "解説",
    try_again: "もう一度挑戦",
    key_takeaways: "重要ポイント",
  },
  zh: {
    welcome: "欢迎",
    dashboard: "中心概览",
    hub: "中心",
    courses: "课程与培训",
    degrees: "学位课程",
    knowledge_base: "知识库",
    analytics: "学习分析",
    planner: "每周计划",
    social_forums: "学术社区与问答",
    leaderboard: "排行榜",
    study_rooms: "研讨室与语音",
    achievements: "徽章与证书",
    teacher_dashboard: "教师工作坊",
    api_engine: "开发者 API 引擎",
    admin_portal: "管理门户",
    settings: "平台设置",
    about: "关于项目",
    donate: "文档指南",
    quick_study: "快速学习",
    synced: "已同步",
    syncing: "同步中...",
    search_placeholder: "搜索学位目录、课程、研究文档...",
    more_suite: "更多服务",
    view_profile: "查看个人资料与等级",
    privacy_terms: "隐私与条款",
    legal: "法律声明",
    all_categories: "所有分类",
    all_levels: "所有级别",
    search: "搜索",
    filter: "筛选",
    enrolled: "已加入",
    completed: "已完成",
    in_progress: "进行中",
    not_started: "未开始",
    start_course: "开始学习",
    continue_course: "继续学习",
    view_details: "查看大纲与学位路径",
    modules_count: "模块",
    lessons_count: "课时",
    duration: "预计时长",
    hours: "小时",
    minutes: "分钟",
    level: "学术等级",
    rating: "评分",
    instructor: "主讲教授 / 教师",
    curriculum: "学术大纲",
    learning_outcomes: "学习成果与能力",
    capstone: "毕业实践项目",
    quizzes: "互动测验",
    flashcards: "记忆卡片",
    ai_tutor: "苏格拉底式 AI 导师",
    generate_summary: "AI 课时总结",
    export_notes: "导出笔记",
    share_progress: "分享证书",
    streak_days: "连续学习天数",
    total_xp: "总经验值 (XP)",
    scholar_level: "学者等级",
    daily_goal: "每日学习目标",
    daily_goal_desc: "跟踪每日知识掌握进度",
    discovery_feed: "AI 学术发现流",
    knowledge_gaps: "当前知识盲区",
    recommended_for_you: "为您推荐",
    weekly_summary: "每周学习周报",
    challenge_arena: "学术挑战竞技场",
    recent_activity: "最近动态",
    upcoming_deadlines: "即将截止的任务",
    enrolled_courses: "我的已选课程",
    degree_catalog: "认证学术学位目录",
    degree_catalog_desc: "大学级别的严谨课程体系。",
    language: "语言",
    theme: "界面主题",
    dark_theme: "纯黑深色主题",
    light_theme: "高对比度浅色主题",
    voice_assistant: "语音助手",
    speech_rate: "语速",
    pitch: "音调",
    save_settings: "保存设置",
    saved_successfully: "设置已成功保存",
    close: "关闭",
    cancel: "取消",
    confirm: "确认",
    back_to_dashboard: "返回中心概览",
    next_lesson: "下一课",
    previous_lesson: "上一课",
    mark_as_completed: "标记为已完成",
    take_quiz: "开始诊断测试",
    submit_quiz: "提交答案",
    quiz_results: "测验结果",
    correct: "正确",
    incorrect: "错误",
    score: "得分",
    explanation: "科学原理解析",
    try_again: "重新作答",
    key_takeaways: "核心收获",
  },
  hi: {
    welcome: "स्वागत है",
    dashboard: "हब अवलोकन",
    hub: "हब",
    courses: "पाठ्यक्रम और प्रशिक्षण",
    degrees: "डिग्री प्रोग्राम",
    knowledge_base: "ज्ञान भंडार",
    analytics: "सीखने का विश्लेषण",
    planner: "साप्ताहिक अनुसूची",
    social_forums: "अकादमिक फोरम",
    leaderboard: "लीडरबोर्ड और अंक",
    study_rooms: "अध्ययन कक्ष और आवाज",
    achievements: "बैज और प्रमाणपत्र",
    teacher_dashboard: "शिक्षक स्टूडियो",
    api_engine: "डेवलपर एपीआई इंजन",
    admin_portal: "प्रशासन पोर्टल",
    settings: "प्लेटफ़ॉर्म सेटिंग्स",
    about: "परियोजना के बारे में",
    donate: "दस्तावेज़",
    quick_study: "त्वरित अध्ययन",
    synced: "सिंक किया गया",
    syncing: "सिंक हो रहा है...",
    search_placeholder: "डिग्री कैटलॉग, पाठ्यक्रम खोजें...",
    more_suite: "अतिरिक्त सुविधाएं",
    view_profile: "प्रोफ़ाइल और स्तर देखें",
    privacy_terms: "गोपनीयता और शर्तें",
    legal: "कानूनी",
    all_categories: "सभी श्रेणियां",
    all_levels: "सभी स्तर",
    search: "खोजें",
    filter: "फ़िल्टर",
    enrolled: "नामांकित",
    completed: "पूर्ण",
    in_progress: "प्रगति पर है",
    not_started: "शुरू नहीं हुआ",
    start_course: "सीखना शुरू करें",
    continue_course: "सीखना जारी रखें",
    view_details: "पाठ्यक्रम देखें",
    modules_count: "मॉड्यूल",
    lessons_count: "पाठ",
    duration: "अनुमानित समय",
    hours: "घंटे",
    minutes: "मिनट",
    level: "अकादमिक स्तर",
    rating: "रेटिंग",
    instructor: "संकाय / शिक्षक",
    curriculum: "अकादमिक पाठ्यक्रम",
    learning_outcomes: "सीखने के परिणाम",
    capstone: "कैपस्टोन प्रोजेक्ट",
    quizzes: "प्रश्नोत्तरी",
    flashcards: "फ़्लैशकार्ड",
    ai_tutor: "सुकराती एआई ट्यूटर",
    generate_summary: "एआई सारांश",
    export_notes: "नोट्स निर्यात करें",
    share_progress: "प्रमाणपत्र साझा करें",
    streak_days: "लगातार दिन",
    total_xp: "कुल एक्सपी अंक",
    scholar_level: "विद्वान स्तर",
    daily_goal: "दैनिक लक्ष्य",
    daily_goal_desc: "दैनिक प्रगति ट्रैक करें",
    discovery_feed: "एआई खोज फ़ीड",
    knowledge_gaps: "ज्ञान का अंतर",
    recommended_for_you: "आपके लिए अनुशंसित",
    weekly_summary: "साप्ताहिक सारांश",
    challenge_arena: "चुनौती अखाड़ा",
    recent_activity: "हाल की गतिविधि",
    upcoming_deadlines: "आगामी समय सीमा",
    enrolled_courses: "मेरे नामांकित पाठ्यक्रम",
    degree_catalog: "डिग्री कैटलॉग",
    degree_catalog_desc: "विश्वविद्यालय स्तर का पाठ्यक्रम।",
    language: "भाषा",
    theme: "थीम",
    dark_theme: "डार्क थीम",
    light_theme: "लाइट थीम",
    voice_assistant: "आवाज सहायक",
    speech_rate: "भाषण दर",
    pitch: "पिच",
    save_settings: "सेटिंग्स सहेजें",
    saved_successfully: "सफलतापूर्वक सहेजा गया",
    close: "बंद करें",
    cancel: "रद्द करें",
    confirm: "पुष्टि करें",
    back_to_dashboard: "डैशबोर्ड पर वापस जाएं",
    next_lesson: "अगला पाठ",
    previous_lesson: "पिछला पाठ",
    mark_as_completed: "पूर्ण के रूप में चिह्नित करें",
    take_quiz: "प्रश्नोत्तरी शुरू करें",
    submit_quiz: "उत्तर सबमिट करें",
    quiz_results: "परिणाम",
    correct: "सही",
    incorrect: "गलत",
    score: "अंक",
    explanation: "व्याख्या",
    try_again: "पुनः प्रयास करें",
    key_takeaways: "मुख्य बिंदु",
  },
};

/**
 * Arabic Academic Course Translation Catalog
 * Translates core default courses into authentic, rigorous academic Arabic
 */
const ARABIC_COURSES_MAP: Record<string, any> = {
  'course-ai-agentic-systems': {
    title: 'أسراب الوكلاء الذاتية والمعماريات الإدراكية',
    category: 'علوم الحاسوب والأنظمة الذاتية',
    description: 'إتقان إدارة وتنسيق أسراب الوكلاء المتعددة، ورسوم الاستدلال الإدراكي، واستدعاء الأدوات الفوري، وأنظمة الذاكرة المستدامة المدعومة بمحركات جيميناي 3.1 وأنتي جرافيتي.',
    level: 'Advanced',
    author: 'مختبر د. زلمطي للأنظمة المتقدمة',
    tags: ['وكلاء الذكاء الاصطناعي', 'جيميناي 3.1 برو', 'ذاكرة RAG المتجهة', 'تنسيق الأدوات البرمجية'],
    modules: [
      {
        id: 'mod-1',
        title: 'الوحدة الأولى: الأطر الإدراكية ومقارنة الوكلاء التفاعليين مع الاستباقيين',
        description: 'أسس الحلقات الإدراكية الذكية، ومسارات الإدراك والفعل، ورسوم اتخاذ القرار الحاسمة.',
        lessons: [
          {
            id: 'les-1-1',
            title: 'تشريح وبنية الوكيل الذكي المستقل',
            durationMinutes: 18,
            content: `يختلف وكيل الذكاء الاصطناعي المستقل عن النماذج اللغوية الثابتة بقدرته على الحفاظ على حالة مستمرة، واستخدام الأدوات البرمجية الخارجية، وتنفيذ أهداف معقدة متعددة الخطوات ذاتياً.

### الركائز الأساسية لأنظمة الوكلاء:
1. **الإدراك (Perception)**: استيعاب السياق في الوقت الفعلي عبر المدخلات متعددة الوسائط، وقنوات WebSockets، وشجرة عناصر الصفحة (DOM).
2. **الحلقة الإدراكية (ReAct / التخطيط والتنفيذ)**: تفكيك الأهداف الكبرى إلى خطوات تنفيذية محددة وقابلة للتحقق.
3. **أنظمة الذاكرة المتعددة**:
   - **الذاكرة العرضية (Episodic)**: تسجيل وتخزين سجلات الجلسات السابقة.
   - **الذاكرة الدلالية (Semantic RAG)**: البحث في الفضاءات المتجهية عالية الأبعاد عن الحقائق والمستندات.
   - **الذاكرة الإجرائية (Procedural)**: تعلم إجراءات استدعاء الأدوات واستخدامها بكفاءة مع الوقت.
4. **الفعل واستدعاء الأدوات**: بيئات تنفيذ آمنة (حاويات معزولة ومكتبات تشغيل المتصفحات الآمنة).`,
            keyTakeaways: [
              'يجمع الوكيل الذكي بين المعالجة الإدراكية والاستدعاء الفوري للأدوات.',
              'نمط ReAct يدمج التفكير والاستدلال مع نتائج التنفيذ في سياق النموذج.',
              'معمارية الذاكرة ثلاثية المستويات تضمن استمرارية التعلم عبر الجلسات.'
            ],
            audioScript: 'أهلاً بك في درس تشريح الوكيل الذكي المستقل. في هذا الدرس، نستكشف معاً كيف تتجاوز الحلقات الإدراكية الحديثة مجرد التفاعل النصي إلى اتخاذ القرارات واستخدام الأدوات البرمجية بكفاءة.',
            quizzes: [
              {
                id: 'q-1-1-1',
                question: 'ما هو المكون الذي يمكّن الوكيل من الاحتفاظ بالحقائق واسترجاعها عبر الجلسات المتعددة؟',
                options: [
                  'ذاكرة التخزين المؤقت العابرة',
                  'ذاكرة الاسترجاع الدلالي المدعمة بالمتجهات (Semantic RAG)',
                  'اقتطاع نافذة السياق النصي',
                  'المحلل التعبيري الثابت'
                ],
                correctAnswerIndex: 1,
                explanation: 'تستخدم ذاكرة الاسترجاع الدلالي التضمينات المتجهية لاسترجاع الحقائق والوثائق بدقة عبر الجلسات المختلفة.',
                hint: 'فكر في الفضاءات المتجهية عالية الأبعاد.'
              },
              {
                id: 'q-1-1-2',
                question: 'ما هي الفائدة الأساسية لنمط ReAct (الاستدلال + التنفيذ)؟',
                options: [
                  'تقليل استهلاك ذاكرة معالج الرسومات إلى الصفر',
                  'إعادة تغذية مخرجات الأدوات باستمرار إلى سياق النموذج لإعادة تقييم الخطوة التالية',
                  'منع الوكيل من إجراء أي اتصالات شبكية',
                  'ترجمة الشيفرات البرمجية مباشرة إلى تعليمات ثنائية'
                ],
                correctAnswerIndex: 1,
                explanation: 'يعمل نمط ReAct على تقييم نتائج الأدوات بشكل تكراري، مما يتيح للوكيل تكييف قراراته القادمة بناءً على الواقع.',
                hint: 'إنه يدمج التغذية الراجعة للأداة داخل الاستدلال.'
              }
            ],
            flashcards: [
              {
                id: 'fc-1',
                front: 'ما هو نمط ReAct في الذكاء الاصطناعي القائم على الوكلاء؟',
                back: 'نمط تصميم يجمع بين الاستدلال والتفكير المنطقي مع تنفيذ واستدعاء الأدوات الخارجية في حلقة تكرارية مستمرة.'
              },
              {
                id: 'fc-2',
                front: 'ما هو الفرق بين الذاكرة العرضية والذاكرة الدلالية؟',
                back: 'الذاكرة العرضية تسجل أحداث وتفاصيل الجلسات السابقة، بينما الذاكرة الدلالية تفهرس المفاهيم والحقائق العلمية المتجهية.'
              }
            ]
          },
          {
            id: 'les-1-2',
            title: 'أسراب الوكلاء المتعددة وخوارزميات الإجماع',
            durationMinutes: 24,
            content: `عندما يواجه الوكيل الفردي قيوداً في حجم السياق أو تعقيداً تخصصياً، تقوم أسراب الوكلاء بتوزيع المسؤوليات عبر أدوار متخصصة ومتكاملة.

### طوبولوجيا أسراب الوكلاء:
- **نمط المنسق والعمال (Orchestrator-Worker)**: يتولى منسق رئيسي تفويض المهام لوكلاء فرعيين (مثل وكيل البرمجة، وكيل المراجعة، وكيل الاختبار).
- **التصويت التوافقي (Consensus Voting)**: يقترح عدة وكلاء حلولاً بالتوازي ويتم اعتماد الحل الحائز على أعلى درجات الموثوقية الرياضية.
- **بروتوكولات التسليم والتفويض**: نقل سلس لحالة التنفيذ بين الوكلاء الطرفيين ومحركات السحابة العملاقة.`,
            keyTakeaways: [
              'الأنظمة متعددة الوكلاء تزيد من كفاءة المعالجة المتزامنة والتخصص الدقيق.',
              'الوكيل المنسق يوازن الحمل الإدراكي عبر شبكة الوكلاء.',
              'التصويت التوافقي يقلل من نسب الهلوسة في القرارات الحساسة.'
            ],
            audioScript: 'في درس أسراب الوكلاء المتعددة، نتعلم كيف يتعاون الوكلاء المتخصصون عبر بروتوكولات التسليم والتصويت التوافقي لحل أعقد المسائل الهندسية.',
            quizzes: [
              {
                id: 'q-1-2-1',
                question: 'ما هو الدور الأساسي للوكيل المنسق (Orchestrator Agent)؟',
                options: [
                  'تنفيذ عمليات الرسم والتصميم فقط',
                  'تفويض المهام للوكلاء المتخصصين ومراقبة جودة النتائج',
                  'إيقاف الاتصال بالسيرفر',
                  'حذف سجلات التدريب'
                ],
                correctAnswerIndex: 1,
                explanation: 'يعمل المنسق كقائد للنظام يدير تدفق البيانات ويوزع المهام على الوكلاء الأنسب.',
                hint: 'إدارة وتفويض المهام.'
              }
            ],
            flashcards: [
              {
                id: 'fc-3',
                front: 'ما هي طوبولوجيا المنسق والعمال؟',
                back: 'معمارية يعتمد فيها النظام على وكيل رئيسي يقسم المهام المعقدة ويسندها لوكلاء فرعيين متخصصين لتحقيق التوازي والدقة.'
              }
            ]
          }
        ]
      }
    ]
  },
  'course-quantum-computing': {
    title: 'الحوسبة الكمية والفيزياء الخوارزمية المتقدمة',
    category: 'الفيزياء والتقنيات العميقة',
    description: 'استكشاف متجهات حالة الكيوبت، والتشابك الكمي، وخوارزميات شور وغروفر، والمحاكاة الدقيقة للدارات والبوابات الكمية.',
    level: 'Intermediate',
    author: 'شبكة أكاديمية الفيزياء الكمية',
    tags: ['الفيزياء الكمية', 'الكيوبت', 'خوارزمية غروفر', 'الدارات الكمية'],
    modules: [
      {
        id: 'mod-q1',
        title: 'الوحدة الأولى: التراكب، التشابك ورياضيات الكيوبت',
        description: 'الجبر الخطي للبتات الكمية، وترميز ديراك، وهندسة كرة بلوخ.',
        lessons: [
          {
            id: 'les-q1-1',
            title: 'تمثيل حالة الكيوبت وهندسة كرة بلوخ',
            durationMinutes: 22,
            content: `على عكس البتات التقليدية التي تحمل القيم الثنائية 0 أو 1، يوجد الكيوبت في تراكب خطي من متجهات الحالة.

$$\\vert \\psi \\rangle = \\alpha \\vert 0 \\rangle + \\beta \\vert 1 \\rangle$$

حيث $\\vert \\alpha \\vert^2 + \\vert \\beta \\vert^2 = 1$.

### هندسة كرة بلوخ (Bloch Sphere):
- **القطب الشمالي**: يمثل الحالة الأساسية $\\vert 0 \\rangle$
- **القطب الجنوبي**: يمثل الحالة الأساسية $\\vert 1 \\rangle$
- **خط الاستواء**: يمثل حالات التراكب متساوية الأوزان (مثل تحويل هادامارد).`,
            keyTakeaways: [
              'يستغل الكيوبت خاصية التراكب لتخزين سعات احتمالية مركبة.',
              'قياس الكيوبت يؤدي إلى انهيار دالته الموجية احتماليا إلى حالة محددة.',
              'تمثل كرة بلوخ الحالات الكمية الفردية هندسياً بشكل مرئي.'
            ],
            audioScript: 'مرحباً بكم في درس تمثيل الكيوبت. نتعلم اليوم التراكب الخطي، وسعات الاحتمال، والتمثيل الهندسي على كرة بلوخ.',
            quizzes: [
              {
                id: 'q-q1-1',
                question: 'ماذا يحدث عند قياس كيوبت موجود في حالة تراكب كمي؟',
                options: [
                  'تتضاعف سعات الحالة فوراً',
                  'تنهار الدالة الموجية احتمالياً إلى إحدى الحالتين الأساسيتين |0> أو |1>',
                  'يبقى في حالة التراكب إلى ما لا نهاية',
                  'يطلق إشعاعاً فوق بنفسجي'
                ],
                correctAnswerIndex: 1,
                explanation: 'يجبر القياس الكلاسيكي الدالة الموجية على الانهيار الاحتمالي إلى إحدى الحالات الذاتية الأساسية.',
                hint: 'انهيار الدالة الموجية.'
              }
            ],
            flashcards: [
              {
                id: 'fc-q1',
                front: 'ما هي وظيفة بوابة هادامارد (Hadamard Gate)؟',
                back: 'تحويل الحالات الأساسية |0> و |1> إلى حالات تراكب كمي متساوية الاحتمال.'
              }
            ]
          }
        ]
      }
    ]
  },
  'course-executive-strategy': {
    title: 'استراتيجية تحول الأعمال والذكاء الاصطناعي المؤسسي',
    category: 'الأعمال والقيادة الاستراتيجية',
    description: 'أطر العمل الاستراتيجية لتطبيق الذكاء الاصطناعي في المؤسسات، وحساب العائد على الاستثمار، والحوكمة الأخلاقية، وإدارة التغيير.',
    level: 'Beginner',
    author: 'المجلس القيادي العالمي LMDpro',
    tags: ['استراتيجية الأعمال', 'الذكاء الاصطناعي المؤسسي', 'العائد على الاستثمار', 'الحوكمة'],
    modules: [
      {
        id: 'mod-b1',
        title: 'الوحدة الأولى: بناء خارطة طريق الذكاء الاصطناعي المؤسسي',
        description: 'تقييم عائد الأتمتة، وتطوير مهارات الفريق، وجاهزية البنية التحتية للبيانات.',
        lessons: [
          {
            id: 'les-b1-1',
            title: 'مصفوفة القيمة وحالات الاستخدام عالية التأثير',
            durationMinutes: 15,
            content: `يتطلب تبني الذكاء الاصطناعي في المؤسسات موازنة دقيقة بين الأثر التجاري وجدوى التنفيذ الفني.

### مصفوفة القيمة الرباعية (2x2 Value Matrix):
1. **الانتصارات السريعة (Quick Wins)**: عائد استثماري مرتفع مع تعقيد فني منخفض (مثل المساعدات الذكية لخدمة العملاء).
2. **الرهانات الاستراتيجية (Strategic Bets)**: عائد استثماري مرتفع مع تعقيد فني متقدم (مثل الأتمتة الشاملة لسلاسل الإمداد).
3. **المهام الثانوية (Fill-Ins)**: عائد منخفض مع تعقيد منخفض.
4. **استنزاف الموارد (Money Pits)**: عائد منخفض مع تعقيد تقني مرتفع (يجب تجنبها تماماً!).`,
            keyTakeaways: [
              'استهدف الانتصارات السريعة أولاً لبناء الثقة المؤسسية والزخم التشغيلي.',
              'حدد العائد على الاستثمار من خلال تحسين مؤشرات السرعة والدقة وخفض التكاليف.',
              'ضع معايير أمان وخصوصية صارمة قبل التوسع.'
            ],
            audioScript: 'في استراتيجية الذكاء الاصطناعي المؤسسي، نستخدم مصفوفة القيمة لتحديد المشاريع الأعلى عائداً والأسرع تنفيذاً.',
            quizzes: [
              {
                id: 'q-b1-1',
                question: 'أي مربع في مصفوفة القيمة يجب أن تمنحه المؤسسات الأولوية الأولى؟',
                options: ['استنزاف الموارد', 'الانتصارات السريعة', 'المهام الثانوية', 'التجارب غير المجدية'],
                correctAnswerIndex: 1,
                explanation: 'توفر الانتصارات السريعة عائداً مرتفعاً بتعقيد منخفض، مما يبني الثقة ويوفر تمويلاً للمشاريع الاستراتيجية الأكبر.',
                hint: 'عائد مرتفع مع سهولة التنفيذ.'
              }
            ],
            flashcards: [
              {
                id: 'fc-b1',
                front: 'ما هو تعريف الرهان الاستراتيجي (Strategic Bet)؟',
                back: 'مشروع ذو قيمة تحولية عالية للمؤسسة على المدى الطويل ولكنه يتطلب بنية تقنية وتكاملاً معقداً.'
              }
            ]
          }
        ]
      }
    ]
  },
  'course-cyber-security': {
    title: 'معمارية الثقة المعدومة والأنظمة التشفيرية المتقدمة',
    category: 'الأمن السيبراني وعلم التشفير',
    description: 'منهج دراسات عليا متقدم يغطي تشفير ما بعد الحوسبة الكمية، وإثباتات المعرفة الصفرية (zk-SNARKs)، ووحدات أمان الأجهزة، وبروتوكولات الدفاع الاستباقي.',
    level: 'Advanced',
    author: 'مركز أبحاث الأمن السيبراني LMDpro',
    tags: ['الأمن السيبراني', 'إثباتات المعرفة الصفرية', 'تشفير ما بعد الكم', 'الثقة المعدومة'],
    modules: [
      {
        id: 'mod-sec1',
        title: 'الوحدة الأولى: التشفير بالمعرفة الصفرية وآليات zk-SNARK',
        description: 'الأسس الرياضية للمنحنيات الإهليلجية، ومتعددات الحدود القابلة للتحقق، والإثباتات المقتضبة دون كشف السر.',
        lessons: [
          {
            id: 'les-sec1-1',
            title: 'إثباتات المعرفة الصفرية (zk-SNARKs) والتحقق الرياضي',
            durationMinutes: 25,
            content: `تتيح إثباتات المعرفة الصفرية لطرف (المُثبِت) إقناع طرف آخر (المُتحقِق) بصحة معلومة معينة دون الكشف عن المعلومة نفسها.

### الخصائص الرياضية الثلاث:
1. **الاكتمال (Completeness)**: إذا كان البيان صحيحاً، سيقتنع المُتحقِق الصادق دائماً.
2. **المتانة (Soundness)**: لا يمكن لمُثبِت كاذب إقناع المُتحقِق إلا باحتمالية ضئيلة للغاية تقترب من الصفر.
3. **المعرفة الصفرية (Zero-Knowledge)**: لا يتعلم المُتحقِق أي معلومة إضافية تتجاوز صحة البيان.`,
            keyTakeaways: [
              'تضمن zk-SNARKs الخصوصية المطلقة مع إمكانية التحقق الرياضي الفوري.',
              'تتطلب التحويل إلى دوائر حسابية وأنظمة برمجية مثل R1CS.',
              'تعد حجر الزاوية في حلول التوسع الآمن وسلاسل الكتل الحديثة.'
            ],
            audioScript: 'مرحباً بكم في درس إثباتات المعرفة الصفرية. نتعرف على كيفية إثبات صحة العمليات الحسابية دون الكشف عن البيانات السرية.',
            quizzes: [
              {
                id: 'q-sec1-1',
                question: 'ما هي الخاصية التي تضمن عدم قدرة الطرف الكاذب على خداع المُتحقِق؟',
                options: ['الاكتمال', 'المتانة (Soundness)', 'السرعة', 'التشفير المتماثل'],
                correctAnswerIndex: 1,
                explanation: 'تضمن خاصية المتانة الرياضية أن أي ادعاء غير صحيح سيفشل في اختبار التحقق بحتمية حسابية.',
                hint: 'منع الادعاءات الباطلة.'
              }
            ],
            flashcards: [
              {
                id: 'fc-sec1',
                front: 'ماذا تعني كلمة SNARK في بروتوكول zk-SNARK؟',
                back: 'Succinct Non-interactive Argument of Knowledge (حجة معرفية مقتضبة وغير تفاعلية).'
              }
            ]
          }
        ]
      }
    ]
  },
  'course-bio-informatics': {
    title: 'المعلوماتية الحيوية الحاسوبية وعلم الجينوم الهيكلي',
    category: 'المعلوماتية الحيوية والطب الحاسوبي',
    description: 'تطبيق نماذج التعلم العميق في طي البروتينات (AlphaFold)، ومحاذاة التسلسلات الجينومية، واكتشاف الأدوية الحيوية عبر النمذجة الجزيئية.',
    level: 'Advanced',
    author: 'معهد أبحاث الجينوم الحاسوبي',
    tags: ['المعلوماتية الحيوية', 'الجينوم', 'ألفا فولد', 'طي البروتين'],
  },
  'course-renewable-cleantech': {
    title: 'أنظمة الطاقة النظيفة وشبكات التوزيع الذكية المصغرة',
    category: 'الهندسة المستدامة والتكنولوجيا النظيفة',
    description: 'تصميم شبكات الطاقة المتجددة، وأنظمة تخزين الطاقة بالبطاريات المتقدمة، وخوارزميات التحكم الذاتي في الأحمال الكهربائية.',
    level: 'Intermediate',
    author: 'مركز أبحاث الطاقة المستدامة',
    tags: ['الطاقة المتجددة', 'الشبكات الذكية', 'تخزين الطاقة', 'الاستدامة'],
  },
  'course-neuromorphic-ai': {
    title: 'الحوسبة العصبية التكيفية وشبكات النبض العصبي',
    category: 'الذكاء الاصطناعي وهندسة العتاد',
    description: 'بناء معالجات فائقة الكفاءة تحاكي الدماغ البشري (Spiking Neural Networks) ومعالجة الإشارات اللحظية باستهلاك طاقة يقاس بالميلي واط.',
    level: 'Advanced',
    author: 'مختبر المعالجات العصبية المتقدمة',
    tags: ['الحوسبة العصبية', 'الشبكات النبضية', 'معمارية العتاد', 'محاكاة الدماغ'],
  },
  'course-quant-finance': {
    title: 'التمويل الكمي عالي التردد وهندسة الأسواق المالية',
    category: 'التمويل الكمي والتكنولوجيا المالية',
    description: 'بناء محركات التداول الخوارزمي، وحساب التفاضل والتكامل العشوائي (Stochastic Calculus)، ونماذج إدارة المخاطر اللحظية والسيولة.',
    level: 'Advanced',
    author: 'أكاديمية التحليل الكمي للأسواق',
    tags: ['التمويل الكمي', 'التداول الخوارزمي', 'إدارة المخاطر', 'حساب التفاضل العشوائي'],
  },
  'course-edge-robotics': {
    title: 'الروبوتات المتنقلة المستقلة ورسم الخرائط الفوري (SLAM)',
    category: 'الروبوتات والأنظمة المدمجة',
    description: 'خوارزميات التوطين وبناء الخرائط المتزامنة (SLAM)، ودمج بيانات الحساسات والرادار والليدار، والتحكم الحركي في الروبوتات الميدانية.',
    level: 'Advanced',
    author: 'معهد الروبوتات والأنظمة الذكية',
    tags: ['الروبوتات', 'SLAM', 'دمج الحساسات', 'الملاحة الذاتية'],
  },
  'course-spatial-webgpu': {
    title: 'الحوسبة المكانية ورسوميات WebGPU ثلاثية الأبعاد',
    category: 'برمجة الرسوميات وتطوير الويب',
    description: 'برمجة خطوط أنابيب معالجات الرسومات الحديثة بواسطة WebGPU وWGSL، ومحاكاة الإضاءة الحجمية وتصيير المشاهد الفضائية بمعدل 120 إطاراً في الثانية.',
    level: 'Advanced',
    author: 'مختبر الحوسبة المكانية والرسوميات',
    tags: ['WebGPU', 'الحوسبة المكانية', 'مظللات WGSL', 'الرسوميات ثلاثية الأبعاد'],
  },
  'course-sheaf-topologies': {
    title: 'إجماع الحزم الطوبولوجية وشبكات الوكلاء متعددة الرؤى',
    category: 'الرياضيات المتقدمة ونظرية الأنظمة',
    description: 'الأسس الرياضية لنظرية الحزم الخلوية (Cellular Sheaves)، ومصفوفة لابلوسيان للحزم، وخوارزميات Sheaf-ADMM لحل نزاعات البيانات الموزعة.',
    level: 'Expert',
    author: 'قسم الرياضيات الطوبولوجية والأنظمة المعقدة',
    tags: ['نظرية الحزم', 'الطوبولوجيا الجبرية', 'Sheaf-ADMM', 'الإجماع الموزع'],
  },
  'course-workspace-safety-osha': {
    title: 'السلامة العامة والصحة المهنية في بيئات العمل الصناعية',
    category: 'السلامة الصناعية والصحة المهنية',
    description: 'المعايير الدولية الشاملة للسلامة الصناعية، وتقييم المخاطر، وهرم وسائل التحكم، وبروتوكولات عزل الطاقة (LOTO)، ومكافحة الحرائق، والمواد الخطرة (GHS).',
    level: 'Beginner',
    author: 'المعهد الدولي للسلامة والصحة المهنية',
    tags: ['السلامة المهنية', 'هرم التحكم', 'عزل الطاقة LOTO', 'السلامة الكيميائية GHS', 'الدفاع المدني'],
  },
  'course-distributed-cloud-microservices': {
    title: 'هندسة النظم الموزعة والبنية السحابية عالية الإنتاجية',
    category: 'هندسة النظم السحابية والموزعة',
    description: 'إتقان خوارزميات التوافق الرياضي (Raft و Paxos)، والتجزئة المتسقة، وتدفق البيانات بالأحداث عبر Kafka، وتنسيق الحاويات عبر Kubernetes.',
    level: 'Advanced',
    author: 'كلية هندسة النظم السحابية',
    tags: ['الأنظمة الموزعة', 'البنية السحابية', 'خوارزمية Raft', 'Kubernetes', 'الخدمات المصغرة', 'Kafka'],
    modules: [
      {
        id: 'mod-cloud-1',
        title: 'الوحدة الأولى: بروتوكولات الإجماع وآلات الحالة الموزعة',
        description: 'البراهين الرياضية لانتخاب القائد، وتكرار سجلات العمليات، والتسامح مع الأخطاء البيزنطية.',
        lessons: [
          {
            id: 'les-cloud-1-1',
            title: 'بروتوكول إجماع Raft وأنظمة النصاب القانوني (Quorum)',
            durationMinutes: 25,
            content: `يتطلب تكرار آلة الحالة الموزعة أن تتفق مجموعة من العقد المستقلة على تسلسل الانتقالات الحالة رغم انقطاعات الشبكة وأعطال الخوادم.

### الركائز الأساسية لبروتوكول Raft:
1. **انتخاب القائد (Leader Election)**: مؤقتات عشوائية تمنع انقسام الأصوات وتضمن انتخاب قائد واحد موثوق.
2. **تكرار السجلات (Log Replication)**: يستقبل القائد طلبات العملاء ويبثها إلى التابعين، ويعتمدها فور تأكيد أغلبية النصاب ($N/2 + 1$).
3. **ضمانات الأمان (Safety Guarantees)**: تضمن سلامة آلة الحالة أنه إذا تم تطبيق سجل عند فهرس معين، فلن يتم تطبيق سجل مختلف أبداً عند نفس الفهرس.`,
            keyTakeaways: [
              'يفكك بروتوكول Raft الإجماع إلى انتخاب القائد، وتكرار السجل، وفرض الأمان.',
              'يتطلب النصاب القانوني أغلبية (N/2 + 1) لاعتماد العمليات دون انقسام الدماغ.',
              'يجب أن تكون فترات نبضات القلب أقل بكثير من مهلات الانتخاب.'
            ],
            audioScript: 'مرحباً بكم في درس بروتوكول Raft للإجماع. ندرس اليوم كيفية حفاظ العقد الموزعة على حالة موحدة عبر الشبكات المجزأة.',
            quizzes: [
              {
                id: 'q-cloud-1-1',
                question: 'في عنقود Raft مكون من 5 عقد موزعة، ما هو الحد الأدنى للعقد المطلوبة لتشكيل نصاب قانوني صحيح؟',
                options: ['عقدتان (2)', '3 عقد', '4 عقد', '5 عقد بالكامل'],
                correctAnswerIndex: 1,
                explanation: 'بالنسبة لعنقود من N عقد، يتطلب النصاب floor(N/2) + 1. بالنسبة لـ 5 عقد: floor(5/2) + 1 = 2 + 1 = 3 عقد.',
                hint: 'حساب الأغلبية: N/2 + 1.'
              }
            ],
            flashcards: [
              {
                id: 'fc-cloud-1',
                front: 'ما هي متلازمة انقسام الدماغ (Split-Brain) في النظم الموزعة؟',
                back: 'حالة عطل تؤدي فيها تجزئة الشبكة إلى اعتقاد مجموعتين فرعيتين بأنهما القائد الرئيسي، مما يؤدي إلى تضارب خطير في البيانات المكتوبة.'
              }
            ]
          }
        ]
      }
    ]
  },
  'course-medical-ai-imaging': {
    title: 'الذكاء الاصطناعي الطبي والمعلوماتية الحيوية والتشخيص الجينومي',
    category: 'المعلوماتية الحيوية والذكاء الاصطناعي الصحي',
    description: 'استكشاف المحولات الالتفافية لتجزئة صور الرنين المغناطيسي ثلاثية الأبعاد، وآليات طي البروتين، وخوارزميات تصنيف الطفرات الجينومية.',
    level: 'Advanced',
    author: 'مركز الطب الحاسوبي والجينوم السريري',
    tags: ['الذكاء الاصطناعي الطبي', 'الجينوم', 'المعلوماتية الحيوية', 'ألفا فولد', 'التصوير الطبي'],
    modules: [
      {
        id: 'mod-med-1',
        title: 'الوحدة الأولى: الرؤية العميقة للأشعة والتجزئة الحجمية',
        description: 'معماريات 3D U-Net، ودوال خسارة دايس (Dice Loss)، ومعالجة موترات الرنين المغناطيسي متعددة المستويات.',
        lessons: [
          {
            id: 'les-med-1-1',
            title: 'التجزئة الحجمية ثلاثية الأبعاد 3D U-Net ومعامل دايس',
            durationMinutes: 28,
            content: `يتطلب تحليل التصوير الطبي تجزئة دقيقة على مستوى البكسل والفكسل للهياكل التشريحية والآفات المرضية من فحوصات الرنين المغناطيسي والتصوير المقطعي.

### الابتكارات المعمارية في 3D U-Net:
1. **مسار الانكماش (المشفر)**: يلتقط الميزات السياقية عبر التفافات ثلاثية الأبعاد ($3 \\times 3 \\times 3$) متبوعة بتجميع القيم القصوى.
2. **مسار التمدد (المفكك)**: يتيح تحديد المواقع بدقة عبر الالتفافات المنقولة والروابط التخطيّة (Skip Connections).
3. **دالة الخسارة**: دالة Soft Dice Loss المعممة تتغلب على عدم التوازن الشديد بين الأورام الصغيرة والحجم التشريحي الكبير المحيط.`,
            keyTakeaways: [
              'تحافظ شبكة 3D U-Net على الترابط الفراغي ثلاثي الأبعاد بين شرائح المسح.',
              'تنقل روابط التخطي خرائط الميزات عالية الدقة مباشرة إلى المفكك لاستعادة الحدود الدقيقة.',
              'توفر دالة Soft Dice Loss استقراراً تدرجياً ممتازاً عند تجزئة الآفات المرضية الصغيرة.'
            ],
            audioScript: 'في الذكاء الاصطناعي للتصوير الطبي، نستكشف معمارية 3D U-Net ودوال خسارة دايس المصممة خصيصاً للدقة التشخيصية السريرية.',
            quizzes: [
              {
                id: 'q-med-1-1',
                question: 'لماذا تعتبر روابط التخطي (Skip Connections) ضرورية في شبكة 3D U-Net الطبية؟',
                options: [
                  'لتقليل استهلاك الذاكرة إلى الصفر',
                  'للحفاظ على التفاصيل المكانية الدقيقة وحواف الأعضاء التي تفقد أثناء تقليل الأبعاد',
                  'لتشفير بيانات المرضى أثناء التدريب',
                  'لتحويل صور الأشعة إلى ملفات متجهة SVG'
                ],
                correctAnswerIndex: 1,
                explanation: 'تربط روابط التخطي ميزات المشفر عالية الدقة بميزات المفكك، مما يعيد دقة الحدود الفاصلة للآفات التشريحية.',
                hint: 'الحفاظ على الإحداثيات المكانية الدقيقة عبر المقاييس.'
              }
            ],
            flashcards: [
              {
                id: 'fc-med-1',
                front: 'ما هو معامل تشابه دايس (Dice Similarity Coefficient)؟',
                back: 'مقياس تداخل مكاني يقيس دقة التجزئة: DSC = 2|A ∩ B| / (|A| + |B|)، ويتراوح بين 0 (عدم وجود تداخل) إلى 1 (تطابق تام).'
              }
            ]
          }
        ]
      }
    ]
  },
  'course-applied-data-science-analytics': {
    title: 'علوم البيانات التطبيقية وخطوط تعلم الآلة والتحليلات التنبؤية',
    category: 'علوم البيانات والرياضيات التطبيقية',
    description: 'هندسة خطوط البيانات الشاملة التي تغطي الاستدلال الإحصائي، ومخازن الميزات، وتصيير الرسوم البيانية التفاعلية D3.js، وتشغيل النماذج بإنتاجية عالية.',
    level: 'Intermediate',
    author: 'كلية علوم البيانات وتعلم الآلة التطبيقي',
    tags: ['علوم البيانات', 'تعلم الآلة', 'النمذجة الإحصائية', 'التحليلات التنبؤية', 'D3.js', 'MLflow'],
    modules: [
      {
        id: 'mod-data-1',
        title: 'الوحدة الأولى: هندسة الميزات ومراقبة انحراف النماذج (Drift Monitoring)',
        description: 'تقنيات التوليد الآلي للميزات، ومؤشر استقرار السكان (PSI)، واكتشاف انحراف المفاهيم في بيئات الإنتاج.',
        lessons: [
          {
            id: 'les-data-1-1',
            title: 'اكتشاف انحراف المفاهيم واستقرار التوزيع في تعلم الآلة',
            durationMinutes: 20,
            content: `تتراجع كفاءة نماذج تعلم الآلة في بيئات الإنتاج بمرور الوقت مع تحول توزيعات البيانات الواقعية بعيداً عن بيانات التدريب الأصلية.

### مقاييس المراقبة الإنتاجية:
- **مؤشر استقرار السكان (PSI)**: يحدد مقدار تحول توزيع الميزات بمرور الوقت ($PSI < 0.1$ يشير للاستقرار، $PSI > 0.2$ يتطلب إعادة التدريب الفورية).
- **مسافة فاسرشتاين (Wasserstein Distance)**: تقيس المسافة بين التوزيعات الاحتمالية المستمرة.
- **انحراف المفهوم مقابل انحراف المتغيرات**: انحراف المتغيرات يغير $P(X)$ مع ثبات $P(Y|X)$، بينما انحراف المفهوم يغير العلاقة السببية $P(Y|X)$ مباشرة.`,
            keyTakeaways: [
              'المراقبة المستمرة تمنع التدهور الصامت لنماذج الذكاء الاصطناعي في بيئات العمل.',
              'تحدد عتبات مؤشر PSI المشغلات التلقائية لخطوط إعادة تدريب النماذج.',
              'يجب التمييز بين تحول مدخلات البيانات وانحراف المفاهيم والأهداف التنبؤية.'
            ],
            audioScript: 'مرحباً بكم في درس مراقبة نماذج علوم البيانات في الإنتاج. ندرس اليوم التقنيات الإحصائية لكشف ومعالجة انحراف المفاهيم.',
            quizzes: [
              {
                id: 'q-data-1-1',
                question: 'ماذا تعني نتيجة مؤشر استقرار السكان (PSI) الأكبر من 0.2؟',
                options: [
                  'النموذج يعمل بشكل مثالي ولا يحتاج لأي تعديل',
                  'حدث تحول كبير في توزيع البيانات يتطلب مراجعة فورية وإعادة تدريب النموذج',
                  'البيانات لا تحتوي على أي تباين إحصائي',
                  'الخادم نفدت منه مساحة التخزين'
                ],
                correctAnswerIndex: 1,
                explanation: 'تشير قيمة PSI > 0.2 إلى تحول جوهري بين توزيع الأساس والتوزيع الحالي، مما يستدعي إعادة تدريب النموذج.',
                hint: 'عتبة التحول الجوهري.'
              }
            ],
            flashcards: [
              {
                id: 'fc-data-1',
                front: 'ما هو انحراف المتغيرات (Covariate Shift)؟',
                back: 'ظاهرة يتغير فيها التوزيع الهامشي للمدخلات P(X) بمرور الوقت مع بقاء التوزيع الاحتمالي الشرطي للمخرجات P(Y|X) ثابتاً دون تغيير.'
              }
            ]
          }
        ]
      }
    ]
  },
  'course-nlp-generative-llm': {
    title: 'معالجة اللغات الطبيعية وهندسة النماذج اللغوية الضخمة',
    category: 'الذكاء الاصطناعي والتعلم العميق',
    description: 'استكشاف معماري عميق لآليات الانتباه الذاتي، وتضمينات الموضع الدائري (RoPE)، وتسريع الذاكرة KV-Cache، ومحاذاة التفضيل المباشر (DPO).',
    level: 'Advanced',
    author: 'معهد الحوسبة المعرفية ونماذج الأساس',
    tags: ['معالجة اللغات الطبيعية', 'المحولات Transformers', 'هندسة LLM', 'تضمينات RoPE', 'ذاكرة KV Cache', 'محاذاة DPO'],
    modules: [
      {
        id: 'mod-nlp-1',
        title: 'الوحدة الأولى: انتباه الجداء القياسي، تضمينات RoPE وذاكرة KV Cache',
        description: 'الأسس الرياضية لآليات انتباه المحولات، والتضمينات الدائرية، وتسريع الاستدلال اللحظي.',
        lessons: [
          {
            id: 'les-nlp-1-1',
            title: 'تضمين الموضع الدائري (RoPE) وهندسة الذاكرة السريعة KV Cache',
            durationMinutes: 30,
            content: `تعتمد نماذج الأساس الحديثة مثل جيميناي على تضمينات الموضع الدائري (RoPE) لدمج المعلومات المكانية النسبية مباشرة في الجداء الداخلي للاستعلام والمفتاح عبر مصفوفات دوران متعامدة.

$$\\mathbf{q}_m = \\mathbf{R}_{\\Theta, m}^d \\mathbf{W}_q \\mathbf{x}_m, \\quad \\mathbf{k}_n = \\mathbf{R}_{\\Theta, n}^d \\mathbf{W}_k \\mathbf{x}_n$$

### المزايا الأساسية لتضمين RoPE:
1. **الاضمحلال الموضعي الطبيعي**: يخفف درجات الانتباه بشكل طبيعي مع تباعد المسافة بين الكلمات $|m - n|$.
2. **التعميم عبر نوافذ السياق الضخمة**: يمتد بسلاسة ليتجاوز أطوال سياق التدريب عبر تقنيات توسيع التردد.
3. **تحسين ذاكرة التوليد KV Cache**: حجز مسبق لموترات المفتاح والقيمة في ذاكرة بطاقة الرسوميات أثناء التوليد لتخفيض التعقيد من $O(N^2)$ إلى $O(N)$.`,
            keyTakeaways: [
              'تطبق RoPE دوراناً متجهياً مركباً للحفاظ على المسافات النسبية في الانتباه متعدد الرؤوس.',
              'تخفض ذاكرة KV Cache زمن استجابة التوليد التكراري من زمن تربيعي إلى زمن خطي لكل رمز.',
              'تتيح تقنيات الاستيفاء الموضعي توسيع نوافذ السياق من 8 آلاف إلى أكثر من مليون رمز.'
            ],
            audioScript: 'في هذا الدرس، نفكك تضمينات الموضع الدائري وهندسة ذاكرة KV Cache، الابتكارات المعمارية المحورية وراء نماذج الذكاء الاصطناعي التوليدي المعاصرة.',
            quizzes: [
              {
                id: 'q-nlp-1-1',
                question: 'لماذا تعمل تقنية KV-caching على تسريع التوليد التكراري للنصوص بشكل كبير؟',
                options: [
                  'لأنها تضغط النصوص إلى أرقام صحيحة من 8 بت',
                  'لأنها تخزن إسقاطات المفاتيح والقيم للرموز السابقة فلا حاجة لإعادة حسابها عند كل رمز جديد',
                  'لأنها تعكس عملية التدريب إلى الخلف',
                  'لأنها تحذف علامات الترقيم من الأوامر'
                ],
                correctAnswerIndex: 1,
                explanation: 'ينتج التوليد التكراري رمزاً واحداً في كل خطوة. تعيد ذاكرة KV استخدام الحسابات السابقة مما يجعل تعقيد الخطوة O(N) بدلاً من O(N^2).',
                hint: 'إعادة استخدام موترات المفاتيح والقيم المحسوبة سابقاً.'
              }
            ],
            flashcards: [
              {
                id: 'fc-nlp-1',
                front: 'ما هي الخاصية الرياضية الجوهرية لتضمين RoPE؟',
                back: 'يعتمد الجداء الداخلي ⟨q_m, k_n⟩ حصرياً على الإزاحة النسبية (m - n)، مما يجعل التشفير الموضعي غير متأثر بالمواقع المطلقة للرموز.'
              }
            ]
          }
        ]
      }
    ]
  }
};

/**
 * Arabic Degree Program Translation Catalog
 */
const ARABIC_DEGREES_MAP: Record<string, any> = {
  'Autonomous & Cognitive Systems': {
    categoryName: 'الأنظمة الذكية والإدراكية الذاتية',
    partner: 'كلية الأنظمة المتقدمة بجامعة LMDpro',
    crawledSource: 'المجلس الأكاديمي للأنظمة المستقلة',
    topics: [
      { name: 'M.S. in Autonomous Multi-Agent Swarms & Antigravity Reasoning', arName: 'ماجستير العلوم في أسراب الوكلاء المستقلة واستدلال أنتي جرافيتي', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Applied Machine Learning & Agentic Systems', arName: 'بكالوريوس العلوم في تعلم الآلة التطبيقي والأنظمة الوكيلة', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'Ph.D. in Deep Neural Architectures & Cognitive Foundations', arName: 'دكتوراه الفلسفة في معماريات الشبكات العصبية العميقة والأسس الإدراكية', level: 'درجة الدكتوراه (Ph.D.)' },
      { name: 'M.S. in Deep Neural Architectures & Transformer Engineering', arName: 'ماجستير العلوم في معماريات الشبكات العصبية وهندسة المحولات', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Cognitive Computer Vision & Spatial Computing', arName: 'بكالوريوس العلوم في الرؤية الحاسوبية المعرفية والحوسبة المكانية', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Generative Systems & Large Multimodal Models', arName: 'ماجستير العلوم في الأنظمة التوليدية والنماذج متعددة الوسائط الضخمة', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Natural Language Processing & Semantic Search', arName: 'بكالوريوس العلوم في معالجة اللغات الطبيعية والبحث الدلالي', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Embodied Robotics & Humanoid Intelligence', arName: 'ماجستير العلوم في الروبوتات المجسدة والذكاء الشبيه بالبشر', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Reinforcement Learning & Autonomous Control', arName: 'بكالوريوس العلوم في التعلم المعزز والتحكم الذاتي', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'Post-Doc Fellowship in Neuromorphic Computing & Spiking Neural Networks', arName: 'زمالة أبحاث ما بعد الدكتوراه في الحوسبة العصبية والشبكات النبضية', level: 'أبحاث ما بعد الدكتوراه' }
    ]
  },
  'Cloud Engineering & Distributed Systems': {
    categoryName: 'هندسة النظم السحابية والأنظمة الموزعة',
    partner: 'معهد هندسة النظم السحابية الموزعة',
    crawledSource: 'المجلس الأكاديمي للحوسبة السحابية',
    topics: [
      { name: 'M.S. in Cloud Architecture & Serverless Microservices', arName: 'ماجستير العلوم في البنية السحابية والخدمات المصغرة بدون خادم', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Cloud Infrastructure & Systems Engineering', arName: 'بكالوريوس العلوم في البنية التحتية السحابية وهندسة النظم', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'Ph.D. in High-Throughput Distributed Database Theory', arName: 'دكتوراه الفلسفة في نظريات قواعد البيانات الموزعة فائقة السرعة', level: 'درجة الدكتوراه (Ph.D.)' },
      { name: 'M.S. in Distributed Systems & Resilient Database Engineering', arName: 'ماجستير العلوم في النظم الموزعة وهندسة قواعد البيانات المرنة', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in DevOps, CI/CD Pipelines & Site Reliability Engineering', arName: 'بكالوريوس العلوم في عمليات التطوير وهندسة الموثوقية (SRE)', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Multi-Cloud Native Architecture & Kubernetes', arName: 'ماجستير العلوم في البنى السحابية المتعددة ومنصة Kubernetes', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Linux Systems Programming & Virtualization', arName: 'بكالوريوس العلوم في برمجة أنظمة لينكس والافتراضية', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Edge Cloud Computing & IoT Mesh Systems', arName: 'ماجستير العلوم في حوسبة الحافة السحابية وشبكات إنترنت الأشياء', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Network Infrastructure & Cloud Communications', arName: 'بكالوريوس العلوم في البنية التحتية للشبكات والاتصالات السحابية', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Platform Engineering & Infrastructure as Code', arName: 'ماجستير العلوم في هندسة المنصات والبنية التحتية كبرمجيات', level: 'ماجستير العلوم (M.S.)' }
    ]
  },
  'Cybersecurity, Cryptography & Defense': {
    categoryName: 'الأمن السيبراني وعلم التشفير والدفاع الرقمي',
    partner: 'كلية هندسة الأمن السيبراني المتقدم والدفاع',
    crawledSource: 'مجلس المعايير الأمنية والتشفير المتقدم',
    topics: [
      { name: 'M.S. in Post-Quantum Cryptography & Zero-Trust Security', arName: 'ماجستير العلوم في تشفير ما بعد الكم وأمن الثقة المعدومة', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Cybersecurity Operations & Threat Intelligence', arName: 'بكالوريوس العلوم في عمليات الأمن السيبراني واستخبارات التهديدات', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'Ph.D. in Cryptographic Verification & Zero-Knowledge Proofs', arName: 'دكتوراه الفلسفة في التحقق التشفيري وإثباتات المعرفة الصفرية', level: 'درجة الدكتوراه (Ph.D.)' },
      { name: 'M.S. in Offensive Cyber Operations & Penetration Testing', arName: 'ماجستير العلوم في العمليات السيبرانية الهجومية واختبار الاختراق', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Digital Forensics & Incident Response Engineering', arName: 'بكالوريوس العلوم في التحقيق الرقمي الجنائي والاستجابة للحوادث', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Cloud Security Architecture & DevSecOps', arName: 'ماجستير العلوم في معمارية الأمن السحابي والعمليات الآمنة DevSecOps', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Network Security & Intrusion Detection Systems', arName: 'بكالوريوس العلوم في أمن الشبكات وأنظمة كشف التسلل', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Blockchain Security & Smart Contract Auditing', arName: 'ماجستير العلوم في أمان البلوكشين وتدقيق العقود الذكية', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Identity Management & Access Control Systems', arName: 'بكالوريوس العلوم في إدارة الهويات وأنظمة التحكم بالوصول', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in AI Security, Adversarial Robustness & Safety', arName: 'ماجستير العلوم في أمان الذكاء الاصطناعي والمتانة التنافسية', level: 'ماجستير العلوم (M.S.)' }
    ]
  },
  'Data Science, Analytics & Big Data': {
    categoryName: 'علوم البيانات والتحليلات المتقدمة والبيانات الضخمة',
    partner: 'مركز أبحاث علوم البيانات والذكاء الإحصائي',
    crawledSource: 'المجلس الأكاديمي لعلوم البيانات',
    topics: [
      { name: 'M.S. in Enterprise Data Science & Predictive Analytics', arName: 'ماجستير العلوم في علوم البيانات المؤسسية والتحليلات التنبؤية', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Data Analytics & Quantitative Decision Making', arName: 'بكالوريوس العلوم في تحليلات البيانات واتخاذ القرارات الكمية', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'Ph.D. in Causal Inference & Large-Scale Machine Learning', arName: 'دكتوراه الفلسفة في الاستدلال السببي وتعلم الآلة واسع النطاق', level: 'درجة الدكتوراه (Ph.D.)' },
      { name: 'M.S. in Big Data Engineering & Real-Time Stream Processing', arName: 'ماجستير العلوم في هندسة البيانات الضخمة والمعالجة اللحظية للتدفقات', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Applied Statistics & Business Intelligence', arName: 'بكالوريوس العلوم في الإحصاء التطبيقي وذكاء الأعمال', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Causal Inference & Machine Learning Experiments', arName: 'ماجستير العلوم في الاستدلال السببي وتجارب تعلم الآلة', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Data Visualization & Storytelling Engineering', arName: 'بكالوريوس العلوم في التصيير البصري للبيانات وسرد القصص الرقمية', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Spatial Data Analytics & Geographic Information Systems', arName: 'ماجستير العلوم في تحليلات البيانات المكانية ونظم المعلومات الجغرافية', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Data Governance, Ethics & Privacy Engineering', arName: 'بكالوريوس العلوم في حوكمة البيانات وأخلاقيات الخصوصية', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Graph Neural Networks & Complex Data Mining', arName: 'ماجستير العلوم في الشبكات العصبية البيانية والتنقيب في البيانات المعقدة', level: 'ماجستير العلوم (M.S.)' }
    ]
  },
  'Full-Stack Software Engineering': {
    categoryName: 'هندسة البرمجيات وتطوير تطبيقات الويب المتكاملة',
    partner: 'أكاديمية هندسة البرمجيات والأنظمة الحديثة',
    crawledSource: 'المجلس الأكاديمي لهندسة البرمجيات',
    topics: [
      { name: 'M.S. in Modern Full-Stack Systems & High-Velocity Architecture', arName: 'ماجستير العلوم في النظم المتكاملة الحديثة والمعماريات فائقة السرعة', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Software Engineering & Web Application Development', arName: 'بكالوريوس العلوم في هندسة البرمجيات وتطوير تطبيقات الويب', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Mobile Operating Systems & Cross-Platform Engineering', arName: 'ماجستير العلوم في أنظمة تشغيل الهواتف والهندسة متعددة المنصات', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Front-End Engineering & Advanced UI/UX Frameworks', arName: 'بكالوريوس العلوم في هندسة الواجهات الأمامية وأطر تجربة المستخدم المتقدمة', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Microservices, GraphQL & Event-Driven APIs', arName: 'ماجستير العلوم في الخدمات المصغرة وواجهات البرمجة المعتمدة على الأحداث', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Back-End Engineering with Node.js, Go & Rust', arName: 'بكالوريوس العلوم في هندسة الواجهات الخلفية باستخدام Node.js و Go و Rust', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Software Testing, Automation & Formal Verification', arName: 'ماجستير العلوم في اختبار البرمجيات والأتمتة والتحقق الرياضي الشكلي', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Human-Computer Interaction & Interactive Design', arName: 'بكالوريوس العلوم في التفاعل بين الإنسان والحاسوب والتصميم التفاعلي', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Progressive Web Apps & WebAssembly Engineering', arName: 'ماجستير العلوم في تطبيقات الويب التقدمية وهندسة WebAssembly', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Object-Oriented Design & Clean Code Architecture', arName: 'بكالوريوس العلوم في التصميم كائني التوجه ومعمارية الكود النظيف', level: 'بكالوريوس العلوم (B.S.)' }
    ]
  },
  'Robotics, Embodied AI & IoT': {
    categoryName: 'الروبوتات والذكاء الاصطناعي المجسد وإنترنت الأشياء',
    partner: 'معهد الروبوتات والميكاترونكس الذكية',
    crawledSource: 'المجلس الأكاديمي للروبوتات والأتمتة',
    topics: [
      { name: 'M.S. in Embodied Robotics & Autonomous Navigation (SLAM)', arName: 'ماجستير الهندسة في الروبوتات المجسدة والملاحة الذاتية (SLAM)', level: 'ماجستير الهندسة (M.Eng.)' },
      { name: 'B.S. in Mechatronics & Robotics Systems Engineering', arName: 'بكالوريوس الهندسة في الميكاترونكس وهندسة النظم الروبوتية', level: 'بكالوريوس الهندسة (B.Eng.)' },
      { name: 'Ph.D. in Kinematic Control & Humanoid Bipedal Dynamics', arName: 'دكتوراه الفلسفة في التحكم الحركي وديناميكيات المشي ثنائي الأرجل', level: 'درجة الدكتوراه (Ph.D.)' },
      { name: 'M.S. in Industrial Automation & Physical AI Twin Systems', arName: 'ماجستير الهندسة في الأتمتة الصناعية وأنظمة التوائم الرقمية الفيزيائية', level: 'ماجستير الهندسة (M.Eng.)' },
      { name: 'B.S. in IoT Hardware Engineering & Embedded Sensors', arName: 'بكالوريوس العلوم في عتاد إنترنت الأشياء وهندسة الحساسات المدمجة', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Drone Flight Dynamics & Autonomous Aerial Swarms', arName: 'ماجستير العلوم في ديناميكيات طيران المسيرات وأسراب الطيران الذاتي', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Microcontroller Programming & RTOS Engineering', arName: 'بكالوريوس العلوم في برمجة المتحكمات الدقيقة وأنظمة التشغيل اللحظية (RTOS)', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Robotic Perception, Lidar & Sensor Fusion', arName: 'ماجستير العلوم في الإدراك الروبوتي ودمج حساسات الليدار', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Computer Integrated Manufacturing & CAD Automation', arName: 'بكالوريوس العلوم في التصنيع المتكامل حاسوبياً وأتمتة التصميم CAD', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Bionic Prosthetics & Neural Engineering Interfaces', arName: 'ماجستير العلوم في الأطراف الصناعية الإلكترونية والواجهات العصبية', level: 'ماجستير العلوم (M.S.)' }
    ]
  },
  'Quantum Computing & Theoretical Physics': {
    categoryName: 'الحوسبة الكمية والفيزياء النظرية والمعلوماتية',
    partner: 'معهد أبحاث الفيزياء والحوسبة الكمية المتقدمة',
    crawledSource: 'المبادرة الأكاديمية للعلوم الكمية',
    topics: [
      { name: 'M.S. in Quantum Information Science & Quantum Algorithms', arName: 'ماجستير العلوم في علوم المعلومات الكمية والخوارزميات المتقدمة', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Quantum Physics & Computational Mechanics', arName: 'بكالوريوس العلوم في الفيزياء الكمية والميكانيكا الحاسوبية', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'Ph.D. in Fault-Tolerant Quantum Error Correction', arName: 'دكتوراه الفلسفة في تصحيح الأخطاء الكمية المتسامحة مع الأعطال', level: 'درجة الدكتوراه (Ph.D.)' },
      { name: 'M.S. in Quantum Hardware, Qubits & Cryogenic Systems', arName: 'ماجستير العلوم في عتاد الكم والكيوبت والأنظمة فائق التبريد', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Applied Mathematics & Quantum Computing Basics', arName: 'بكالوريوس العلوم في الرياضيات التطبيقية وأساسيات الحوسبة الكمية', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Quantum Error Correction & Fault-Tolerant AI', arName: 'ماجستير العلوم في تصحيح الأخطاء الكمية والذكاء الاصطناعي المقاوم للأعطال', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Mathematical Physics & Linear Algebra Systems', arName: 'بكالوريوس العلوم في الفيزياء الرياضية وأنظمة الجبر الخطي', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Quantum Cryptography & Key Distribution Networks', arName: 'ماجستير العلوم في التشفير الكمي وشبكات توزيع المفاتيح الكمية (QKD)', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in High-Energy Physics & Particle Simulations', arName: 'بكالوريوس العلوم في فيزياء الطاقة العالية ومحاكاة الجسيمات', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'Post-Doc Fellowship in Quantum Tensor Networks & Topological Physics', arName: 'زمالة أبحاث ما بعد الدكتوراه في شبكات الموترات الكمية والفيزياء الطوبولوجية', level: 'أبحاث ما بعد الدكتوراه' }
    ]
  },
  'FinTech, Blockchain & Quantitative Finance': {
    categoryName: 'التكنولوجيا المالية والبلوكشين والتمويل الكمي',
    partner: 'معهد التكنولوجيا المالية والأسواق الكمية',
    crawledSource: 'المجلس الأكاديمي للهندسة المالية',
    topics: [
      { name: 'M.S. in Quantitative Finance & Algorithmic Trading Engines', arName: 'ماجستير العلوم في التمويل الكمي ومحركات التداول الخوارزمي', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Financial Engineering & Risk Analytics', arName: 'بكالوريوس العلوم في الهندسة المالية وتحليلات المخاطر', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'Ph.D. in Stochastic Volatility & High-Frequency Market Microstructure', arName: 'دكتوراه الفلسفة في التقلب العشوائي وهندسة الأسواق فائقة التردد', level: 'درجة الدكتوراه (Ph.D.)' },
      { name: 'M.S. in Decentralized Finance (DeFi) & Smart Contracts', arName: 'ماجستير العلوم في التمويل اللامركزي (DeFi) والعقود الذكية', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Blockchain Development & Distributed Ledgers', arName: 'بكالوريوس العلوم في تطوير البلوكشين وسجلات الحسابات الموزعة', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Computational Financial Modeling & Stochastic Calculi', arName: 'ماجستير العلوم في النمذجة المالية الحاسوبية وحساب التفاضل والتكامل العشوائي', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in FinTech Product Architecture & Digital Payments', arName: 'بكالوريوس العلوم في معمارية منتجات التكنولوجيا المالية والمدفوعات الرقمية', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in High-Frequency Trading & Market Microstructure', arName: 'ماجستير العلوم في التداول عالي التردد والبنية الدقيقة للأسواق', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Corporate Financial Analytics & Portfolio Science', arName: 'بكالوريوس العلوم في التحليلات المالية للشركات وعلوم المحافظ الاستثمارية', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in AI in Asset Management & Automated Risk Control', arName: 'ماجستير العلوم في الذكاء الاصطناعي لإدارة الأصول والتحكم الآلي بالمخاطر', level: 'ماجستير العلوم (M.S.)' }
    ]
  },
  'Bioinformatics & Digital Healthcare Technology': {
    categoryName: 'المعلوماتية الحيوية وتكنولوجيا الرعاية الصحية الرقمية',
    partner: 'كلية التكنولوجيا الطبية والمعلوماتية الحيوية',
    crawledSource: 'المجلس الأكاديمي للطب الحاسوبي',
    topics: [
      { name: 'M.S. in Computational Biology & Genomic Data Science', arName: 'ماجستير العلوم في الأحياء الحاسوبية وعلوم البيانات الجينومية', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Health Informatics & Electronic Medical Records', arName: 'بكالوريوس العلوم في المعلوماتية الصحية والسجلات الطبية الإلكترونية', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'Ph.D. in Generative AI for Molecular Protein Folding', arName: 'دكتوراه الفلسفة في الذكاء الاصطناعي التوليدي لطي البروتينات الجزيئية', level: 'درجة الدكتوراه (Ph.D.)' },
      { name: 'M.S. in AI Medical Imaging & Diagnostic Computer Vision', arName: 'ماجستير العلوم في التصوير الطبي بالذكاء الاصطناعي والرؤية التشخيصية الحاسوبية', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Digital Health Technologies & Wearable Devices', arName: 'بكالوريوس العلوم في تقنيات الصحة الرقمية والأجهزة الطبية القابلة للارتداء', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Drug Discovery with Generative AI & Protein Folding', arName: 'ماجستير العلوم في اكتشاف الأدوية بالذكاء الاصطناعي التوليدي', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Biomedical Engineering Systems & Signal Analysis', arName: 'بكالوريوس العلوم في هندسة النظم الطبية الحيوية وتحليل الإشارات الحيوية', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Precision Medicine & Clinical Trial Data Science', arName: 'ماجستير العلوم في الطب الدقيق وعلوم بيانات التجارب السريرية', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Medical Software Compliance & HIPAA Security', arName: 'بكالوريوس العلوم في الامتثال للبرمجيات الطبية ومعايير أمان HIPAA', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Neuroscience & Brain-Computer Interface Systems', arName: 'ماجستير العلوم في علوم الأعصاب وأنظمة الواجهات الدماغية الحاسوبية (BCI)', level: 'ماجستير العلوم (M.S.)' }
    ]
  },
  'AI Product Leadership & Digital Business': {
    categoryName: 'قيادة منتجات الذكاء الاصطناعي والأعمال الرقمية',
    partner: 'كلية إدارة التكنولوجيا والقيادة الرقمية',
    crawledSource: 'المجلس الأكاديمي لإدارة التقنيات الحديثة',
    topics: [
      { name: 'M.S. in AI Product Management & Enterprise Strategy', arName: 'ماجستير العلوم في إدارة منتجات الذكاء الاصطناعي والاستراتيجية المؤسسية', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Business Information Systems & Digital Leadership', arName: 'بكالوريوس العلوم في نظم المعلومات الإدارية والقيادة الرقمية', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'Ph.D. in Technological Disruption & Global Innovation Governance', arName: 'دكتوراه الفلسفة في التحولات التكنولوجية الجذرية وحوكمة الابتكار العالمي', level: 'درجة الدكتوراه (Ph.D.)' },
      { name: 'M.S. in Technology Operations & Digital Transformation', arName: 'ماجستير العلوم في العمليات التكنولوجية والتحول الرقمي الشامل', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Agility, Scrum & Product Lifecycle Engineering', arName: 'بكالوريوس العلوم في منهجيات أجايل وإدارة دورة حياة المنتجات الرقمية', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Tech Entrepreneurship & Venture Architecture', arName: 'ماجستير العلوم في ريادة الأعمال التقنية وبناء المشاريع الابتكارية', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in E-Commerce Engineering & Growth Analytics', arName: 'بكالوريوس العلوم في هندسة التجارة الإلكترونية وتحليلات النمو الرقمي', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in AI Ethics, Technology Governance & Policy', arName: 'ماجستير العلوم في أخلاقيات الذكاء الاصطناعي وحوكمة السياسات التقنية', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Digital Marketing Analytics & MarTech Systems', arName: 'بكالوريوس العلوم في تحليلات التسويق الرقمي وأنظمة تكنولوجيا التسويق', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Supply Chain Optimization & AI Logistics', arName: 'ماجستير العلوم في تحسين سلاسل الإمداد والخدمات اللوجستية بالذكاء الاصطناعي', level: 'ماجستير العلوم (M.S.)' }
    ]
  },
  'Space Systems, Aerospace & Orbital Mechanics': {
    categoryName: 'أنظمة الفضاء وهندسة الطيران والميكانيكا المدارية',
    partner: 'معهد علوم وهندسة الفضاء والطيران',
    crawledSource: 'المجلس الأكاديمي لعلوم الفضاء والفلك',
    topics: [
      { name: 'M.S. in Orbital Mechanics & Space Mission Systems', arName: 'ماجستير العلوم في الميكانيكا المدارية وأنظمة المهمات الفضائية', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Aerospace Systems & Propulsion Engineering', arName: 'بكالوريوس الهندسة في أنظمة الطيران وهندسة الدفع الصاروخي', level: 'بكالوريوس الهندسة (B.Eng.)' },
      { name: 'M.S. in Satellite Constellations & CubeSat Telemetry', arName: 'ماجستير العلوم في كوكبات الأقمار الصناعية وقياسات الأقمار المكعبة (CubeSat)', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Spacecraft Avionics & Flight Control Software', arName: 'بكالوريوس العلوم في إلكترونيات الطيران الفضائي وبرمجيات التحكم في الطيران', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'Ph.D. in Autonomous Deep Space Navigation & Guidance Systems', arName: 'دكتوراه الفلسفة في الملاحة الفضائية العميقة المستقلة وأنظمة التوجيه', level: 'درجة الدكتوراه (Ph.D.)' },
      { name: 'M.S. in Rocket Propulsion & Combustion Dynamics', arName: 'ماجستير العلوم في دفع الصواريخ وديناميكيات الاحتراق المتقدمة', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Atmospheric Aerodynamics & Hypersonic Systems', arName: 'بكالوريوس العلوم في الديناميكا الهوائية الجوية والأنظمة فرط الصوتية', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Space Environment Engineering & Thermal Control', arName: 'ماجستير العلوم في هندسة البيئة الفضائية والتحكم الحراري', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Remote Sensing & Earth Observation Analytics', arName: 'بكالوريوس العلوم في الاستشعار عن بعد وتحليلات رصد الأرض', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'Post-Doc Fellowship in Interplanetary Trajectory Optimization', arName: 'زمالة أبحاث ما بعد الدكتوراه في تحسين المسارات الكوكبية', level: 'أبحاث ما بعد الدكتوراه' }
    ]
  },
  'Renewable Energy & Climate Engineering': {
    categoryName: 'الطاقة المتجددة وهندسة المناخ والاستدامة',
    partner: 'كلية الاستدامة وهندسة الطاقة النظيفة',
    crawledSource: 'المجلس الأكاديمي للطاقة المتجددة وهندسة البيئة',
    topics: [
      { name: 'M.S. in Smart Grid Architecture & Energy Storage Systems', arName: 'ماجستير العلوم في معمارية الشبكات الذكية وأنظمة تخزين الطاقة', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Sustainable Energy Engineering & Solar Photovoltaics', arName: 'بكالوريوس العلوم في هندسة الطاقة المستدامة والخلايا الكهروضوئية', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Hydrogen Fuel Cells & Clean Energy Technology', arName: 'ماجستير العلوم في خلايا وقود الهيدروجين وتكنولوجيا الطاقة النظيفة', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Wind Turbine Aerodynamics & Off-Grid Networks', arName: 'بكالوريوس العلوم في ديناميكا توربينات الرياح والشبكات المنفصلة', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'Ph.D. in Computational Climate Modeling & Carbon Capture', arName: 'دكتوراه الفلسفة في النمذجة المناخية الحاسوبية واحتجاز الكربون', level: 'درجة الدكتوراه (Ph.D.)' },
      { name: 'M.S. in Environmental Data Analytics & Resource Optimization', arName: 'ماجستير العلوم في تحليلات البيانات البيئية وتحسين الموارد', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Electric Vehicle Infrastructure & Battery Systems', arName: 'بكالوريوس العلوم في البنية التحتية للمركبات الكهربائية وأنظمة البطاريات', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Circular Economy & Life Cycle Assessment Systems', arName: 'ماجستير العلوم في الاقتصاد الدائري وتقييم دورة الحياة', level: 'ماجستير العلوم (M.S.)' },
      { name: 'B.S. in Green Building Automation & Energy Auditing', arName: 'بكالوريوس العلوم في أتمتة المباني الخضراء والتدقيق الطاقي', level: 'بكالوريوس العلوم (B.S.)' },
      { name: 'M.S. in Climate Policy, Carbon Markets & CleanTech Economics', arName: 'ماجستير العلوم في سياسات المناخ وأسواق الكربون واقتصاديات التكنولوجيا النظيفة', level: 'ماجستير العلوم (M.S.)' }
    ]
  }
};

/**
 * Helper to get a translated UI string
 */
export function getTranslation(lang: LanguageCode = 'en') {
  return translations[lang] || translations.en;
}

/**
 * Universal text localizer with comprehensive academic dictionary and heuristic fallback
 */
export function localizeText(text: string, lang: LanguageCode = 'en'): string {
  if (lang !== 'ar' || !text) return text;
  const arDict = translations.ar;
  if (arDict[text]) return arDict[text];

  // Comprehensive academic domain and phrase dictionary
  const phraseMap: Record<string, string> = {
    'All Categories': 'جميع التخصصات',
    'All Levels': 'كافة المستويات',
    'Beginner': 'مبتدئ',
    'Intermediate': 'متوسط',
    'Advanced': 'متقدم',
    'Expert': 'خبير',
    'Computer Science': 'علوم الحاسوب',
    'Artificial Intelligence': 'الذكاء الاصطناعي',
    'Cybersecurity': 'الأمن السيبراني',
    'Mathematics': 'الرياضيات',
    'Quantum Computing': 'الحوسبة الكمية',
    'Software Engineering': 'هندسة البرمجيات',
    'Data Science': 'علوم البيانات',
    'Bioinformatics': 'المعلوماتية الحيوية',
    'Robotics': 'الروبوتات',
    'Cloud Systems': 'الأنظمة السحابية',
    'Distributed Systems': 'الأنظمة الموزعة',
    'Full-Stack Development': 'تطوير الويب المتكامل',
    'Master of Science (M.S.)': 'ماجستير العلوم (M.S.)',
    'Bachelor of Science (B.S.)': 'بكالوريوس العلوم (B.S.)',
    'Bachelor of Engineering (B.Eng.)': 'بكالوريوس الهندسة (B.Eng.)',
    'Master of Engineering (M.Eng.)': 'ماجستير الهندسة (M.Eng.)',
    'Ph.D. Doctorate': 'درجة الدكتوراه (Ph.D.)',
    'Post-Doctoral Research': 'أبحاث ما بعد الدكتوراه',
    'Executive Diploma': 'دبلوم تنفيذي متخصص',
    'Postgraduate Certificate': 'شهادة دراسات عليا معتمدة',
    'Physics & Deep Tech': 'الفيزياء والتقنيات العميقة',
    'Business & Management': 'الأعمال والقيادة الإدارية',
    'Cyber Security & Cryptography': 'الأمن السيبراني وعلم التشفير',
    'Bioinformatics & Healthcare AI': 'المعلوماتية الحيوية والذكاء الاصطناعي الطبي',
    'Cloud Engineering & Systems': 'هندسة النظم السحابية والموزعة',
    'Data Science & Applied Mathematics': 'علوم البيانات والرياضيات التطبيقية',
    'Artificial Intelligence & Deep Learning': 'الذكاء الاصطناعي والتعلم العميق',
    'Industrial Health & Workspace Safety': 'السلامة العامة والصحة المهنية',
    'Architectures: Multi-Agent Systems': 'معماريات الأنظمة متعددة الوكلاء',
    'Architectures: Multi-Agent Systems Course': 'دورة معماريات الأنظمة متعددة الوكلاء',
    'Anatomy of an AI Agent': 'تشريح هيكلية الوكيل الذكي',
    'Quantum Physics: Qubit State': 'الفيزياء الكمية: حالة الكيوبت',
    'Low-Latency Communication': 'الاتصالات منخفضة التأخير',
    'Standard Syllabus': 'المنهج القياسي',
    'Prerequisite Booster': 'تعزيز علاجي للمتطلبات',
    'Adaptive Learning Path Engine': 'محرك مسار التعلم التكيفي الذكي',
    'ON TRACK • STANDARD PATH': 'على المسار الموصى به • مسار مستقر',
    'Optimized Adaptive Lesson Queue': 'قائمة الدروس المحسنة تكيفياً',
    'Auto-reordered for maximum retention': 'ترتيب تلقائي لتعظيم استبقاء المعرفة',
    'Remedial Reinforcement Active (<70%)': 'تعزيز علاجي نشط (<70%)',
    'Mastery Average': 'معدل الإتقان العام',
    'Recalculate': 'تحديث المسار',
    'Identified Knowledge Gaps Requiring Remediation': 'فجوات معرفية تم رصدها تتطلب تدعيماً علاجياً',
    'booster(s) prioritized': 'تدريب(ات) تعزيزية ذات أولوية',
    'Score:': 'الدرجة:',
    'min drill': 'دقيقة تدريب',
    'Launch Booster': 'بدء التدريب المعزز',
    'Socratic Focus:': 'التركيز السقراطي:',
    'Adaptive Level:': 'المستوى التكيفي:',
    'AI Content Recommendation Engine': 'محرك التوصيات المحتوى الذكي بالذكاء الاصطناعي',
    'AI Recommendations': 'التوصيات الأكاديمية الذكية',
    'Personalized Recommendations': 'توصيات مخصصة لك',
    'Analyzes student progress, stated interests, and performance': 'تحليل تقدم الطالب والاهتمامات والأداء الأكاديمي',
    'Refresh AI Analysis': 'تحديث التحليل الذكي',
    'All Recommendations': 'جميع التوصيات',
    'Modules & Boosters': 'الوحدات والتعزيزات',
    'Research & External': 'الأبحاث والمصادر الخارجية',
    'Practice Drills': 'التدريبات المخصصة',
    'Match': 'تطابق',
    'Read Resource': 'قراءة المصدر',
    'Launch Drill': 'بدء التدريب',
    'Enroll Now': 'التسجيل الآن',
    'Bookmark': 'حفظ التوصية',
    'Gamification & Leaderboard': 'منصة التحفيز والوسامات ولوحة الصدارة',
    'Gamification Hub': 'مركز التحفيز والوسامات',
    'Points & Level Progress': 'النقاط وتقدم المستوى',
    'Badges & Achievements': 'الوسامات والإنجازات',
    'Academic Leaderboard': 'لوحة الصدارة الأكاديمية',
    'Weekly Cohort': 'الدفعة الأسبوعية',
    'Global All-Time': 'التصنيف العالمي',
    'Specialty Major': 'التخصص الأكاديمي',
    'Current Streak': 'سلسلة المتابعة الحالية',
    'Multiplier Active': 'مضاعف النقاط نشط',
    'Next Level': 'المستوى التالي',
    'XP Points': 'نقاط الخبرة XP',
    'Unlocked': 'مفتوح',
    'Locked': 'مغلق',
    'Unlocked on': 'تم الفتح في',
    'Challenge Peer': 'تحدَّ زميلاً',
    'Claim Bonus': 'استلام مكافأة اليوم',
    'Your Position': 'ترتيبك الحالي',
  };

  if (phraseMap[text]) return phraseMap[text];

  // Heuristic translation matching
  for (const [enKey, arVal] of Object.entries(phraseMap)) {
    if (text.toLowerCase() === enKey.toLowerCase()) return arVal;
  }

  return text;
}

/**
 * Localizes a single Course object into the active language
 */
export function getLocalizedCourse(course: Course, lang: LanguageCode = 'en'): Course {
  if (lang !== 'ar' || !course) return course;

  const arData = ARABIC_COURSES_MAP[course.id];
  if (!arData) {
    // Dynamic category and metadata translation fallback
    return {
      ...course,
      category: localizeText(course.category, lang),
      level: course.level,
      tags: course.tags?.map(t => localizeText(t, lang)) || course.tags,
    };
  }

  return {
    ...course,
    title: arData.title || course.title,
    description: arData.description || course.description,
    category: arData.category || localizeText(course.category, lang),
    level: arData.level || course.level,
    author: arData.author || course.author,
    tags: arData.tags || course.tags?.map(t => localizeText(t, lang)) || course.tags,
    modules: arData.modules || course.modules,
  };
}

/**
 * Localizes a list of courses
 */
export function getLocalizedCourses(courses: Course[], lang: LanguageCode = 'en'): Course[] {
  if (lang !== 'ar' || !courses) return courses;
  return courses.map(c => getLocalizedCourse(c, lang));
}

/**
 * Localizes a degree program entity
 */
export function getLocalizedDegree(degree: any, lang: LanguageCode = 'en'): any {
  if (lang !== 'ar' || !degree) return degree;

  const categoryMap = ARABIC_DEGREES_MAP[degree.category];
  const localizedCategory = categoryMap?.categoryName || localizeText(degree.category, lang);
  const localizedLevel = localizeText(degree.degreeMetadata?.degreeLevel || degree.level || '', lang);

  // Check if topic name has an Arabic equivalent in the catalog
  let localizedTitle = degree.title;
  if (categoryMap?.topics) {
    const matchedTopic = categoryMap.topics.find((t: any) =>
      t.name.toLowerCase() === degree.title.toLowerCase() ||
      degree.title.toLowerCase().includes(t.name.toLowerCase()) ||
      (t.arName && t.name.toLowerCase() === degree.title.toLowerCase())
    );
    if (matchedTopic) {
      localizedTitle = matchedTopic.arName || matchedTopic.name;
    }
  }

  return {
    ...degree,
    title: localizedTitle,
    category: localizedCategory,
    level: localizedLevel,
    degreeMetadata: degree.degreeMetadata ? {
      ...degree.degreeMetadata,
      degreeLevel: localizedLevel,
      institution: categoryMap?.partner || degree.degreeMetadata.institution,
      crawledSource: categoryMap?.crawledSource || degree.degreeMetadata.crawledSource,
      tracks: degree.degreeMetadata.tracks?.map((tr: string) => localizeText(tr, lang)) || degree.degreeMetadata.tracks,
    } : undefined,
  };
}

/**
 * Localizes an array of degree programs
 */
export function getLocalizedDegrees(degrees: any[], lang: LanguageCode = 'en'): any[] {
  if (lang !== 'ar' || !degrees) return degrees;
  return degrees.map(d => getLocalizedDegree(d, lang));
}
