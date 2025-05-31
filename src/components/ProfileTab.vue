<template>
  <div
    class="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-2xl px-10 py-12 space-y-10"
  >
    <!-- Avatar -->
    <div class="flex flex-col items-center">
      <div
        class="w-32 h-32 rounded-full bg-indigo-600 text-white flex items-center justify-center text-4xl font-bold shadow-lg"
      >
        {{ avatarInitials }}
      </div>
      <p class="text-sm text-gray-500 mt-2">Avatar generated from your name</p>
    </div>

    <!-- Editable Fields -->
    <div class="space-y-8">
      <!-- Username -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Username</label>
        <div class="flex items-center gap-4">
          <input
            v-model="editableFields.name"
            :readonly="!editMode.name"
            class="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-800 bg-white shadow-sm"
          />
          <div v-if="editMode.name" class="flex gap-2">
            <button
              @click="saveName"
              class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Save
            </button>
            <button
              @click="editMode.name = false"
              class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
          <button
            v-else
            @click="editMode.name = true"
            class="text-indigo-600 font-medium hover:underline"
          >
            Edit
          </button>
        </div>
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
        <input
          v-model="editableFields.email"
          readonly
          class="w-full px-4 py-3 rounded-md border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
        />
        <p class="text-xs text-gray-400 mt-1">Email can’t be changed</p>
      </div>

      <!-- Password -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Password</label>
        <div class="flex items-center gap-4">
          <input
            v-model="editableFields.password"
            :readonly="!editMode.password"
            type="password"
            placeholder="********"
            class="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-800 shadow-sm"
          />
          <div v-if="editMode.password" class="flex gap-2">
            <button
              @click="savePassword"
              class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Save
            </button>
            <button
              @click="editMode.password = false"
              class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
          <button
            v-else
            @click="editMode.password = true"
            class="text-indigo-600 font-medium hover:underline"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import Swal from 'sweetalert2'
import { updateProfile } from 'firebase/auth'
import { currentUser } from '@/firebase/userState'
import { updateUserPassword, updateUserName } from '@/firebase/firebaseService'
import { auth } from '@/firebase/firebaseConfig'

const editMode = reactive({
  name: false,
  password: false,
})

const editableFields = reactive({
  name: '',
  email: '',
  password: '',
})

const avatarInitials = computed(() => {
  const name = currentUser.value?.displayName || ''
  return name.slice(0, 2).toUpperCase() || '??'
})

watch(
  currentUser,
  (user) => {
    if (user) {
      editableFields.name = user.name || ''
      editableFields.email = user.email || ''
      editableFields.password = ''
    }
  },
  { immediate: true },
)

const saveName = async () => {
  if (!auth.currentUser || !editableFields.name.trim()) return
  try {
    await updateProfile(auth.currentUser, { displayName: editableFields.name })
    await updateUserName(auth.currentUser.uid, editableFields.name)
    currentUser.value.name = editableFields.name
    editMode.name = false
    Swal.fire('Updated!', 'Your name has been updated.', 'success')
  } catch (err) {
    console.error('Error updating name:', err)
    Swal.fire('Error', 'Failed to update name.', 'error')
  }
}

const savePassword = async () => {
  if (!auth.currentUser || !editableFields.password.trim()) return

  const { value: currentPassword } = await Swal.fire({
    title: 'Reauthenticate',
    input: 'password',
    inputLabel: 'Enter your current password',
    inputPlaceholder: 'Current password',
    inputAttributes: {
      autocapitalize: 'off',
      autocorrect: 'off',
    },
    showCancelButton: true,
  })

  if (!currentPassword) return

  try {
    await updateUserPassword(currentPassword, editableFields.password)
    editableFields.password = ''
    editMode.password = false
    Swal.fire('Updated!', 'Password updated successfully.', 'success')
  } catch (err) {
    console.error('Error updating password:', err)
    Swal.fire('Error', 'Failed to update password. Check your current password.', 'error')
  }
}
</script>
