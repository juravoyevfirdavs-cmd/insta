<template>
  <div class="home-layout">
    <div class="feed">
      <!-- Post qo'shish modali (Создать tugmasi uchun) -->
      <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
        <div class="modal-content">
          <h2>Yangi Post</h2>
          <input v-model="newPost.imageUrl" placeholder="Rasm URL manzili (jpg/png)" class="input-field" />
          <input v-model="newPost.caption" placeholder="Izoh yozing..." class="input-field" />
          <div class="modal-actions">
            <button @click="showCreateModal = false" class="btn-cancel">Bekor</button>
            <button @click="submitPost" class="btn-submit">Yuklash</button>
          </div>
        </div>
      </div>

      <!-- Postlar ro'yxati -->
      <div class="post" v-for="post in posts" :key="post._id">
        <div class="post-header">
          <div class="user">
            <div class="avatar"></div>
            <span class="username">{{ post.user.username }}</span>
          </div>
        </div>
        <div class="post-image">
          <img :src="post.imageUrl" style="width: 100%; object-fit: cover;" alt="Post" />
        </div>
        <div class="post-actions">
          <div class="like-btn" @click="likePost(post)">
            <svg :fill="post.likes?.includes(authStore.user?._id) ? '#ff3040' : 'none'" :stroke="post.likes?.includes(authStore.user?._id) ? '#ff3040' : 'white'" width="26" height="26" viewBox="0 0 24 24" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span>{{ post.likes?.length || 0 }}</span>
          </div>
        </div>
        <div class="post-caption"><strong>{{ post.user.username }}</strong> {{ post.caption }}</div>
      </div>
    </div>

    <!-- O'ng panel -->
    <div class="right-panel">
      <div class="current-user" @click="$router.push('/profile')">
        <div class="avatar"></div>
        <div class="info">
          <span class="username">{{ authStore?.user?.username || 'user' }}</span>
          <span class="name">{{ $t('home.yourName') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import http from '../api/http';

const authStore = useAuthStore();
const route = useRoute();
const posts = ref([]);
const showCreateModal = ref(false);
const newPost = ref({ imageUrl: '', caption: '' });

onMounted(async () => {
  await fetchPosts();
  if (route.query.create === 'true') showCreateModal.value = true;
});

watch(() => route.query.create, (val) => {
  if (val === 'true') showCreateModal.value = true;
});

const fetchPosts = async () => {
  try {
    const res = await http.get('/posts');
    posts.value = res.data;
  } catch (e) { console.log(e); }
};

const submitPost = async () => {
  if (!newPost.value.imageUrl) return alert("Rasm URL kiriting!");
  try {
    const res = await http.post('/posts', newPost.value);
    posts.value.unshift(res.data);
    showCreateModal.value = false;
    newPost.value = { imageUrl: '', caption: '' };
  } catch (e) { alert("Xatolik"); }
};

const likePost = async (post) => {
  try {
    const res = await http.put(`/posts/${post._id}/like`);
    post.likes = res.data.likes;
  } catch (e) { console.log(e); }
};
</script>

<style scoped>
/* Sizning eski dizayningiz, faqat modal va layk qo'shildi */
.home-layout { display: flex; max-width: 950px; width: 100%; padding-top: 40px; gap: 60px; }
.feed { width: 470px; display: flex; flex-direction: column; gap: 30px; }
.post { background: rgba(20,20,20,0.6); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding-bottom: 20px; overflow: hidden; animation: slideUp 0.5s ease forwards; opacity: 0; transition: transform 0.3s, box-shadow 0.3s; }
.post:hover { transform: translateY(-4px); box-shadow: 0 12px 25px rgba(0,0,0,0.4); }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.post-header { padding: 16px; }
.user { display: flex; align-items: center; gap: 12px; }
.avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(45deg,#333,#555); border: 2px solid rgba(255,255,255,0.1); }
.username { font-weight: 600; font-size: 14px; color: #fff; }
.post-image { border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); }
.post-actions { padding: 16px; display: flex; gap: 16px; }
.like-btn { display: flex; align-items: center; gap: 6px; cursor: pointer; transition: transform 0.2s; }
.like-btn:hover { transform: scale(1.1); }
.like-btn span { color: #fff; font-size: 14px; }
.post-caption { padding: 0 16px; color: #fff; font-size: 14px; }
.right-panel { width: 320px; padding-top: 10px; }
.current-user { display: flex; align-items: center; margin-bottom: 24px; background: rgba(255,255,255,0.03); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: background 0.3s; }
.current-user:hover { background: rgba(255,255,255,0.08); }
.current-user .info { display: flex; flex-direction: column; margin-left: 16px; }
.current-user .name { color: #888; font-size: 13px; margin-top: 4px; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 2000; }
.modal-content { background: #262626; padding: 30px; border-radius: 12px; width: 400px; border: 1px solid #444; }
.modal-content h2 { margin-bottom: 20px; color: #fff; }
.input-field { width: 100%; padding: 12px; background: #121212; border: 1px solid #363636; color: #fff; border-radius: 8px; margin-bottom: 15px; outline: none; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
.btn-cancel { background: transparent; color: #fff; border: none; cursor: pointer; }
.btn-submit { background: #0095f6; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }

/* Oq rejim */
body.light-theme .post { background: #fff; border-color: #dbdbdb; }
body.light-theme .username, body.light-theme .post-caption { color: #000; }
body.light-theme .avatar { background: linear-gradient(45deg,#dbdbdb,#f0f0f0); }
body.light-theme .current-user { background: #fff; border-color: #dbdbdb; }
body.light-theme .current-user .name { color: #666; }
</style>