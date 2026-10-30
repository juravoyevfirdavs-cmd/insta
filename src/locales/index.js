import { createI18n } from 'vue-i18n'

const messages = {
  uz: {
    nav: {
      home: 'Bosh sahifa', reels: 'Reels', messages: 'Xabarlar',
      notifications: 'Bildirishnomalar', create: 'Yaratish',
      profile: 'Profil', settings: 'Yana (Sozlamalar)'
    },
    settings: {
      title: 'Sozlamalar', theme: 'Mavzu',
      themeDesc: 'Qorong\'u yoki yorug\' mavzuni tanlang',
      darkTheme: 'Qorong\'u', lightTheme: 'Yorug\'',
      language: 'Ilova tili', langDesc: 'Interfeys tilini tanlang',
      private: 'Yopiq akkaunt', privateDesc: 'Postlarni begonalardan yashirish',
      notifications: 'Bildirishnomalar', notifDesc: 'Layk va izohlar haqida xabar',
      account: 'Akkaunt', accountDesc: 'Profil va parolni o\'zgartirish',
      edit: 'O\'zgartirish', logout: 'Akkauntdan chiqish'
    },
    chat: {
      title: 'Xabarlaringiz', desc: 'Do\'stlaringizga shaxsiy xabar yuboring.',
      btn: 'Xabar yuborish', search: 'Qidiruv',
      empty: 'Xabarlar shu yerda paydo bo\'ladi'
    },
    notif: {
      title: 'Bildirishnomalar', all: 'Hammasi', follows: 'Obunalar',
      comments: 'Izohlar', liked: 'suratingizni yoqtirdi', ago: 'oldin',
      recommend: 'Siz uchun tavsiyalar', seeAll: 'Hammasi'
    },
    home: { yourName: 'Sizning ismingiz' }
  },
  ru: {
    nav: {
      home: 'Главная', reels: 'Reels', messages: 'Сообщения',
      notifications: 'Уведомления', create: 'Создать',
      profile: 'Профиль', settings: 'Ещё (Настройки)'
    },
    settings: {
      title: 'Настройки', theme: 'Тема',
      themeDesc: 'Выберите тёмную или светлую тему',
      darkTheme: 'Тёмная', lightTheme: 'Светлая',
      language: 'Язык', langDesc: 'Выберите язык интерфейса',
      private: 'Закрытый аккаунт', privateDesc: 'Скрыть публикации',
      notifications: 'Уведомления', notifDesc: 'О лайках и комментариях',
      account: 'Аккаунт', accountDesc: 'Изменить профиль, пароль',
      edit: 'Изменить', logout: 'Выйти'
    },
    chat: {
      title: 'Ваши сообщения', desc: 'Отправляйте личные сообщения.',
      btn: 'Отправить сообщение', search: 'Поиск',
      empty: 'Здесь появятся чаты'
    },
    notif: {
      title: 'Уведомления', all: 'Все', follows: 'Подписки',
      comments: 'Комментарии', liked: 'лайкнул вашу фотографию', ago: 'назад',
      recommend: 'Рекомендации для вас', seeAll: 'Все'
    },
    home: { yourName: 'Ваше имя' }
  },
  en: {
    nav: {
      home: 'Home', reels: 'Reels', messages: 'Messages',
      notifications: 'Notifications', create: 'Create',
      profile: 'Profile', settings: 'More (Settings)'
    },
    settings: {
      title: 'Settings', theme: 'Theme',
      themeDesc: 'Choose dark or light theme',
      darkTheme: 'Dark', lightTheme: 'Light',
      language: 'Language', langDesc: 'Select interface language',
      private: 'Private Account', privateDesc: 'Hide posts from strangers',
      notifications: 'Notifications', notifDesc: 'Notify about likes',
      account: 'Account', accountDesc: 'Change profile, password',
      edit: 'Edit', logout: 'Log out'
    },
    chat: {
      title: 'Your messages', desc: 'Send private messages.',
      btn: 'Send message', search: 'Search',
      empty: 'Chats will appear here'
    },
    notif: {
      title: 'Notifications', all: 'All', follows: 'Follows',
      comments: 'Comments', liked: 'liked your photo', ago: 'ago',
      recommend: 'Recommended for you', seeAll: 'See All'
    },
    home: { yourName: 'Your name' }
  }
}

const i18n = createI18n({
  locale: localStorage.getItem('language') || 'uz',
  fallbackLocale: 'en',
  messages
})

export default i18n