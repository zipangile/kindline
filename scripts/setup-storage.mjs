import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorage() {
  console.log('Checking for "images" bucket...')
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()

  if (listError) {
    console.error('Error listing buckets:', listError)
    return
  }

  const imagesBucket = buckets.find(b => b.name === 'images')

  if (imagesBucket) {
    console.log('"images" bucket already exists.')
  } else {
    console.log('Creating "images" bucket...')
    const { error: createError } = await supabase.storage.createBucket('images', {
      public: true,
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: 5242880 // 5MB
    })

    if (createError) {
      console.error('Error creating bucket:', createError)
    } else {
      console.log('Bucket "images" created successfully.')
    }
  }
}

setupStorage()
