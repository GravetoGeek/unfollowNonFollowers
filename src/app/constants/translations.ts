export type SupportedLanguages = "pt" | "en" | "zh" | "hi" | "ar" | "ja"

interface Translation {
    githubUsername: string
    githubApiKey: string
    getApiKey: string
    search: string
    searching: string
    nonFollowers: string
    nonFollowing: string
    noUsersFound: string
    unfollowing: string
    follow: string
    following: string
    unfollow: string
    unfollowed: string
    followAll: string
    unfollowAll: string
    followingAll: string
    unfollowingAll: string
    confirmFollowAll: string
    confirmUnfollowAll: string
    errorMissingCredentials: string
    confirm: string
    cancel: string
    close: string
    httpErrorMessage: {
        401: string[],
        403?: string[],
        404?: string[],
        500?: string[],
    },
    catchErrorMessage: {
        fetchOnePage: ({currentPage, status, statusText}:{currentPage: number, status: number, statusText: string}) => string,
        fetchManyPages: ({message}: {message: string}) => string,
        genericFetchManyPages: string,
        fetchNonFollowers: ({message}: {message: string}) => string,
        genericFetchNonFollowers: string,
        fetchNonFollowing: ({message}: {message: string}) => string,
        genericFetchNonFollowing: string,
        unfollowUser: ({username, message}: {username: string, message: string}) => string,
        genericUnfollowUser: string,
        followUser: ({username, message}: {username: string, message: string}) => string,
        genericFollowUser: string,
    }

}

// httpStatusCodeErrorMessage
// To generate your Github personal access token -\n
// 1. Visit the Personal Access Tokens ↗ section on Github
// 2. Click on Generate new token
// 3. Fill in the token name, expiry and resource owner
// 4. Carefully review and grant the necessary fine grained permissions to your token
// Use the generated token here

export const translations: Record<SupportedLanguages, Translation> = {
    pt: {
        githubUsername: "Nome de usuário do GitHub",
        githubApiKey: "Chave da API do GitHub",
        getApiKey: "Obtenha sua chave da API",
        search: "Buscar",
        searching: "Buscando...",
        nonFollowers: "Usuários que você segue e não te seguem:",
        nonFollowing: "Usuários que te seguem e você não segue:",
        noUsersFound: "Nenhum usuário encontrado.",
        unfollowing: "Deixando de seguir...",
        follow: "Seguir",
        following: "Seguindo...",
        unfollow: "Parar de seguir",
        unfollowed: "Deixou de seguir",
        followAll: "Seguir todos",
        unfollowAll: "Parar de seguir todos",
        followingAll: "Seguindo todos...",
        unfollowingAll: "Deixando de seguir todos...",
        confirmFollowAll: "Tem certeza que deseja seguir todos os usuários?",
        confirmUnfollowAll: "Tem certeza que deseja deixar de seguir todos os usuários?",
        errorMissingCredentials: "Por favor, insira seu nome de usuário e chave da API do GitHub.",
        confirm: "Confirmar",
        cancel: "Cancelar",
        close: "Fechar",
        catchErrorMessage:{
            fetchOnePage: ({currentPage, status, statusText})=>
                `Erro ao buscar dados na página ${currentPage}: ${status} - ${statusText}`,
            fetchManyPages: ({message})=>`Falha ao obter dados de múltiplas páginas: ${message}`,
            genericFetchManyPages: `Falha ao obter dados de múltiplas páginas.`,
            fetchNonFollowers: ({message})=>`Falha ao buscar não seguidores: ${message}`,
            genericFetchNonFollowers: `Falha ao buscar não seguidores.`,
            fetchNonFollowing: ({message})=>`Falha ao buscar não seguidos: ${message}`,
            genericFetchNonFollowing: `Falha ao buscar não seguidos.`,
            unfollowUser:({username,message})=>`Falha ao deixar de seguir ${username}: ${message}`,
            genericUnfollowUser: `Falha ao deixar de seguir o usuário.`,
            followUser:({username,message})=>`Falha ao seguir ${username}: ${message}`,
            genericFollowUser: `Falha ao seguir o usuário.`,
        },
        httpErrorMessage: {
            401: [
                "Para gerar seu token de acesso pessoal do Github -\n",
                "1. Visite a seção <a href='https://github.com/settings/personal-access-tokens' target='_blank'>Tokens de Acesso Pessoal ↗</a> no Github\n",
                "2. Clique em Gerar novo token\n",
                "3. Preencha o nome do token, expiração e proprietário do recurso\n",
                "4. Revise cuidadosamente e conceda as permissões necessárias ao seu token\n",
                "Use o token gerado aqui",
            ],
            403: ["Acesso proibido. Verifique suas permissões."],
            404: ["Recurso não encontrado. Verifique o URL ou o identificador."],
            500: ["Erro interno do servidor. Tente novamente mais tarde."],
        },
    },
    en: {
        githubUsername: "GitHub Username",
        githubApiKey: "GitHub API Key",
        getApiKey: "Get your API key",
        search: "Search",
        searching: "Searching...",
        nonFollowers: "Users you follow who don't follow you:",
        nonFollowing: "Users who follow you but you don't follow back:",
        noUsersFound: "No users found.",
        unfollowing: "Unfollowing...",
        follow: "Follow",
        following: "Following...",
        unfollow: "Unfollow",
        unfollowed: "Unfollowed",
        followAll: "Follow all",
        unfollowAll: "Unfollow all",
        followingAll: "Following all...",
        unfollowingAll: "Unfollowing all...",
        confirmFollowAll: "Are you sure you want to follow all users?",
        confirmUnfollowAll: "Are you sure you want to unfollow all users?",
        errorMissingCredentials: "Please enter your GitHub username and API key.",
        confirm: "Confirm",
        cancel: "Cancel",
        close: "Close",
        catchErrorMessage:{
            fetchOnePage: ({currentPage, status, statusText})=>
                `Error fetching data on page ${currentPage}: ${status} - ${statusText}`,
            fetchManyPages: ({message})=>`Failed to fetch data from multiple pages: ${message}`,
            genericFetchManyPages: `Failed to fetch data from multiple pages.`,
            fetchNonFollowers: ({message})=>`Failed to fetch non-followers: ${message}`,
            genericFetchNonFollowers: `Failed to fetch non-followers.`,
            fetchNonFollowing: ({message})=>`Failed to fetch non-following: ${message}`,
            genericFetchNonFollowing: `Failed to fetch non-following.`,
            unfollowUser:({username,message})=>`Failed to unfollow ${username}: ${message}`,
            genericUnfollowUser: `Failed to unfollow the user.`,
            followUser:({username,message})=>`Failed to follow ${username}: ${message}`,
            genericFollowUser: `Failed to follow the user.`,
        },
        httpErrorMessage: {
            401: [
                "To generate your Github personal access token -\n",
                "1. Visit the <a href='https://github.com/settings/personal-access-tokens' target='_blank'>Personal Access Tokens ↗</a> section on Github\n",
                "2. Click on Generate new token\n",
                "3. Fill in the token name, expiry and resource owner\n",
                "4. Carefully review and grant the necessary fine grained permissions to your token\n",
                "Use the generated token here",
            ],
            403: ["Access forbidden. Check your permissions."],
            404: ["Resource not found. Check the URL or identifier."],
            500: ["Internal server error. Please try again later."],
        },
    },
    zh: {
        githubUsername: "GitHub 用户名",
        githubApiKey: "GitHub API 密钥",
        getApiKey: "获取您的 API 密钥",
        search: "搜索",
        searching: "搜索中...",
        nonFollowers: "您关注但未关注您的用户：",
        nonFollowing: "关注您的用户但您未关注：",
        noUsersFound: "未找到用户。",
        unfollowing: "取消关注中...",
        follow: "关注",
        following: "关注中...",
        unfollow: "取消关注",
        unfollowed: "已取消关注",
        followAll: "关注所有",
        unfollowAll: "取消关注所有",
        followingAll: "正在关注所有...",
        unfollowingAll: "正在取消关注所有...",
        confirmFollowAll: "您确定要关注所有用户吗？",
        confirmUnfollowAll: "您确定要取消关注所有用户吗？",
        errorMissingCredentials: "请输入您的 GitHub 用户名和 API 密钥。",
        confirm: "确认",
        cancel: "取消",
        close: "关闭",
        catchErrorMessage:{
            fetchOnePage: ({currentPage, status, statusText})=>
                `获取第 ${currentPage} 页数据时出错：${status} - ${statusText}`,
            fetchManyPages: ({message})=>`从多个页面获取数据失败：${message}`,
            genericFetchManyPages: `从多个页面获取数据失败。`,
            fetchNonFollowers: ({message})=>`获取非关注者失败：${message}`,
            genericFetchNonFollowers: `获取非关注者失败。`,
            fetchNonFollowing: ({message})=>`获取未关注用户失败：${message}`,
            genericFetchNonFollowing: `获取未关注用户失败。`,
            unfollowUser:({username,message})=>`取消关注 ${username} 失败：${message}`,
            genericUnfollowUser: `取消关注用户失败。`,
            followUser:({username,message})=>`关注 ${username} 失败：${message}`,
            genericFollowUser: `关注用户失败。`,
        },
        httpErrorMessage: {
            401: [
                "要生成您的 Github 个人访问令牌 -\n",
                "1. 访问 Github 上的 <a href='https://github.com/settings/personal-access-tokens' target='_blank'>个人访问令牌 ↗</a> 部分\n",
                "2. 点击生成新令牌\n",
                "3. 填写令牌名称、到期时间和资源所有者\n",
                "4. 仔细审查并授予令牌所需的细粒度权限\n",
                "在此处使用生成的令牌",
            ],
            403: ["访问被禁止。检查您的权限。"],
            404: ["未找到资源。检查 URL 或标识符。"],
            500: ["内部服务器错误。请稍后再试。"],
        }
    },
    hi: {
        githubUsername: "GitHub उपयोगकर्ता नाम",
        githubApiKey: "GitHub API कुंजी",
        getApiKey: "अपनी API कुंजी प्राप्त करें",
        search: "खोजें",
        searching: "खोज जारी है...",
        nonFollowers: "वे उपयोगकर्ता जिन्हें आप फॉलो करते हैं लेकिन वे आपको फॉलो नहीं करते:",
        nonFollowing: "वे उपयोगकर्ता जो आपको फॉलो करते हैं लेकिन आप उन्हें फॉलो नहीं करते:",
        noUsersFound: "कोई उपयोगकर्ता नहीं मिला।",
        unfollowing: "अनफॉलो कर रहे हैं...",
        follow: "फॉलो करें",
        following: "फॉलो कर रहे हैं...",
        unfollow: "अनफॉलो करें",
        unfollowed: "अनफॉलो किया गया",
        followAll: "सभी को फॉलो करें",
        unfollowAll: "सभी को अनफॉलो करें",
        followingAll: "सभी को फॉलो कर रहे हैं...",
        unfollowingAll: "सभी को अनफॉलो कर रहे हैं...",
        confirmFollowAll: "क्या आप सभी उपयोगकर्ताओं को फॉलो करना चाहते हैं?",
        confirmUnfollowAll: "क्या आप सभी उपयोगकर्ताओं को अनफॉलो करना चाहते हैं?",
        errorMissingCredentials: "कृपया अपना GitHub उपयोगकर्ता नाम और API कुंजी दर्ज करें।",
        confirm: "पुष्टि करें",
        cancel: "रद्द करें",
        close: "बंद करें",
        catchErrorMessage:{
            fetchOnePage: ({currentPage, status, statusText})=>
                `पृष्ठ ${currentPage} पर डेटा लाने में त्रुटि: ${status} - ${statusText}`,
            fetchManyPages: ({message})=>`कई पृष्ठों से डेटा लाने में विफल: ${message}`,
            genericFetchManyPages: `कई पृष्ठों से डेटा लाने में विफल।`,
            fetchNonFollowers: ({message})=>`गैर-फॉलोअर्स लाने में विफल: ${message}`,
            genericFetchNonFollowers: `गैर-फॉलोअर्स लाने में विफल।`,
            fetchNonFollowing: ({message})=>`गैर-फॉलोइंग लाने में विफल: ${message}`,
            genericFetchNonFollowing: `गैर-फॉलोइंग लाने में विफल।`,
            unfollowUser:({username,message})=>`अनफॉलो करने में विफल ${username}: ${message}`,
            genericUnfollowUser: `उपयोगकर्ता को अनफॉलो करने में विफल।`,
            followUser:({username,message})=>`फॉलो करने में विफल ${username}: ${message}`,
            genericFollowUser: `उपयोगकर्ता को फॉलो करने में विफल।`,
        },
        httpErrorMessage: {
            401: [
                "अपने Github व्यक्तिगत पहुंच टोकन को उत्पन्न करने के लिए -\n",
                "1. Github पर <a href='https://github.com/settings/personal-access-tokens' target='_blank'>व्यक्तिगत पहुंच टोकन ↗</a> अनुभाग पर जाएं\n",
                "2. नया टोकन उत्पन्न करने पर क्लिक करें\n",
                "3. टोकन नाम, समाप्ति और संसाधन स्वामी भरें\n",
                "4. अपने टोकन को आवश्यक बारीकियों से अनुमतियों को ध्यान से समीक्षा और अनुदान दें\n",
                "उत्पन्न टोकन का उपयोग यहां करें",
            ],
            403: ["पहुंच निषिद्ध। अपनी अनुमतियों की जांच करें।"],
            404: ["संसाधन नहीं मिला। URL या पहचानकर्ता की जांच करें।"],
            500: ["आंतरिक सर्वर त्रुटि। कृपया बाद में पुन: प्रयास करें।"],
        },
    },
    ar: {
        githubUsername: "اسم مستخدم GitHub",
        githubApiKey: "مفتاح API الخاص بـ GitHub",
        getApiKey: "احصل على مفتاح API الخاص بك",
        search: "بحث",
        searching: "جارٍ البحث...",
        nonFollowers: "المستخدمون الذين تتابعهم ولا يتابعونك:",
        nonFollowing: "المستخدمون الذين يتابعونك ولا تتابعهم:",
        noUsersFound: "لم يتم العثور على مستخدمين.",
        unfollowing: "إلغاء المتابعة...",
        follow: "متابعة",
        following: "جارٍ المتابعة...",
        unfollow: "إلغاء المتابعة",
        unfollowed: "تم إلغاء المتابعة",
        followAll: "متابعة الجميع",
        unfollowAll: "إلغاء متابعة الجميع",
        followingAll: "جارٍ متابعة الجميع...",
        unfollowingAll: "جارٍ إلغاء متابعة الجميع...",
        confirmFollowAll: "هل أنت متأكد من أنك تريد متابعة جميع المستخدمين؟",
        confirmUnfollowAll: "هل أنت متأكد من أنك تريد إلغاء متابعة جميع المستخدمين؟",
        errorMissingCredentials: "الرجاء إدخال اسم المستخدم ومفتاح API الخاص بك في GitHub.",
        confirm: "تأكيد",
        cancel: "إلغاء",
        close: "إغلاق",
        catchErrorMessage:{
            fetchOnePage: ({currentPage, status, statusText})=>
                `خطأ في جلب البيانات في الصفحة ${currentPage}: ${status} - ${statusText}`,
            fetchManyPages: ({message})=>`فشل في جلب البيانات من صفحات متعددة: ${message}`,
            genericFetchManyPages: `فشل في جلب البيانات من صفحات متعددة.`,
            fetchNonFollowers: ({message})=>`فشل في جلب غير المتابعين: ${message}`,
            genericFetchNonFollowers: `فشل في جلب غير المتابعين.`,
            fetchNonFollowing: ({message})=>`فشل في جلب غير المتابعين: ${message}`,
            genericFetchNonFollowing: `فشل في جلب غير المتابعين.`,
            unfollowUser:({username,message})=>`فشل في إلغاء متابعة ${username}: ${message}`,
            genericUnfollowUser: `فشل في إلغاء متابعة المستخدم.`,
            followUser:({username,message})=>`فشل في متابعة ${username}: ${message}`,
            genericFollowUser: `فشل في متابعة المستخدم.`,
        },
        httpErrorMessage: {
            401: [
                "لإنشاء رمز الوصول الشخصي الخاص بك على Github -\n",
                "1. انتقل إلى قسم <a href='https://github.com/settings/personal-access-tokens' target='_blank'>رموز الوصول الشخصية ↗</a> على Github\n",
                "2. انقر على إنشاء رمز جديد\n",
                "3. املأ اسم الرمز، وانتهاء الصلاحية ومالك المورد\n",
                "4. راجع بعناية ومنح الأذونات الدقيقة اللازمة لرمزك\n",
                "استخدم الرمز الذي تم إنشاؤه هنا",
            ],
            403: ["الوصول ممنوع. تحقق من أذوناتك."],
            404: ["المورد غير موجود. تحقق من عنوان URL أو المعرف."],
            500: ["خطأ في الخادم الداخلي. حاول مرة أخرى لاحقًا."],
        }
    },
    ja: {
        githubUsername: "GitHub ユーザー名",
        githubApiKey: "GitHub API キー",
        getApiKey: "API キーを取得",
        search: "検索",
        searching: "検索中...",
        nonFollowers: "フォローしているがフォローされていないユーザー:",
        nonFollowing: "フォローされているがフォローしていないユーザー:",
        noUsersFound: "ユーザーが見つかりません。",
        unfollowing: "フォロー解除中...",
        follow: "フォロー",
        following: "フォロー中...",
        unfollow: "フォロー解除",
        unfollowed: "フォロー解除済み",
        followAll: "すべてフォロー",
        unfollowAll: "すべてフォロー解除",
        followingAll: "すべてフォロー中...",
        unfollowingAll: "すべてフォロー解除中...",
        confirmFollowAll: "すべてのユーザーをフォローしますか？",
        confirmUnfollowAll: "すべてのユーザーのフォローを解除しますか？",
        errorMissingCredentials: "GitHubのユーザー名とAPIキーを入力してください。",
        confirm: "確認",
        cancel: "キャンセル",
        close: "閉じる",
        catchErrorMessage:{
            fetchOnePage: ({currentPage, status, statusText})=>
                `ページ ${currentPage} のデータ取得エラー: ${status} - ${statusText}`,
            fetchManyPages: ({message})=>`複数ページのデータ取得に失敗しました: ${message}`,
            genericFetchManyPages: `複数ページのデータ取得に失敗しました。`,
            fetchNonFollowers: ({message})=>`非フォロワーの取得に失敗しました: ${message}`,
            genericFetchNonFollowers: `非フォロワーの取得に失敗しました。`,
            fetchNonFollowing: ({message})=>`非フォローの取得に失敗しました: ${message}`,
            genericFetchNonFollowing: `非フォローの取得に失敗しました。`,
            unfollowUser:({username,message})=>`${username} のフォロー解除に失敗しました: ${message}`,
            genericUnfollowUser: `ユーザーのフォロー解除に失敗しました。`,
            followUser:({username,message})=>`${username} のフォローに失敗しました: ${message}`,
            genericFollowUser: `ユーザーのフォローに失敗しました。`,
        },
        httpErrorMessage: {
            401: [
                "Github の個人用アクセストークンを生成するには -\n",
                "1. Github の <a href='https://github.com/settings/personal-access-tokens' target='_blank'>個人用アクセストークン ↗</a> セクションにアクセス\n",
                "2. 新しいトークンを生成するをクリック\n",
                "3. トークン名、有効期限、リソース所有者を入力\n",
                "4. トークンに必要な詳細な権限を注意深く確認し、付与\n",
                "生成されたトークンをここで使用",
            ],
            403: ["アクセス禁止。権限を確認してください。"],
            404: ["リソースが見つかりません。URL または識別子を確認してください。"],
            500: ["内部サーバーエラー。後でもう一度試してください。"],
        }
    },
}
