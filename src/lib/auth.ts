import { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
    };
  }

  interface User {
    id: string;
    username: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Enter your username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username and password are required");
        }

        try {
          // Find user in database
          const user = await prisma.user.findUnique({
            where: {
              username: credentials.username,
            },
          });

          if (!user) {
            throw new Error("Invalid username or password");
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password_hash,
          );

          if (!isValidPassword) {
            throw new Error("Invalid username or password");
          }

          // Return user object (this will be passed to JWT callback)
          return {
            id: user.id,
            username: user.username,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // If user is defined, it means this is the first time the JWT is being created
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user = {
          id: token.id,
          username: token.username,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

// Helper function to get server session
export async function getAuthSession() {
  try {
    const { getServerSession } = await import("next-auth/next");
    const session = await getServerSession(authOptions);
    return session;
  } catch (error) {
    console.error("Error getting auth session:", error);
    return null;
  }
}

// Helper function to check if user is authenticated
export async function requireAuth() {
  const session = await getAuthSession();

  if (!session || !session.user) {
    throw new Error("Authentication required");
  }

  return session;
}

// Helper function to create default admin user if none exists
export async function ensureDefaultUser() {
  try {
    const existingUser = await prisma.user.findFirst();

    if (!existingUser) {
      const username = process.env.DEFAULT_ADMIN_USERNAME || "admin";
      const password = process.env.DEFAULT_ADMIN_PASSWORD || "password123";

      const password_hash = await bcrypt.hash(password, 12);

      await prisma.user.create({
        data: {
          username,
          password_hash,
        },
      });

      console.log(`✅ Default admin user created: ${username}`);
      console.log(`🔑 Default password: ${password}`);
      console.log(
        "⚠️  Please change the default credentials after first login!",
      );
    }
  } catch (error) {
    console.error("Error ensuring default user:", error);
  }
}

// Helper function to change user password
export async function changeUserPassword(userId: string, newPassword: string) {
  try {
    const password_hash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { password_hash },
    });

    return { success: true, message: "Password changed successfully" };
  } catch (error) {
    console.error("Error changing password:", error);
    return { success: false, error: "Failed to change password" };
  }
}

// Helper function to verify current password
export async function verifyUserPassword(
  userId: string,
  currentPassword: string,
): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return false;
    }

    return await bcrypt.compare(currentPassword, user.password_hash);
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}
