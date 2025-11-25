import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  fr: { translation: {
    header: { title: 'Uniconvert', account: 'Mon compte', login: 'Connexion', pricing: 'Tarifs', remaining: '{{count}} conversion(s) restante(s)' },
    hero: { title: 'Convertissez vos fichiers en un clic', subtitle: 'Conversion universelle de documents, images, audio et vidéos. Rapide, sécurisé et sans inscription pour votre premier essai.' },
    upload: { drop: 'Glissez-déposez votre fichier ici', browse: 'cliquez pour parcourir', chooseFile: 'Choisir un fichier', progress: 'Téléversement en cours... {{percent}}%', success: 'Fichier uploadé avec succès : {{name}}', supported: 'Formats supportés : Documents, Images, Audio, Vidéo', maxSize: 'Taille maximale : 50MB' },
    convert: { successTitle: 'Conversion réussie !', successText: 'Votre fichier a été converti de {{from}} vers {{to}}', download: 'Télécharger le fichier', another: 'Convertir un autre fichier', chooseFormat: 'Choisir le format de destination', selectFormat: 'Sélectionner un format', button: 'Convertir le fichier', converting: 'Conversion en cours...', sizeOriginal: 'Taille originale :', sizeConverted: 'Taille convertie :', title: 'Convertir votre fichier', currentFormatLabel: 'Format actuel :' },
    category: { document: 'Document', image: 'Image', audio: 'Audio', video: 'Vidéo', file: 'Fichier' },
    app: { comingSoon: 'Bientôt disponible' },
    limit: { title: 'Limite de conversions atteinte', text: 'Vous avez atteint votre limite de {{limit}} conversion(s) gratuite(s). Passez à un plan Pro pour des conversions illimitées.', viewPricing: 'Voir les tarifs', cancel: 'Annuler' },
    features: { fastTitle: 'Rapide & Efficace', fastDesc: 'Conversion instantanée avec des serveurs optimisés pour des performances maximales.', secureTitle: 'Sécurisé', secureDesc: 'Vos fichiers sont traités de manière sécurisée et supprimés automatiquement après conversion.', universalTitle: 'Universel', universalDesc: 'Support de plus de 50 formats différents : documents, images, audio, vidéo et archives.' },
    footer: { copyright: '© 2024 Uniconvert. Tous droits réservés.' },
    pricing: { choosePlan: 'Choisissez votre plan', monthly: 'Mensuel', yearly: 'Annuel', backHome: "Retour à l'accueil", popular: 'Populaire', faq: 'Questions fréquentes', save20: 'Économisez 20%', stripeSimulation: 'Simulation Stripe', billedYearly: 'Facturé {{amount}} annuellement' },
    plan: {
      free: { name: 'Gratuit', period: 'à vie', description: 'Parfait pour essayer notre service', button: 'Commencer gratuitement', features: { daily: '1 conversion par jour', basicFormats: 'Formats de base', max50: 'Taille maximale 50MB', emailSupport: 'Support par email' } },
      pro: { name: 'Pro', period: 'mois', description: 'Idéal pour les utilisateurs réguliers', button: "Commencer la période d'essai", features: { unlimited: 'Conversions illimitées', allFormats: 'Tous les formats supportés', max500: 'Taille maximale 500MB', prioritySupport: 'Support prioritaire', batch: 'Conversions par lot', api: "API d'accès" } },
      premium: { name: 'Premium', period: 'mois', description: 'Pour les professionnels et les équipes', button: 'Contactez-nous', features: { unlimited: 'Conversions illimitées', allFormats: 'Tous les formats supportés', max2g: 'Taille maximale 2GB', priority247: 'Support prioritaire 24/7', advancedBatch: 'Conversions par lot avancées', fullApi: 'API complète', team: "Comptes d'équipe", analytics: 'Analytiques détaillées' } }
    },
    video: { quality: 'Qualité vidéo', low: 'Bas', medium: 'Moyen', high: 'Élevé' },
    pdf: { page: 'Page', scale: 'Échelle', pageRange: 'Plage de pages', exampleRange: '(ex: 1-3,5)', placeholderAll: 'Toutes si vide' },
    auth: { signIn: 'Se connecter', signUp: 'Créer un compte', createAccount: 'Créer le compte', noAccountQuestion: 'Pas de compte ? ', alreadyRegisteredQuestion: 'Déjà inscrit ? ' },
    account: { title: 'Mon compte', email: 'Email', plan: 'Plan', conversionsUsed: 'Conversions utilisées', unlimited: 'Illimité', changePlan: 'Changer de plan', logout: 'Se déconnecter' },
    form: { name: 'Nom', email: 'Email', password: 'Mot de passe' },
    errors: { generic: 'Erreur', upload: 'Erreur lors de l\'upload', convert: 'Erreur lors de la conversion', fetchFormats: 'Erreur lors de la récupération des formats' },
    
    common: { empty: 'Vide' },
    download: { defaultName: 'fichier-converti' },
    units: { bytes: 'octets', kb: 'Ko', mb: 'Mo', gb: 'Go' },
    faq: {
      q1: { title: 'Quels formats de fichiers sont supportés ?', body: 'Nous supportons plus de 50 formats différents incluant PDF, DOC, JPG, PNG, MP4, MP3 et bien plus encore.' },
      q2: { title: 'Mes fichiers sont-ils sécurisés ?', body: 'Oui, tous les fichiers sont chiffrés pendant le transfert et supprimés automatiquement après 1 heure.' },
      q3: { title: 'Puis-je convertir plusieurs fichiers à la fois ?', body: 'Oui, les utilisateurs Pro et Premium peuvent convertir plusieurs fichiers simultanément avec notre fonction de conversion par lot.' },
      q4: { title: 'Comment puis-je annuler mon abonnement ?', body: 'Vous pouvez annuler votre abonnement à tout moment depuis votre page de compte. L\'annulation prend effet à la fin de la période de facturation.' }
    }
  } },
  en: { translation: {
    header: { title: 'Uniconvert', account: 'My account', login: 'Sign in', pricing: 'Pricing', remaining: '{{count}} conversion(s) left' },
    hero: { title: 'Convert your files in one click', subtitle: 'Universal conversion for documents, images, audio and videos. Fast, secure, and no sign-up for your first try.' },
    upload: { drop: 'Drag & drop your file here', browse: 'click to browse', chooseFile: 'Choose a file', progress: 'Uploading... {{percent}}%', success: 'File uploaded successfully: {{name}}', supported: 'Supported formats: Documents, Images, Audio, Video', maxSize: 'Max size: 50MB' },
    convert: { successTitle: 'Conversion successful!', successText: 'Your file was converted from {{from}} to {{to}}', download: 'Download file', another: 'Convert another file', chooseFormat: 'Choose destination format', selectFormat: 'Select a format', button: 'Convert file', converting: 'Converting...', sizeOriginal: 'Original size:', sizeConverted: 'Converted size:', title: 'Convert your file', currentFormatLabel: 'Current format:' },
    category: { document: 'Document', image: 'Image', audio: 'Audio', video: 'Video', file: 'File' },
    app: { comingSoon: 'Coming Soon' },
    limit: { title: 'Conversion limit reached', text: 'You have reached your limit of {{limit}} free conversion(s). Upgrade to Pro for unlimited conversions.', viewPricing: 'View pricing', cancel: 'Cancel' },
    features: { fastTitle: 'Fast & Efficient', fastDesc: 'Instant conversion with servers optimized for maximum performance.', secureTitle: 'Secure', secureDesc: 'Your files are processed securely and automatically deleted after conversion.', universalTitle: 'Universal', universalDesc: 'Support for 50+ formats: documents, images, audio, video and archives.' },
    footer: { copyright: '© 2024 Uniconvert. All rights reserved.' },
    pricing: { choosePlan: 'Choose your plan', monthly: 'Monthly', yearly: 'Yearly', backHome: 'Back to home', popular: 'Popular', faq: 'Frequently asked questions', save20: 'Save 20%', stripeSimulation: 'Stripe simulation', billedYearly: 'Billed {{amount}} yearly' },
    plan: {
      free: { name: 'Free', period: 'forever', description: 'Perfect to try our service', button: 'Start for free', features: { daily: '1 conversion per day', basicFormats: 'Basic formats', max50: 'Max size 50MB', emailSupport: 'Email support' } },
      pro: { name: 'Pro', period: 'month', description: 'Ideal for regular users', button: 'Start trial', features: { unlimited: 'Unlimited conversions', allFormats: 'All formats supported', max500: 'Max size 500MB', prioritySupport: 'Priority support', batch: 'Batch conversions', api: 'API access' } },
      premium: { name: 'Premium', period: 'month', description: 'For professionals and teams', button: 'Contact us', features: { unlimited: 'Unlimited conversions', allFormats: 'All formats supported', max2g: 'Max size 2GB', priority247: 'Priority support 24/7', advancedBatch: 'Advanced batch conversions', fullApi: 'Full API', team: 'Team accounts', analytics: 'Detailed analytics' } }
    },
    video: { quality: 'Video quality', low: 'Low', medium: 'Medium', high: 'High' },
    pdf: { page: 'Page', scale: 'Scale', pageRange: 'Page range', exampleRange: '(e.g., 1-3,5)', placeholderAll: 'All if empty' },
    auth: { signIn: 'Sign in', signUp: 'Sign up', createAccount: 'Create account', noAccountQuestion: 'No account? ', alreadyRegisteredQuestion: 'Already registered? ' },
    account: { title: 'My account', email: 'Email', plan: 'Plan', conversionsUsed: 'Conversions used', unlimited: 'Unlimited', changePlan: 'Change plan', logout: 'Log out' },
    form: { name: 'Name', email: 'Email', password: 'Password' },
    errors: { generic: 'Error', upload: 'Upload error', convert: 'Conversion error', fetchFormats: 'Error fetching formats' },
    
    common: { empty: 'Empty' },
    download: { defaultName: 'converted-file' },
    units: { bytes: 'bytes', kb: 'KB', mb: 'MB', gb: 'GB' },
    faq: {
      q1: { title: 'What file formats are supported?', body: 'We support over 50 different formats including PDF, DOC, JPG, PNG, MP4, MP3 and many more.' },
      q2: { title: 'Are my files secure?', body: 'Yes, all files are encrypted during transfer and automatically deleted after 1 hour.' },
      q3: { title: 'Can I convert multiple files at once?', body: 'Yes, Pro and Premium users can convert multiple files simultaneously with our batch conversion feature.' },
      q4: { title: 'How can I cancel my subscription?', body: 'You can cancel your subscription anytime from your account page. Cancellation takes effect at the end of the billing period.' }
    }
  } },
  es: { translation: {
    header: { title: 'Uniconvert', account: 'Mi cuenta', login: 'Iniciar sesión', pricing: 'Precios', remaining: '{{count}} conversión(es) restante(s)' },
    hero: { title: 'Convierte tus archivos con un clic', subtitle: 'Conversión universal de documentos, imágenes, audio y videos. Rápido, seguro y sin registro para tu primera prueba.' },
    upload: { drop: 'Arrastra y suelta tu archivo aquí', browse: 'haz clic para explorar', chooseFile: 'Elegir archivo', progress: 'Subiendo... {{percent}}%', success: 'Archivo subido con éxito: {{name}}', supported: 'Formatos soportados: Documentos, Imágenes, Audio, Vídeo', maxSize: 'Tamaño máximo: 50MB' },
    convert: { successTitle: '¡Conversión exitosa!', successText: 'Tu archivo se convirtió de {{from}} a {{to}}', download: 'Descargar archivo', another: 'Convertir otro archivo', chooseFormat: 'Elegir formato de destino', selectFormat: 'Seleccionar un formato', button: 'Convertir archivo', converting: 'Convirtiendo...', sizeOriginal: 'Tamaño original:', sizeConverted: 'Tamaño convertido:', title: 'Convertir tu archivo', currentFormatLabel: 'Formato actual:' },
    category: { document: 'Documento', image: 'Imagen', audio: 'Audio', video: 'Vídeo', file: 'Archivo' },
    limit: { title: 'Límite de conversiones alcanzado', text: 'Has alcanzado tu límite de {{limit}} conversión(es) gratuita(s). Actualiza a Pro para conversiones ilimitadas.', viewPricing: 'Ver precios', cancel: 'Cancelar' },
    features: { fastTitle: 'Rápido y eficiente', fastDesc: 'Conversión instantánea con servidores optimizados para máximo rendimiento.', secureTitle: 'Seguro', secureDesc: 'Tus archivos se procesan de forma segura y se eliminan automáticamente tras la conversión.', universalTitle: 'Universal', universalDesc: 'Soporte para más de 50 formatos: documentos, imágenes, audio, vídeo y archivos.' },
    footer: { copyright: '© 2024 Uniconvert. Todos los derechos reservados.' },
    pricing: { choosePlan: 'Elige tu plan', monthly: 'Mensual', yearly: 'Anual', backHome: 'Volver al inicio', popular: 'Popular', faq: 'Preguntas frecuentes', save20: 'Ahorra 20%', stripeSimulation: 'Simulación Stripe', billedYearly: 'Facturado {{amount}} anualmente' },
    plan: {
      free: { name: 'Gratis', period: 'para siempre', description: 'Perfecto para probar nuestro servicio', button: 'Comenzar gratis', features: { daily: '1 conversión por día', basicFormats: 'Formatos básicos', max50: 'Tamaño máximo 50MB', emailSupport: 'Soporte por email' } },
      pro: { name: 'Pro', period: 'mes', description: 'Ideal para usuarios regulares', button: 'Iniciar prueba', features: { unlimited: 'Conversiones ilimitadas', allFormats: 'Todos los formatos soportados', max500: 'Tamaño máximo 500MB', prioritySupport: 'Soporte prioritario', batch: 'Conversiones por lotes', api: 'Acceso a API' } },
      premium: { name: 'Premium', period: 'mes', description: 'Para profesionales y equipos', button: 'Contáctanos', features: { unlimited: 'Conversiones ilimitadas', allFormats: 'Todos los formatos soportados', max2g: 'Tamaño máximo 2GB', priority247: 'Soporte prioritario 24/7', advancedBatch: 'Conversiones por lotes avanzadas', fullApi: 'API completa', team: 'Cuentas de equipo', analytics: 'Analíticas detalladas' } }
    },
    video: { quality: 'Calidad de video', low: 'Bajo', medium: 'Medio', high: 'Alto' },
    pdf: { page: 'Página', scale: 'Escala', pageRange: 'Intervalo de páginas', exampleRange: '(ej.: 1-3,5)', placeholderAll: 'Todas si vacío' },
    auth: { signIn: 'Iniciar sesión', signUp: 'Crear cuenta', createAccount: 'Crear cuenta', noAccountQuestion: '¿Sin cuenta? ', alreadyRegisteredQuestion: '¿Ya registrado? ' },
    account: { title: 'Mi cuenta', email: 'Email', plan: 'Plan', conversionsUsed: 'Conversiones usadas', unlimited: 'Ilimitado', changePlan: 'Cambiar plan', logout: 'Cerrar sesión' },
    form: { name: 'Nombre', email: 'Email', password: 'Contraseña' },
    errors: { generic: 'Error', upload: 'Error al subir', convert: 'Error al convertir', fetchFormats: 'Error al obtener formatos' },
    
    common: { empty: 'Vacío' },
    download: { defaultName: 'archivo-convertido' },
    units: { bytes: 'bytes', kb: 'KB', mb: 'MB', gb: 'GB' },
    faq: {
      q1: { title: '¿Qué formatos de archivo son compatibles?', body: 'Soportamos más de 50 formatos diferentes incluyendo PDF, DOC, JPG, PNG, MP4, MP3 y muchos más.' },
      q2: { title: '¿Mis archivos son seguros?', body: 'Sí, todos los archivos están encriptados durante la transferencia y se eliminan automáticamente después de 1 hora.' },
      q3: { title: '¿Puedo convertir varios archivos a la vez?', body: 'Sí, los usuarios Pro y Premium pueden convertir varios archivos simultáneamente con nuestra función de conversión por lotes.' },
      q4: { title: '¿Cómo puedo cancelar mi suscripción?', body: 'Puedes cancelar tu suscripción en cualquier momento desde tu página de cuenta. La cancelación tiene efecto al final del período de facturación.' }
    }
  } },
  de: { translation: {
    header: { title: 'Uniconvert', account: 'Mein Konto', login: 'Anmelden', pricing: 'Preise', remaining: '{{count}} verbleibende Konvertierung(en)' },
    hero: { title: 'Konvertieren Sie Ihre Dateien mit einem Klick', subtitle: 'Universelle Konvertierung von Dokumenten, Bildern, Audio und Videos. Schnell, sicher und ohne Anmeldung.' },
    upload: { drop: 'Datei hierher ziehen und ablegen', browse: 'zum Durchsuchen klicken', chooseFile: 'Datei auswählen', progress: 'Hochladen... {{percent}}%', success: 'Datei erfolgreich hochgeladen: {{name}}', supported: 'Unterstützte Formate: Dokumente, Bilder, Audio, Video', maxSize: 'Maximale Größe: 50MB' },
    convert: { successTitle: 'Konvertierung erfolgreich!', successText: 'Ihre Datei wurde von {{from}} zu {{to}} konvertiert', download: 'Datei herunterladen', another: 'Weitere Datei konvertieren', chooseFormat: 'Zielformat wählen', selectFormat: 'Format auswählen', button: 'Datei konvertieren', converting: 'Konvertiere...', sizeOriginal: 'Originalgröße:', sizeConverted: 'Konvertierte Größe:', title: 'Konvertieren Sie Ihre Datei', currentFormatLabel: 'Aktuelles Format:' },
    category: { document: 'Dokument', image: 'Bild', audio: 'Audio', video: 'Video', file: 'Datei' },
    app: { comingSoon: 'Demnächst verfügbar' },
    limit: { title: 'Konvertierungslimit erreicht', text: 'Sie haben Ihr Limit von {{limit}} kostenloser Konvertierung(en) erreicht. Upgraden Sie auf Pro für unbegrenzte Konvertierungen.', viewPricing: 'Preise anzeigen', cancel: 'Abbrechen' },
    features: { fastTitle: 'Schnell & Effizient', fastDesc: 'Sofortige Konvertierung mit für maximale Leistung optimierten Servern.', secureTitle: 'Sicher', secureDesc: 'Ihre Dateien werden sicher verarbeitet und nach der Konvertierung automatisch gelöscht.', universalTitle: 'Universell', universalDesc: 'Unterstützung für über 50 Formate: Dokumente, Bilder, Audio, Video und Archive.' },
    footer: { copyright: '© 2024 Uniconvert. Alle Rechte vorbehalten.' },
    pricing: { choosePlan: 'Wählen Sie Ihren Plan', monthly: 'Monatlich', yearly: 'Jährlich', backHome: 'Zurück zur Startseite', popular: 'Beliebt', faq: 'Häufige Fragen', save20: 'Spare 20%', stripeSimulation: 'Stripe-Simulation', billedYearly: '{{amount}} jährlich abgerechnet' },
    plan: {
      free: { name: 'Kostenlos', period: 'für immer', description: 'Perfekt um unseren Service auszuprobieren', button: 'Kostenlos starten', features: { daily: '1 Konvertierung pro Tag', basicFormats: 'Grundlegende Formate', max50: 'Maximale Größe 50MB', emailSupport: 'E-Mail-Support' } },
      pro: { name: 'Pro', period: 'Monat', description: 'Ideal für reguläre Benutzer', button: 'Testzeitraum beginnen', features: { unlimited: 'Unbegrenzte Konvertierungen', allFormats: 'Alle Formate unterstützt', max500: 'Maximale Größe 500MB', prioritySupport: 'Priorisierter Support', batch: 'Stapelkonvertierungen', api: 'API-Zugriff' } },
      premium: { name: 'Premium', period: 'Monat', description: 'Für Profis und Teams', button: 'Kontaktieren Sie uns', features: { unlimited: 'Unbegrenzte Konvertierungen', allFormats: 'Alle Formate unterstützt', max2g: 'Maximale Größe 2GB', priority247: 'Priorisierter Support 24/7', advancedBatch: 'Erweiterte Stapelkonvertierungen', fullApi: 'Vollständige API', team: 'Team-Konten', analytics: 'Detaillierte Analysen' } }
    },
    video: { quality: 'Videoqualität', low: 'Niedrig', medium: 'Mittel', high: 'Hoch' },
    pdf: { page: 'Seite', scale: 'Maßstab', pageRange: 'Seitenbereich', exampleRange: '(z.B.: 1-3,5)', placeholderAll: 'Alle wenn leer' },
    auth: { signIn: 'Anmelden', signUp: 'Konto erstellen', createAccount: 'Konto erstellen', noAccountQuestion: 'Kein Konto? ', alreadyRegisteredQuestion: 'Bereits registriert? ' },
    account: { title: 'Mein Konto', email: 'Email', plan: 'Plan', conversionsUsed: 'Verwendete Konvertierungen', unlimited: 'Unbegrenzt', changePlan: 'Plan ändern', logout: 'Abmelden' },
    form: { name: 'Name', email: 'Email', password: 'Passwort' },
    errors: { generic: 'Fehler', upload: 'Upload-Fehler', convert: 'Konvertierungsfehler', fetchFormats: 'Fehler beim Abrufen der Formate' },
    
    common: { empty: 'Leer' },
    download: { defaultName: 'konvertierte-datei' },
    units: { bytes: 'Bytes', kb: 'KB', mb: 'MB', gb: 'GB' },
    faq: {
      q1: { title: 'Welche Dateiformate werden unterstützt?', body: 'Wir unterstützen über 50 verschiedene Formate einschließlich PDF, DOC, JPG, PNG, MP4, MP3 und viele mehr.' },
      q2: { title: 'Sind meine Dateien sicher?', body: 'Ja, alle Dateien sind während der Übertragung verschlüsselt und werden automatisch nach 1 Stunde gelöscht.' },
      q3: { title: 'Kann ich mehrere Dateien gleichzeitig konvertieren?', body: 'Ja, Pro- und Premium-Benutzer können mehrere Dateien gleichzeitig mit unserer Stapelkonvertierungsfunktion konvertieren.' },
      q4: { title: 'Wie kann ich mein Abonnement kündigen?', body: 'Sie können Ihr Abonnement jederzeit von Ihrer Kontoseite aus kündigen. Die Kündigung wird am Ende des Abrechnungszeitraums wirksam.' }
    }
  } },
  zh: { translation: {
    header: { title: 'Uniconvert', account: '我的账户', login: '登录', pricing: '定价', remaining: '剩余 {{count}} 次转换' },
    hero: { title: '一键转换您的文件', subtitle: '文档、图片、音频和视频的通用转换。快速、安全，首次使用无需注册。' },
    upload: { drop: '将文件拖放到此处', browse: '点击浏览', chooseFile: '选择文件', progress: '正在上传... {{percent}}%', success: '文件上传成功：{{name}}', supported: '支持格式：文档、图片、音频、视频', maxSize: '最大大小：50MB' },
    convert: { successTitle: '转换成功！', successText: '您的文件已从 {{from}} 转换为 {{to}}', download: '下载文件', another: '转换另一个文件', chooseFormat: '选择目标格式', selectFormat: '选择格式', button: '转换文件', converting: '正在转换...', sizeOriginal: '原始大小：', sizeConverted: '转换后大小：', title: '转换您的文件', currentFormatLabel: '当前格式：' },
    category: { document: '文档', image: '图片', audio: '音频', video: '视频', file: '文件' },
    app: { comingSoon: '即将推出' },
    limit: { title: '转换次数已达上限', text: '您已达到 {{limit}} 次免费转换的限制。升级到 Pro 以获得无限转换。', viewPricing: '查看定价', cancel: '取消' },
    features: { fastTitle: '快速且高效', fastDesc: '使用优化服务器实现即时转换，性能更强。', secureTitle: '安全', secureDesc: '您的文件将被安全处理，并在转换后自动删除。', universalTitle: '通用', universalDesc: '支持 50+ 种格式：文档、图片、音频、视频和压缩包。' },
    footer: { copyright: '© 2024 Uniconvert. 版权所有。' },
    pricing: { choosePlan: '选择你的套餐', monthly: '每月', yearly: '每年', backHome: '返回首页', popular: '热门', faq: '常见问题', save20: '节省 20%', stripeSimulation: 'Stripe模拟', billedYearly: '按年计费{{amount}}' },
    plan: {
      free: { name: '免费', period: '永久', description: '适合试用我们的服务', button: '免费开始', features: { daily: '每天1次转换', basicFormats: '基本格式', max50: '最大50MB', emailSupport: '邮件支持' } },
      pro: { name: '专业版', period: '月', description: '适合常规用户', button: '开始试用', features: { unlimited: '无限转换', allFormats: '支持所有格式', max500: '最大500MB', prioritySupport: '优先支持', batch: '批量转换', api: 'API访问' } },
      premium: { name: '高级版', period: '月', description: '适合专业人士和团队', button: '联系我们', features: { unlimited: '无限转换', allFormats: '支持所有格式', max2g: '最大2GB', priority247: '24/7优先支持', advancedBatch: '高级批量转换', fullApi: '完整API', team: '团队账户', analytics: '详细分析' } }
    },
    video: { quality: '视频质量', low: '低', medium: '中', high: '高' },
    pdf: { page: '页面', scale: '比例', pageRange: '页面范围', exampleRange: '（例如：1-3,5）', placeholderAll: '留空则全部' },
    auth: { signIn: '登录', signUp: '注册', createAccount: '创建账户', noAccountQuestion: '没有账户？ ', alreadyRegisteredQuestion: '已经注册？ ' },
    account: { title: '我的账户', email: '邮箱', plan: '套餐', conversionsUsed: '已用转换次数', unlimited: '无限', changePlan: '更改套餐', logout: '退出登录' },
    form: { name: '姓名', email: '邮箱', password: '密码' },
    errors: { generic: '错误', upload: '上传错误', convert: '转换错误', fetchFormats: '获取格式错误' },
    
    common: { empty: '空' },
    download: { defaultName: '已转换文件' },
    units: { bytes: '字节', kb: 'KB', mb: 'MB', gb: 'GB' },
    faq: {
      q1: { title: '支持哪些文件格式？', body: '我们支持50多种不同格式，包括PDF、DOC、JPG、PNG、MP4、MP3等。' },
      q2: { title: '我的文件安全吗？', body: '是的，所有文件在传输过程中都经过加密，并在1小时后自动删除。' },
      q3: { title: '我可以一次转换多个文件吗？', body: '是的，Pro和Premium用户可以使用我们的批量转换功能同时转换多个文件。' },
      q4: { title: '如何取消订阅？', body: '您可以随时从账户页面取消订阅。取消将在计费周期结束时生效。' }
    }
  } },
  ja: { translation: {
    header: { title: 'Uniconvert', account: 'マイアカウント', login: 'ログイン', pricing: '料金', remaining: '残り {{count}} 回の変換' },
    hero: { title: 'ワンクリックでファイル変換', subtitle: 'ドキュメント、画像、音声、動画の汎用変換。高速で安全。' },
    upload: { drop: 'ここにファイルをドラッグ＆ドロップ', browse: 'クリックして参照', chooseFile: 'ファイルを選択', progress: 'アップロード中... {{percent}}%', success: 'ファイルが正常にアップロードされました：{{name}}', supported: '対応フォーマット：ドキュメント、画像、音声、動画', maxSize: '最大サイズ：50MB' },
    convert: { successTitle: '変換が成功しました！', successText: 'ファイルは {{from}} から {{to}} に変換されました', download: 'ファイルをダウンロード', another: '別のファイルを変換', chooseFormat: '変換先フォーマットを選択', selectFormat: 'フォーマットを選択', button: 'ファイルを変換', converting: '変換中...', sizeOriginal: '元のサイズ：', sizeConverted: '変換後のサイズ：', title: 'ファイルを変換', currentFormatLabel: '現在のフォーマット：' },
    category: { document: 'ドキュメント', image: '画像', audio: '音声', video: '動画', file: 'ファイル' },
    app: { comingSoon: '近日公開' },
    limit: { title: '変換回数制限に達しました', text: '無料変換{{limit}}回の制限に達しました。無制限の変換のためにProにアップグレードしてください。', viewPricing: '価格を見る', cancel: 'キャンセル' },
    features: { fastTitle: '高速・効率的', fastDesc: '最大性能に最適化されたサーバーで即時変換。', secureTitle: '安全', secureDesc: 'ファイルは安全に処理され、変換後に自動削除されます。', universalTitle: 'ユニバーサル', universalDesc: '50以上の形式に対応：ドキュメント、画像、音声、動画、アーカイブ。' },
    footer: { copyright: '© 2024 Uniconvert. 全ての権利を保有します。' },
    pricing: { choosePlan: 'プランを選択', monthly: '毎月', yearly: '毎年', backHome: 'ホームに戻る', popular: '人気', faq: 'よくある質問', save20: '20%お得', stripeSimulation: 'Stripeシミュレーション', billedYearly: '年間請求{{amount}}' },
    plan: {
      free: { name: '無料', period: '永久', description: 'サービスを試すのに最適', button: '無料で開始', features: { daily: '1日1回の変換', basicFormats: '基本フォーマット', max50: '最大50MB', emailSupport: 'メールサポート' } },
      pro: { name: 'プロ', period: '月', description: '定期的なユーザーに最適', button: 'トライアル開始', features: { unlimited: '無制限の変換', allFormats: 'すべてのフォーマット対応', max500: '最大500MB', prioritySupport: '優先サポート', batch: 'バッチ変換', api: 'APIアクセス' } },
      premium: { name: 'プレミアム', period: '月', description: 'プロフェッショナルとチーム向け', button: 'お問い合わせ', features: { unlimited: '無制限の変換', allFormats: 'すべてのフォーマット対応', max2g: '最大2GB', priority247: '24/7優先サポート', advancedBatch: '高度なバッチ変換', fullApi: '完全なAPI', team: 'チームアカウント', analytics: '詳細な分析' } }
    },
    video: { quality: 'ビデオ品質', low: '低', medium: '中', high: '高' },
    pdf: { page: 'ページ', scale: 'スケール', pageRange: 'ページ範囲', exampleRange: '（例：1-3,5）', placeholderAll: '空の場合はすべて' },
    auth: { signIn: 'ログイン', signUp: 'サインアップ', createAccount: 'アカウント作成', noAccountQuestion: 'アカウントをお持ちでないですか？ ', alreadyRegisteredQuestion: '既に登録済みですか？ ' },
    account: { title: 'マイアカウント', email: 'メール', plan: 'プラン', conversionsUsed: '使用済み変換回数', unlimited: '無制限', changePlan: 'プラン変更', logout: 'ログアウト' },
    form: { name: '名前', email: 'メール', password: 'パスワード' },
    errors: { generic: 'エラー', upload: 'アップロードエラー', convert: '変換エラー', fetchFormats: 'フォーマット取得エラー' },
    
    common: { empty: '空' },
    download: { defaultName: '変換済みファイル' },
    units: { bytes: 'バイト', kb: 'KB', mb: 'MB', gb: 'GB' },
    faq: {
      q1: { title: 'どのようなファイル形式に対応していますか？', body: 'PDF、DOC、JPG、PNG、MP4、MP3を含む50以上の異なる形式に対応しています。' },
      q2: { title: 'ファイルは安全ですか？', body: 'はい、すべてのファイルは転送中に暗号化され、1時間後に自動的に削除されます。' },
      q3: { title: '複数のファイルを一度に変換できますか？', body: 'はい、ProおよびPremiumユーザーは、バッチ変換機能で複数のファイルを同時に変換できます。' },
      q4: { title: 'サブスクリプションをキャンセルするには？', body: 'アカウントページからいつでもサブスクリプションをキャンセルできます。キャンセルは請求期間の終了時に有効になります。' }
    }
  } },
  ru: { translation: {
    header: { title: 'Uniconvert', account: 'Мой аккаунт', login: 'Войти', pricing: 'Цены', remaining: '{{count}} осталось конвертаций' },
    hero: { title: 'Конвертируйте файлы в один клик', subtitle: 'Универсальная конвертация документов, изображений, аудио и видео.' },
    upload: { drop: 'Перетащите файл сюда', browse: 'нажмите для обзора', chooseFile: 'Выберите файл', progress: 'Загрузка... {{percent}}%', success: 'Файл успешно загружен: {{name}}', supported: 'Поддерживаемые форматы: документы, изображения, аудио, видео', maxSize: 'Максимальный размер: 50MB' },
    convert: { successTitle: 'Конвертация прошла успешно!', successText: 'Ваш файл был конвертирован из {{from}} в {{to}}', download: 'Скачать файл', another: 'Конвертировать другой файл', chooseFormat: 'Выберите формат назначения', selectFormat: 'Выберите формат', button: 'Конвертировать файл', converting: 'Конвертация...', sizeOriginal: 'Исходный размер:', sizeConverted: 'Размер после конвертации:', title: 'Конвертируйте ваш файл', currentFormatLabel: 'Текущий формат:' },
    category: { document: 'Документ', image: 'Изображение', audio: 'Аудио', video: 'Видео', file: 'Файл' },
    app: { comingSoon: 'Скоро' },
    limit: { title: 'Достигнут лимит конвертаций', text: 'Вы достигли лимита {{limit}} бесплатной конвертации(й). Обновитесь до Pro для неограниченных конвертаций.', viewPricing: 'Посмотреть цены', cancel: 'Отмена' },
    features: { fastTitle: 'Быстро и эффективно', fastDesc: 'Мгновенная конвертация на серверах, оптимизированных для максимальной производительности.', secureTitle: 'Безопасно', secureDesc: 'Файлы обрабатываются безопасно и автоматически удаляются после конвертации.', universalTitle: 'Универсально', universalDesc: 'Поддержка более 50 форматов: документы, изображения, аудио, видео и архивы.' },
    footer: { copyright: '© 2024 Uniconvert. Все права защищены.' },
    pricing: { choosePlan: 'Выберите план', monthly: 'Ежемесячно', yearly: 'Ежегодно', backHome: 'Назад на главную', popular: 'Популярно', faq: 'Частые вопросы', save20: 'Экономия 20%', stripeSimulation: 'Stripe симуляция', billedYearly: 'Счет выставляется ежегодно {{amount}}' },
    plan: {
      free: { name: 'Бесплатно', period: 'навсегда', description: 'Идеально для пробования нашего сервиса', button: 'Начать бесплатно', features: { daily: '1 конвертация в день', basicFormats: 'Базовые форматы', max50: 'Максимальный размер 50MB', emailSupport: 'Поддержка по email' } },
      pro: { name: 'Pro', period: 'месяц', description: 'Идеально для регулярных пользователей', button: 'Начать пробный период', features: { unlimited: 'Неограниченные конвертации', allFormats: 'Поддержка всех форматов', max500: 'Максимальный размер 500MB', prioritySupport: 'Приоритетная поддержка', batch: 'Пакетные конвертации', api: 'Доступ к API' } },
      premium: { name: 'Premium', period: 'месяц', description: 'Для профессионалов и команд', button: 'Связаться с нами', features: { unlimited: 'Неограниченные конвертации', allFormats: 'Поддержка всех форматов', max2g: 'Максимальный размер 2GB', priority247: 'Приоритетная поддержка 24/7', advancedBatch: 'Расширенные пакетные конвертации', fullApi: 'Полный API', team: 'Командные аккаунты', analytics: 'Детальная аналитика' } }
    },
    video: { quality: 'Качество видео', low: 'Низкое', medium: 'Среднее', high: 'Высокое' },
    pdf: { page: 'Страница', scale: 'Масштаб', pageRange: 'Диапазон страниц', exampleRange: '(например: 1-3,5)', placeholderAll: 'Все если пусто' },
    auth: { signIn: 'Войти', signUp: 'Регистрация', createAccount: 'Создать аккаунт', noAccountQuestion: 'Нет аккаунта? ', alreadyRegisteredQuestion: 'Уже зарегистрированы? ' },
    account: { title: 'Мой аккаунт', email: 'Email', plan: 'План', conversionsUsed: 'Использовано конвертаций', unlimited: 'Безлимитный', changePlan: 'Изменить план', logout: 'Выйти' },
    form: { name: 'Имя', email: 'Email', password: 'Пароль' },
    errors: { generic: 'Ошибка', upload: 'Ошибка загрузки', convert: 'Ошибка конвертации', fetchFormats: 'Ошибка получения форматов' },
    
    common: { empty: 'Пусто' },
    download: { defaultName: 'конвертированный-файл' },
    units: { bytes: 'байт', kb: 'КБ', mb: 'МБ', gb: 'ГБ' },
    faq: {
      q1: { title: 'Какие форматы файлов поддерживаются?', body: 'Мы поддерживаем более 50 различных форматов, включая PDF, DOC, JPG, PNG, MP4, MP3 и многие другие.' },
      q2: { title: 'Безопасны ли мои файлы?', body: 'Да, все файлы зашифрованы во время передачи и автоматически удаляются через 1 час.' },
      q3: { title: 'Могу ли я конвертировать несколько файлов одновременно?', body: 'Да, пользователи Pro и Premium могут конвертировать несколько файлов одновременно с помощью нашей функции пакетной конвертации.' },
      q4: { title: 'Как я могу отменить подписку?', body: 'Вы можете отменить подписку в любое время со страницы вашего аккаунта. Отмена вступает в силу в конце расчетного периода.' }
    }
  } },
  ar: { translation: {
    header: { title: 'يوني كونفرت', account: 'حسابي', login: 'تسجيل الدخول', pricing: 'الأسعار', remaining: '{{count}} عملية تحويل متبقية' },
    hero: { title: 'حوّل ملفاتك بنقرة واحدة', subtitle: 'تحويل شامل للمستندات والصور والصوت والفيديو.' },
    upload: { drop: 'اسحب وأفلت ملفك هنا', browse: 'انقر للتصفح', chooseFile: 'اختر ملفًا', progress: 'جارٍ الرفع... {{percent}}%', success: 'تم رفع الملف بنجاح: {{name}}', supported: 'الصيغ المدعومة: مستندات، صور، صوت، فيديو', maxSize: 'الحجم الأقصى: 50MB' },
    convert: { successTitle: 'تمت عملية التحويل بنجاح!', successText: 'تم تحويل ملفك من {{from}} إلى {{to}}', download: 'تحميل الملف', another: 'حوّل ملفًا آخر', chooseFormat: 'اختر صيغة الوجهة', selectFormat: 'اختر صيغة', button: 'حوّل الملف', converting: 'جارٍ التحويل...', sizeOriginal: 'الحجم الأصلي:', sizeConverted: 'الحجم بعد التحويل:', title: 'حوّل ملفك', currentFormatLabel: 'التنسيق الحالي:' },
    category: { document: 'مستند', image: 'صورة', audio: 'صوت', video: 'فيديو', file: 'ملف' },
    pricing: { choosePlan: 'اختر خطتك', monthly: 'شهري', yearly: 'سنوي', backHome: 'الرجوع للرئيسية', popular: 'شائع', faq: 'أسئلة شائعة', stripeSimulation: 'محاكاة Stripe', billedYearly: 'فاتورة سنوية {{amount}}' },
    pdf: { page: 'الصفحة', scale: 'المقياس', pageRange: 'نطاق الصفحات', exampleRange: '(مثال: 1-3,5)', placeholderAll: 'الكل إذا كان فارغًا' },
    features: { fastTitle: 'سريع وفعّال', fastDesc: 'تحويل فوري مع خوادم مُحسّنة لأفضل أداء.', secureTitle: 'آمن', secureDesc: 'تُعالَج ملفاتك بأمان وتُحذَف تلقائيًا بعد التحويل.', universalTitle: 'شامل', universalDesc: 'دعم لأكثر من 50 صيغة: مستندات، صور، صوت، فيديو وأرشيفات.' },
    footer: { copyright: '© 2024 يوني كونفرت. جميع الحقوق محفوظة.' },
    app: { comingSoon: 'قريبًا' },
    limit: { title: 'تم الوصول إلى حد التحويلات', text: 'لقد وصلت إلى حدك البالغ {{limit}} من عمليات التحويل المجانية. ارتقِ إلى برو للحصول على تحويلات غير محدودة.', viewPricing: 'عرض الأسعار', cancel: 'إلغاء' },
    auth: { signIn: 'تسجيل الدخول', signUp: 'إنشاء حساب', createAccount: 'إنشاء الحساب', noAccountQuestion: 'ليس لديك حساب؟ ', alreadyRegisteredQuestion: 'هل أنت مسجل بالفعل؟ ' },
    account: { title: 'حسابي', email: 'البريد الإلكتروني', plan: 'الخطة', conversionsUsed: 'التحويلات المستخدمة', unlimited: 'غير محدود', changePlan: 'تغيير الخطة', logout: 'تسجيل الخروج' },
    form: { name: 'الاسم', email: 'البريد الإلكتروني', password: 'كلمة المرور' },
    errors: { generic: 'خطأ', upload: 'خطأ في التحميل', convert: 'خطأ في التحويل', fetchFormats: 'خطأ في استرجاع التنسيقات' },
    
    common: { empty: 'فارغ' },
    download: { defaultName: 'ملف-محول' },
    units: { bytes: 'بايت', kb: 'ك.ب', mb: 'م.ب', gb: 'ج.ب' },
    faq: {
      q1: { title: 'ما هي تنسيقات الملفات المدعومة؟', body: 'نحن ندعم أكثر من 50 تنسيقًا مختلفًا بما في ذلك PDF وDOC وJPG وPNG وMP4 وMP3 والمزيد.' },
      q2: { title: 'هل ملفاتي آمنة؟', body: 'نعم، يتم تشفير جميع الملفات أثناء النقل وحذفها تلقائيًا بعد ساعة واحدة.' },
      q3: { title: 'هل يمكنني تحويل ملفات متعددة في وقت واحد؟', body: 'نعم، يمكن للمستخدمين Pro وPremium تحويل ملفات متعددة في وقت واحد باستخدام ميزة التحويل المجمع.' },
      q4: { title: 'كيف يمكنني إلغاء اشتراكي؟', body: 'يمكنك إلغاء اشتراكك في أي وقت من صفحة حسابك. يسري الإلغاء في نهاية فترة الفوترة.' }
    }
  } },
  fa: { translation: {
    header: { title: 'Uniconvert', account: 'حساب من', login: 'ورود', pricing: 'قیمت‌ها', remaining: '{{count}} تبدیل باقی‌مانده' },
    hero: { title: 'تبدیل فایل با یک کلیک', subtitle: 'تبدیل عمومی اسناد و تصاویر.' },
    upload: { drop: 'فایل خود را اینجا بکشید و رها کنید', browse: 'برای مرور کلیک کنید', chooseFile: 'انتخاب فایل', progress: 'در حال آپلود... {{percent}}%', success: 'فایل با موفقیت آپلود شد: {{name}}', supported: 'فرمت‌های پشتیبانی‌شده: اسناد، تصاویر، صدا، ویدئو', maxSize: 'حداکثر اندازه: 50MB' },
    convert: { successTitle: 'تبدیل موفق!', successText: 'فایل شما از {{from}} به {{to}} تبدیل شد', download: 'دانلود فایل', another: 'تبدیل فایل دیگر', chooseFormat: 'انتخاب فرمت مقصد', selectFormat: 'انتخاب فرمت', button: 'تبدیل فایل', converting: 'در حال تبدیل...', sizeOriginal: 'اندازه اصلی:', sizeConverted: 'اندازه پس از تبدیل:', title: 'فایل خود را تبدیل کنید', currentFormatLabel: 'فرمت فعلی:' },
    category: { document: 'سند', image: 'تصویر', audio: 'صدا', video: 'ویدئو', file: 'فایل' },
    app: { comingSoon: 'به‌زودی' },
    limit: { title: 'محدودیت تبدیلات به پایان رسید', text: 'شما به حد {{limit}} تبدیل رایانه‌ای خود رسیده‌اید. برای تبدیلات نامحدود به Pro ارتقا دهید.', viewPricing: 'مشاهده قیمت‌ها', cancel: 'لغو' },
    features: { fastTitle: 'سریع و کارآمد', fastDesc: 'تبدیل فوری با سرورهای بهینه‌سازی‌شده برای بیشترین کارایی.', secureTitle: 'امن', secureDesc: 'فایل‌های شما به‌صورت امن پردازش می‌شوند و پس از تبدیل به‌طور خودکار حذف می‌گردند.', universalTitle: 'جامع', universalDesc: 'پشتیبانی از بیش از ۵۰ فرمت: اسناد، تصاویر، صدا، ویدئو و آرشیوها.' },
    footer: { copyright: '© 2024 Uniconvert. تمامی حقوق محفوظ است.' },
    pricing: { choosePlan: 'قیمت‌ها', monthly: 'ماهانه', yearly: 'سالانه', backHome: 'بازگشت به خانه', popular: 'محبوب', faq: 'سوالات متداول', stripeSimulation: 'شبیه‌سازی Stripe', billedYearly: 'صورتحساب سالانه {{amount}}' },
    plan: {
      free: { name: 'رایگان', period: 'برای همیشه', description: 'برای امتحان خدمات ما عالی است', button: 'شروع رایگان', features: { daily: '1 تبدیل در روز', basicFormats: 'فرمت‌های پایه', max50: 'حداکثر اندازه 50MB', emailSupport: 'پشتیبانی ایمیل' } },
      pro: { name: 'Pro', period: 'ماه', description: 'مناسب برای کاربران معمولی', button: 'شروع آزمایشی', features: { unlimited: 'تبدیل‌های نامحدود', allFormats: 'تمام فرمت‌ها پشتیبانی می‌شوند', max500: 'حداکثر اندازه 500MB', prioritySupport: 'پشتیبانی اولویت‌دار', batch: 'تبدیل‌های دسته‌ای', api: 'دسترسی API' } },
      premium: { name: 'Premium', period: 'ماه', description: 'برای حرفه‌ای‌ها و تیم‌ها', button: 'تماس با ما', features: { unlimited: 'تبدیل‌های نامحدود', allFormats: 'تمام فرمت‌ها پشتیبانی می‌شوند', max2g: 'حداکثر اندازه 2GB', priority247: 'پشتیبانی اولویت‌دار 24/7', advancedBatch: 'تبدیل‌های دسته‌ای پیشرفته', fullApi: 'API کامل', team: 'حساب‌های تیمی', analytics: 'تحلیل‌های دقیق' } }
    },
    video: { quality: 'کیفیت ویدئو', low: 'پایین', medium: 'متوسط', high: 'بالا' },
    pdf: { page: 'صفحه', scale: 'مقیاس', pageRange: 'دامنه صفحات', exampleRange: '(مثال: 1-3,5)', placeholderAll: 'همه در صورت خالی بودن' },
    auth: { signIn: 'ورود', signUp: 'ثبت‌نام', createAccount: 'ایجاد حساب', noAccountQuestion: 'حساب ندارید؟ ', alreadyRegisteredQuestion: 'قبلاً ثبت‌نام کرده‌اید؟ ' },
    account: { title: 'حساب من', email: 'ایمیل', plan: 'طرح', conversionsUsed: 'تبدیل‌های استفاده‌شده', unlimited: 'نامحدود', changePlan: 'تغییر طرح', logout: 'خروج' },
    form: { name: 'نام', email: 'ایمیل', password: 'رمز عبور' },
    errors: { generic: 'خطا', upload: 'خطا در آپلود', convert: 'خطا در تبدیل', fetchFormats: 'خطا در دریافت فرمت‌ها' },
    
    common: { empty: 'خالی' },
    download: { defaultName: 'فایل-تبدیل‌شده' },
    units: { bytes: 'بایت', kb: 'ک.ب', mb: 'م.ب', gb: 'گ.ب' },
    faq: {
      q1: { title: 'چه فرمت‌های فایلی پشتیبانی می‌شوند؟', body: 'ما از بیش از 50 فرمت مختلف از جمله PDF، DOC، JPG، PNG، MP4، MP3 و موارد دیگر پشتیبانی می‌کنیم.' },
      q2: { title: 'آیا فایل‌های من امن هستند؟', body: 'بله، تمام فایل‌ها در طول انتقال رمزگذاری می‌شوند و به‌طور خودکار پس از 1 ساعت حذف می‌شوند.' },
      q3: { title: 'آیا می‌توانم چندین فایل را هم‌زمان تبدیل کنم؟', body: 'بله، کاربران Pro و Premium می‌توانند با استفاده از ویژگی تبدیل دسته‌ای، چندین فایل را هم‌زمان تبدیل کنند.' },
      q4: { title: 'چگونه می‌توانم اشتراکم را لغو کنم؟', body: 'شما می‌توانید در هر زمانی از صفحه حساب خود اشتراکتان را لغو کنید. لغو در پایان دوره صورتحساب اعمال می‌شود.' }
    }
  } },
  pt: { translation: {
    header: { title: 'Uniconvert', account: 'Minha conta', login: 'Entrar', pricing: 'Preços', remaining: '{{count}} conversão(ões) restante(s)' },
    hero: { title: 'Converta seus arquivos com um clique', subtitle: 'Conversão universal.' },
    upload: { drop: 'Arraste e solte seu arquivo aqui', browse: 'clique para procurar', chooseFile: 'Escolher arquivo', progress: 'Enviando... {{percent}}%', success: 'Arquivo enviado com sucesso: {{name}}', supported: 'Formatos suportados: Documentos, Imagens, Áudio, Vídeo', maxSize: 'Tamanho máximo: 50MB' },
    convert: { successTitle: 'Conversão bem-sucedida!', successText: 'Seu arquivo foi convertido de {{from}} para {{to}}', download: 'Baixar arquivo', another: 'Converter outro arquivo', chooseFormat: 'Escolher formato de destino', selectFormat: 'Selecionar formato', button: 'Converter arquivo', converting: 'Convertendo...', sizeOriginal: 'Tamanho original:', sizeConverted: 'Tamanho convertido:', title: 'Converta seu arquivo', currentFormatLabel: 'Formato atual:' },
    category: { document: 'Documento', image: 'Imagem', audio: 'Áudio', video: 'Vídeo', file: 'Arquivo' },
    app: { comingSoon: 'Em breve' },
    limit: { title: 'Limite de conversões atingido', text: 'Você atingiu seu limite de {{limit}} conversão(ões) gratuita(s). Atualize para Pro para conversões ilimitadas.', viewPricing: 'Ver preços', cancel: 'Cancelar' },
    features: { fastTitle: 'Rápido e Eficiente', fastDesc: 'Conversão instantânea com servidores otimizados para desempenho máximo.', secureTitle: 'Seguro', secureDesc: 'Seus arquivos são processados com segurança e excluídos automaticamente após a conversão.', universalTitle: 'Universal', universalDesc: 'Suporte a mais de 50 formatos: documentos, imagens, áudio, vídeo e arquivos.' },
    footer: { copyright: '© 2024 Uniconvert. Todos os direitos reservados.' },
    pricing: { choosePlan: 'Preços', monthly: 'Mensal', yearly: 'Anual', backHome: 'Voltar para casa', popular: 'Popular', faq: 'Perguntas frequentes', save20: 'Economize 20%', stripeSimulation: 'Simulação Stripe', billedYearly: 'Cobrança anual {{amount}}' },
    plan: {
      free: { name: 'Grátis', period: 'para sempre', description: 'Perfeito para experimentar nosso serviço', button: 'Começar de graça', features: { daily: '1 conversão por dia', basicFormats: 'Formatos básicos', max50: 'Tamanho máximo 50MB', emailSupport: 'Suporte por email' } },
      pro: { name: 'Pro', period: 'mês', description: 'Ideal para usuários regulares', button: 'Iniciar teste', features: { unlimited: 'Conversões ilimitadas', allFormats: 'Todos os formatos suportados', max500: 'Tamanho máximo 500MB', prioritySupport: 'Suporte prioritário', batch: 'Conversões em lote', api: 'Acesso à API' } },
      premium: { name: 'Premium', period: 'mês', description: 'Para profissionais e equipes', button: 'Entre em contato', features: { unlimited: 'Conversões ilimitadas', allFormats: 'Todos os formatos suportados', max2g: 'Tamanho máximo 2GB', priority247: 'Suporte prioritário 24/7', advancedBatch: 'Conversões em lote avançadas', fullApi: 'API completa', team: 'Contas de equipe', analytics: 'Análises detalhadas' } }
    },
    video: { quality: 'Qualidade de vídeo', low: 'Baixa', medium: 'Média', high: 'Alta' },
    pdf: { page: 'Página', scale: 'Escala', pageRange: 'Intervalo de páginas', exampleRange: '(ex.: 1-3,5)', placeholderAll: 'Todas se vazio' },
    auth: { signIn: 'Entrar', signUp: 'Criar conta', createAccount: 'Criar conta', noAccountQuestion: 'Sem conta? ', alreadyRegisteredQuestion: 'Já registrado? ' },
    account: { title: 'Minha conta', email: 'Email', plan: 'Plano', conversionsUsed: 'Conversões usadas', unlimited: 'Ilimitado', changePlan: 'Mudar plano', logout: 'Sair' },
    form: { name: 'Nome', email: 'Email', password: 'Senha' },
    errors: { generic: 'Erro', upload: 'Erro ao enviar', convert: 'Erro ao converter', fetchFormats: 'Erro ao buscar formatos' },
    
    common: { empty: 'Vazio' },
    download: { defaultName: 'arquivo-convertido' },
    units: { bytes: 'bytes', kb: 'KB', mb: 'MB', gb: 'GB' },
    faq: {
      q1: { title: 'Quais formatos de arquivo são suportados?', body: 'Suportamos mais de 50 formatos diferentes incluindo PDF, DOC, JPG, PNG, MP4, MP3 e muitos mais.' },
      q2: { title: 'Meus arquivos são seguros?', body: 'Sim, todos os arquivos são criptografados durante a transferência e excluídos automaticamente após 1 hora.' },
      q3: { title: 'Posso converter vários arquivos ao mesmo tempo?', body: 'Sim, usuários Pro e Premium podem converter vários arquivos simultaneamente com nosso recurso de conversão em lote.' },
      q4: { title: 'Como posso cancelar minha assinatura?', body: 'Você pode cancelar sua assinatura a qualquer momento na página da sua conta. O cancelamento entra em vigor no final do período de cobrança.' }
    }
  } },
  hi: { translation: {
    header: { title: 'Uniconvert', account: 'मेरा खाता', login: 'साइन इन', pricing: 'मूल्य', remaining: '{{count}} कन्वर्ज़न शेष' },
    hero: { title: 'एक क्लिक में अपनी फ़ाइलें बदलें', subtitle: 'दस्तावेज़, चित्र, ऑडियो और वीडियो का सार्वभौमिक रूपांतरण। तेज़ और सुरक्षित।' },
    upload: { drop: 'अपनी फ़ाइल यहाँ ड्रैग और ड्रॉप करें', browse: 'ब्राउज़ करने के लिए क्लिक करें', chooseFile: 'फ़ाइल चुनें', progress: 'अपलोड हो रहा है... {{percent}}%', success: 'फ़ाइल सफलतापूर्वक अपलोड हुई: {{name}}', supported: 'समर्थित फ़ॉर्मैट: दस्तावेज़, चित्र, ऑडियो, वीडियो', maxSize: 'अधिकतम आकार: 50MB' },
    convert: { successTitle: 'रूपांतरण सफल!', successText: 'आपकी फ़ाइल {{from}} से {{to}} में बदली गई', download: 'फ़ाइल डाउनलोड करें', another: 'दूसरी फ़ाइल रूपांतरित करें', chooseFormat: 'गंतव्य फ़ॉर्मैट चुनें', selectFormat: 'फ़ॉर्मैट चुनें', button: 'फ़ाइल रूपांतरित करें', converting: 'रूपांतरण हो रहा है...', sizeOriginal: 'मूल आकार:', sizeConverted: 'रूपांतरण के बाद आकार:', title: 'अपनी फ़ाइल रूपांतरित करें', currentFormatLabel: 'वर्तमान फ़ॉर्मैट:' },
    category: { document: 'दस्तावेज़', image: 'चित्र', audio: 'ऑडियो', video: 'वीडियो', file: 'फ़ाइल' },
    app: { comingSoon: 'जल्द आ रहा है' },
    limit: { title: 'रूपांतरण सीमा पूरी हुई', text: 'आपने {{limit}} मुफ्त रूपांतरण की सीमा पूरी कर ली है। असीमित रूपांतरणों के लिए Pro में अपग्रेड करें।', viewPricing: 'मूल्य देखें', cancel: 'रद्द करें' },
    features: { fastTitle: 'तेज़ और प्रभावी', fastDesc: 'अधिकतम प्रदर्शन के लिए अनुकूलित सर्वरों पर त्वरित रूपांतरण।', secureTitle: 'सुरक्षित', secureDesc: 'आपकी फ़ाइलें सुरक्षित रूप से संसाधित होती हैं और रूपांतरण के बाद स्वतः हट जाती हैं।', universalTitle: 'सार्वभौमिक', universalDesc: '50+ फ़ॉर्मैट का समर्थन: दस्तावेज़, चित्र, ऑडियो, वीडियो और आर्काइव।' },
    footer: { copyright: '© 2024 Uniconvert. सर्वाधिकार सुरक्षित.' },
    pricing: { choosePlan: 'अपना प्लान चुनें', monthly: 'मासिक', yearly: 'वार्षिक', backHome: 'मुखपृष्ठ पर लौटें', popular: 'लोकप्रिय', faq: 'अक्सर पूछे जाने वाले प्रश्न', save20: '20% बचत', stripeSimulation: 'Stripe सिमुलेशन', billedYearly: 'वार्षिक बिलिंग {{amount}}' },
    plan: {
      free: { name: 'नि:शुल्क', period: 'हमेशा', description: 'हमारी सेवा आज़माने के लिए उत्कृष्ट', button: 'नि:शुल्क शुरू करें', features: { daily: 'प्रतिदिन 1 रूपांतरण', basicFormats: 'बुनियादी फ़ॉर्मैट', max50: 'अधिकतम आकार 50MB', emailSupport: 'ईमेल समर्थन' } },
      pro: { name: 'Pro', period: 'महीना', description: 'नियमित उपयोगकर्ताओं के लिए आदर्श', button: 'परीक्षण शुरू करें', features: { unlimited: 'असीमित रूपांतरण', allFormats: 'सभी फ़ॉर्मैट समर्थित', max500: 'अधिकतम आकार 500MB', prioritySupport: 'प्राथमिकता समर्थन', batch: 'बैच रूपांतरण', api: 'API एक्सेस' } },
      premium: { name: 'Premium', period: 'महीना', description: 'पेशेवरों और टीमों के लिए', button: 'हमसे संपर्क करें', features: { unlimited: 'असीमित रूपांतरण', allFormats: 'सभी फ़ॉर्मैट समर्थित', max2g: 'अधिकतम आकार 2GB', priority247: '24/7 प्राथमिकता समर्थन', advancedBatch: 'उन्नत बैच रूपांतरण', fullApi: 'पूर्ण API', team: 'टीम खाते', analytics: 'विस्तृत विश्लेषण' } }
    },
    video: { quality: 'वीडियो गुणवत्ता', low: 'कम', medium: 'मध्यम', high: 'उच्च' },
    pdf: { page: 'पृष्ठ', scale: 'स्केल', pageRange: 'पृष्ठ सीमा', exampleRange: '(उदा.: 1-3,5)', placeholderAll: 'खाली होने पर सभी' },
    auth: { signIn: 'साइन इन', signUp: 'खाता बनाएं', createAccount: 'खाता बनाएँ', noAccountQuestion: 'खाता नहीं है? ', alreadyRegisteredQuestion: 'पहले से पंजीकृत? ' },
    account: { title: 'मेरा खाता', email: 'ईमेल', plan: 'प्लान', conversionsUsed: 'प्रयुक्त रूपांतरण', unlimited: 'असीमित', changePlan: 'प्लान बदलें', logout: 'लॉग आउट' },
    form: { name: 'नाम', email: 'ईमेल', password: 'पासवर्ड' },
    errors: { generic: 'त्रुटि', upload: 'अपलोड त्रुटि', convert: 'रूपांतरण त्रुटि', fetchFormats: 'फ़ॉर्मैट प्राप्त करने में त्रुटि' },
    
    common: { empty: 'रिक्त' },
    download: { defaultName: 'रूपांतरित-फ़ाइल' },
    units: { bytes: 'बाइट्स', kb: 'KB', mb: 'MB', gb: 'GB' },
    faq: {
      q1: { title: 'कौन से फ़ाइल फ़ॉर्मैट समर्थित हैं?', body: 'हम 50 से अधिक अलग-अलग फ़ॉर्मैट का समर्थन करते हैं, जिनमें PDF, DOC, JPG, PNG, MP4, MP3 आदि शामिल हैं।' },
      q2: { title: 'क्या मेरी फ़ाइलें सुरक्षित हैं?', body: 'हाँ, सभी फ़ाइलें स्थानांतरण के दौरान एन्क्रिप्ट होती हैं और 1 घंटे बाद स्वतः हट जाती हैं।' },
      q3: { title: 'क्या मैं एक साथ कई फ़ाइलें रूपांतरित कर सकता हूँ?', body: 'हाँ, Pro और Premium उपयोगकर्ता बैच रूपांतरण सुविधा के साथ एक साथ कई फ़ाइलें रूपांतरित कर सकते हैं।' },
      q4: { title: 'मैं अपनी सदस्यता कैसे रद्द कर सकता हूँ?', body: 'आप अपने खाते के पृष्ठ से कभी भी अपनी सदस्यता रद्द कर सकते हैं। रद्दीकरण बिलिंग अवधि के अंत में प्रभावी होता है।' }
    }
  } },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    supportedLngs: ['fr','en','es','de','zh','ja','ru','ar','fa','pt','hi'],
    interpolation: { escapeValue: false }
  })

export default i18n
