import { ref } from 'vue'
import { defineStore } from 'pinia'
import http from '../api/http' // @ o'rniga ../ ishlatildi (agar alias sozlanmagan bo'lsa)

export const usePostsStore = defineStore('posts', () => {
  const feed = ref([])
  const saved = ref([])
  const profilePosts = ref({})
  const loading = ref(false)

  async function fetchFeed() {
    loading.value = true
    try {
      const { data } = await http.get('/posts') // '/posts/feed' o'rniga oddiy '/posts' (backendda shunday bo'lsa)
      feed.value = data
    } finally {
      loading.value = false
    }
  }

  async function createPost(payload) {
    const { data } = await http.post('/posts', payload)
    feed.value.unshift(data)
    return data
  }

  async function toggleLike(postId) {
    const { data } = await http.put(`/posts/${postId}/like`)
    const post = feed.value.find(p => p._id === postId)
    if (post) post.likes = data.likes
    return data
  }

  async function toggleSave(postId) {
    const { data } = await http.put(`/posts/${postId}/save`)
    return data
  }

  async function addComment(postId, text) {
    const { data } = await http.post(`/posts/${postId}/comment`, { text })
    const post = feed.value.find(p => p._id === postId)
    if (post) post.comments.push(data)
    return data
  }

  async function fetchSaved() {
    const { data } = await http.get('/posts/saved')
    saved.value = data
  }

  async function fetchUserPosts(username) {
    // Backendda route qanday ekanligini tekshiring. 
    // Odatda /auth/profile/:username bo'ladi.
    const { data } = await http.get(`/auth/profile/${username}`) 
    profilePosts.value[username] = data.posts
    return data
  }

  return {
    feed, saved, profilePosts, loading,
    fetchFeed, createPost, toggleLike, toggleSave, addComment, fetchSaved, fetchUserPosts,
  }
})