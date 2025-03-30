<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
    <div class="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>

      <!-- Profile Image Preview -->
      <div class="mb-6">
        <img
          :src="previewImage || defaultAvatar"
          alt="Profile"
          class="w-32 h-32 rounded-full mx-auto shadow-md object-cover"
        />
      </div>

      <!-- Image Upload -->
      <div class="mb-4">
        <input
          type="file"
          accept="image/*"
          @change="handleFileChange"
          class="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-100 file:text-pink-600 hover:file:bg-pink-200 transition"
        />
      </div>

      <!-- Save Button -->
      <button
        class="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-lg shadow"
        @click="handleSave"
        :disabled="!selectedFile || isUploading"
      >
        <span v-if="isUploading">Uploading...</span>
        <span v-else>Save Photo</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth } from 'firebase/auth'
import { storage, db } from '@/firebase/firebaseConfig'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, updateDoc } from 'firebase/firestore'
import Swal from 'sweetalert2'

const defaultAvatar = 'https://i.pravatar.cc/150?img=68'
const previewImage = ref(null)
const selectedFile = ref(null)
const isUploading = ref(false)

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    selectedFile.value = file
    previewImage.value = URL.createObjectURL(file)
  }
}

const handleSave = async () => {
  if (!selectedFile.value) return

  isUploading.value = true
  const auth = getAuth()
  const user = auth.currentUser

  try {
    const fileRef = storageRef(storage, `profilePhotos/${user.uid}`)
    await uploadBytes(fileRef, selectedFile.value)
    const downloadURL = await getDownloadURL(fileRef)

    const userDocRef = doc(db, 'users', user.uid)
    await updateDoc(userDocRef, {
      photoURL: downloadURL,
    })

    Swal.fire('Success!', 'Profile photo updated successfully.', 'success')
  } catch (err) {
    console.error(err)
    Swal.fire('Error', 'Failed to upload photo.', 'error')
  } finally {
    isUploading.value = false
  }
}
</script>
