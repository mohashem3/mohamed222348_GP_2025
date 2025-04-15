// scripts/cleanup.js

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'

// Load service account key
const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'))

// Initialize Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount),
})

const db = getFirestore()

async function deleteAllReviews() {
  const snapshot = await db.collection('reviews').get()
  const batchSize = 500
  let deleted = 0

  const batches = []
  snapshot.docs.forEach((docSnap, i) => {
    if (i % batchSize === 0) {
      batches.push(db.batch())
    }
    batches[batches.length - 1].delete(docSnap.ref)
    deleted++
  })

  for (const batch of batches) {
    await batch.commit()
  }

  console.log(`✅ Deleted ${deleted} review(s) successfully.`)
}

deleteAllReviews().catch((err) => {
  console.error('❌ Error during cleanup:', err)
})
