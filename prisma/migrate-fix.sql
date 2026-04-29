-- Create the NewsPost table if it doesn't exist
CREATE TABLE IF NOT EXISTS "public"."NewsPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "category" TEXT NOT NULL,
    "image" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsPost_pkey" PRIMARY KEY ("id")
);

-- Create the ManagedAdmin table if it doesn't exist
CREATE TABLE IF NOT EXISTS "public"."ManagedAdmin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'CONTENT_EDITOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManagedAdmin_pkey" PRIMARY KEY ("id")
);

-- Create indices
CREATE UNIQUE INDEX IF NOT EXISTS "NewsPost_slug_key" ON "public"."NewsPost"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "ManagedAdmin_email_key" ON "public"."ManagedAdmin"("email");
