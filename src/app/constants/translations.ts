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
}

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
    },
}
