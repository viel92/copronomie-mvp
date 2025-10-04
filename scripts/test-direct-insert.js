// Test direct avec le client Supabase pour voir l'erreur exacte
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: './apps/api/.env' })

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function test() {
  console.log('🔍 Test insertion dans syndics...')

  const testData = {
    user_id: '00000000-0000-0000-0000-000000000001', // UUID bidon
    company: 'Test Company'
  }

  console.log('📤 Données envoyées:', testData)

  const { data, error } = await supabaseAdmin
    .from('syndics')
    .insert(testData)
    .select()

  if (error) {
    console.log('❌ ERREUR COMPLÈTE:', JSON.stringify(error, null, 2))
  } else {
    console.log('✅ SUCCESS:', data)
  }
}

test()
