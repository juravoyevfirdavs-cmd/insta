<template>
  <div class="profile-page" v-if="user">
    <!-- 1. Profilning yuqori qismi (Rasm, Ism, Statistika) -->
    <div class="profile-header">
      <div class="profile-avatar">
        <img v-if="user.profilePic" :src="user.profilePic" alt="avatar" />
        <div v-else class="avatar-placeholder"></div>
      </div>
      
      <div class="profile-info">
        <div class="top-row">
          <h2>{{ user.username }}</h2>
          
          <!-- Tugmalar: Tahrirlash va 3 ta nuqta (Menyu) -->
          <button v-if="isMyProfile" class="btn-edit">Profilni tahrirlash</button>
          <button v-else @click="toggleFollow" class="btn-follow" :class="{ 'following': isFollowing }">
            {{ isFollowing ? 'Obunani bekor qilish' : 'Obuna bo\'lish' }}
          </button>
          
          <!-- 3 TA NUQTA (SOZLAMALAR MENYUSI) -->
          <div class="menu-container">
            <button class="menu-btn" @click="showMenu = !showMenu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="1.5"></circle>
                <circle cx="6" cy="12" r="1.5"></circle>
                <circle cx="18" cy="12" r="1.5"></circle>
              </svg>
            </button>
            
            <!-- Ochiladigan menyu -->
            <div v-if="showMenu" class="dropdown-menu">
              <router-link to="/settings" class="menu-item" @click="showMenu = false">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                Sozlamalar
              </router-link>
              <button class="menu-item text-red" @click="logout">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Chiqish
              </button>
            </div>
          </div>
        </div>
        
        <div class="stats">
          <span><strong>{{ posts.length }}</strong> post</span>
          <span><strong>{{ user.followers?.length || 0 }}</strong> obunachi</span>
          <span><strong>{{ user.following?.length || 0 }}</strong> obuna</span>
        </div>
        
        <p class="fullname">{{ user.fullName || 'Foydalanuvchi' }}</p>
        <p class="bio">{{ user.bio || 'Bio yo\'q' }}</p>
      </div>
    </div>

    <!-- 2. Postlar qismi -->
    <div class="profile-posts" v-if="posts.length > 0">
      <div class="post-item" v-for="post in posts" :key="post._id">
        <img :src="post.imageUrl" alt="post" />
      </div>
    </div>
    <div v-else class="no-posts">
      <div class="icon-circle">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      </div>
      <h3>Hozircha postlar yo'q</h3>
    </div>
  </div>
  
  <!-- Yuklanmoqda (Spinner) -->
  <div v-else class="loading-state">
    <p>Yuklanmoqda...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import http from '../api/http';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const user = ref(null);
const posts = ref([]);
const isFollowing = ref(false);
const showMenu = ref(false); // 3 ta nuqta menyusi holati

// O'z profilimizmi yoki boshqanikini aniqlash
const isMyProfile = computed(() => {
  if (!user.value || !authStore.user) return false;
  return user.value._id === authStore.user._id;
});

const fetchProfile = async () => {
  try {
    // Agar URL da username bo'lsa, o'shani olamiz. Bo'lmasa, o'zimiznikini.
    const username = route.params.username || authStore.user?.username;
    if (!username) return; // Agar user ham yo'q bo'lsa kutamiz

    const res = await http.get(`/auth/profile/${username}`);
    user.value = res.data.user;
    posts.value = res.data.posts;
    
    if (!isMyProfile.value) {
      isFollowing.value = user.value.followers.some(f => f._id === authStore.user._id);
    }
  } catch (err) {
    console.error("Profilni yuklashda xato:", err);
  }
};

onMounted(() => {
  // Agar store da user bo'lsa, darhol yuklaymiz
  if (authStore.user) fetchProfile();
});

// Agar authStore keyinroq yuklansa (sessiya tiklanayotganda), qayta ishga tushadi
watch(() => authStore.user, (newVal) => {
  if (newVal) fetchProfile();
});

watch(() => route.params.username, fetchProfile);

const toggleFollow = async () => {
  try {
    const res = await http.put(`/auth/follow/${user.value._id}`);
    isFollowing.value = res.data.isFollowing;
    if (res.data.isFollowing) {
      user.value.followers.push(authStore.user);
    } else {
      user.value.followers = user.value.followers.filter(f => f._id !== authStore.user._id);
    }
  } catch (err) {
    console.error("Obuna bo'lishda xato:", err);
  }
};

const logout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};
</script>

<style scoped>
.profile-page { width: 100%; max-width: 935px; padding: 40px 20px; color: #fff; }

/* HEADER */
.profile-header { display: flex; align-items: flex-start; gap: 80px; margin-bottom: 60px; }
.profile-avatar { width: 150px; height: 150px; border-radius: 50%; background: #333; overflow: hidden; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
.avatar-placeholder { width: 100%; height: 100%; background: #555; }

.profile-info { flex: 1; }
.top-row { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
.top-row h2 { font-size: 28px; margin: 0; }

.btn-edit, .btn-follow { background: #efefef; color: #000; border: none; padding: 8px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
.btn-follow { background: #0095f6; color: #fff; }
.btn-follow.following { background: #363636; }
.btn-follow:hover { transform: translateY(-2px); }

/* 3 ta nuqta menyusi */
.menu-container { position: relative; }
.menu-btn { background: transparent; border: none; color: #fff; cursor: pointer; padding: 5px; display: flex; align-items: center; }
.menu-btn:hover { color: #aaa; }
.dropdown-menu { position: absolute; top: 35px; right: 0; background: #262626; border: 1px solid #363636; border-radius: 8px; width: 200px; display: flex; flex-direction: column; z-index: 100; box-shadow: 0 4px 12px rgba(0,0,0,0.5); overflow: hidden; }
.menu-item { display: flex; align-items: center; gap: 10px; padding: 12px 16px; color: #fff; text-decoration: none; font-size: 14px; background: transparent; border: none; text-align: left; cursor: pointer; }
.menu-item:hover { background: rgba(255,255,255,0.1); }
.menu-item.text-red { color: #ed4956; }

.stats { display: flex; gap: 30px; font-size: 16px; margin-bottom: 20px; }
.fullname { font-weight: 600; margin-bottom: 5px; }
.bio { color: #a8a8a8; font-size: 14px; }

/* POSTLAR */
.profile-posts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; border-top: 1px solid #262626; padding-top: 20px; }
.post-item { aspect-ratio: 1/1; background: #1a1a1a; overflow: hidden; }
.post-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.post-item:hover img { transform: scale(1.05); }

/* BO'SH HOLAT */
.no-posts { text-align: center; padding: 60px 0; border-top: 1px solid #262626; }
.no-posts .icon-circle { width: 60px; height: 60px; border: 2px solid #555; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; }
.no-posts h3 { font-size: 20px; font-weight: 400; }
.loading-state { color: #fff; text-align: center; padding: 50px; }

/* OQ REJIM (LIGHT MODE) */
body.light-theme .profile-page { color: #000; }
body.light-theme .profile-avatar { background: #dbdbdb; }
body.light-theme .btn-edit { background: #efefef; color: #000; }
body.light-theme .menu-btn { color: #000; }
body.light-theme .dropdown-menu { background: #fff; border-color: #dbdbdb; }
body.light-theme .menu-item { color: #000; }
body.light-theme .menu-item:hover { background: rgba(0,0,0,0.05); }
body.light-theme .menu-item.text-red { color: #ed4956; }
body.light-theme .bio { color: #666; }
body.light-theme .profile-posts, body.light-theme .no-posts { border-top-color: #dbdbdb; }
body.light-theme .no-posts h3 { color: #000; }
body.light-theme .no-posts .icon-circle { border-color: #ccc; }
body.light-theme .loading-state { color: #000; }
</style>