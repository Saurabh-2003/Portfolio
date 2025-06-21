import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

type PrismaProfile = {
  id: string;
  name: string;
  about: string;
  profile_image?: string | null;
  location?: string | null;
  headline?: string | null;
  availability?: 'available' | 'not_available' | 'freelance' | null;
  created_at: Date;
  updated_at: Date;
};

export async function GET() {
  try {
    // Check authentication
    const session = await getAuthSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all stats in parallel
    const [
      projectsCount,
      experiencesCount,
      skillsCount,
      messagesCount,
      unreadMessagesCount,
      profileExists,
      contactInfoExists,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.experience.count(),
      prisma.skill.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({
        where: { is_read: false },
      }),
      prisma.profile.findFirst().then((profile: PrismaProfile | null) => !!profile),
      prisma.contactInfo.findFirst().then(info => !!info),
    ]);

    // Calculate completion percentage
    const totalModules = 5; // Profile, Projects, Experience, Skills, Contact
    let completedModules = 0;

    if (profileExists) completedModules++;
    if (projectsCount > 0) completedModules++;
    if (experiencesCount > 0) completedModules++;
    if (skillsCount > 0) completedModules++;
    if (contactInfoExists) completedModules++;

    const completionPercentage = Math.round((completedModules / totalModules) * 100);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [recentProjects, recentMessages] = await Promise.all([
      prisma.project.count({
        where: {
          created_at: {
            gte: sevenDaysAgo,
          },
        },
      }),
      prisma.contactMessage.count({
        where: {
          created_at: {
            gte: sevenDaysAgo,
          },
        },
      }),
    ]);

    return NextResponse.json({
      projects: {
        total: projectsCount,
        recent: recentProjects,
      },
      experiences: {
        total: experiencesCount,
      },
      skills: {
        total: skillsCount,
      },
      messages: {
        total: messagesCount,
        unread: unreadMessagesCount,
        recent: recentMessages,
      },
      profile: {
        exists: profileExists,
      },
      contactInfo: {
        exists: contactInfoExists,
      },
      completion: {
        percentage: completionPercentage,
        completed: completedModules,
        total: totalModules,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}
