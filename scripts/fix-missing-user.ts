#!/usr/bin/env tsx

/**
 * Emergency script to fix missing user records in local database
 * Use when users exist in Supabase Auth but missing from local users table
 */

import { db } from "@/lib/drizzle/db";
import { users } from "@/lib/drizzle/schema";
import { createSupabaseServerAdminClient } from "@/lib/supabase/admin";
import { eq } from "drizzle-orm";

async function fixMissingUsers(): Promise<void> {
  try {
    console.log("🔍 Checking for missing user records...");

    // Get current authenticated users from Supabase using admin client
    const supabase = createSupabaseServerAdminClient();
    const { data: authUsers, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error("❌ Error fetching auth users:", error);
      return;
    }

    if (!authUsers?.users || authUsers.users.length === 0) {
      console.log("ℹ️ No users found in Supabase Auth");
      return;
    }

    console.log(`📊 Found ${authUsers.users.length} users in Supabase Auth`);

    // Check each auth user against local database
    for (const authUser of authUsers.users) {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.id, authUser.id))
        .limit(1);

      if (existingUser.length === 0) {
        console.log(`⚠️ Missing user record for: ${authUser.email} (${authUser.id})`);
        
        // Extract full name from metadata
        const fullName = authUser.user_metadata?.full_name || 
                        authUser.user_metadata?.name || 
                        '';

        // Create missing user record
        await db.insert(users).values({
          id: authUser.id,
          email: authUser.email || '',
          full_name: fullName,
          role: 'member', // Default role
          created_at: new Date(authUser.created_at),
          updated_at: new Date()
        });

        console.log(`✅ Created user record for: ${authUser.email}`);
      } else {
        console.log(`✓ User record exists for: ${authUser.email}`);
      }
    }

    console.log("🎉 User record sync completed!");

  } catch (error) {
    console.error("❌ Error in fixMissingUsers:", error);
    throw error;
  }
}

// Run the fix if this script is executed directly
if (require.main === module) {
  fixMissingUsers()
    .then(() => {
      console.log("✨ User fix completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 User fix failed:", error);
      process.exit(1);
    });
}

export { fixMissingUsers };
