"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GitFork, Users, Star } from "lucide-react";

type GitHubStats = {
  public_repos: number;
  followers: number;
  following: number;
  stargazers_count: number;
};

const StatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
          {value}
        </h3>
      </div>
      <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
        <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/users/your-username",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch GitHub stats");
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGitHubStats();
  }, []);

  if (error) {
    return (
      <div className="text-center text-red-500 dark:text-red-400 py-8">
        {error}
      </div>
    );
  }

  return (
    <section
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      id="dashboard"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          GitHub Dashboard
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          A quick overview of my GitHub activity and statistics
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 dark:bg-gray-800 animate-pulse h-32 rounded-xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <StatCard
            title="Public Repositories"
            value={stats?.public_repos || 0}
            icon={GitFork}
          />
          <StatCard
            title="Followers"
            value={stats?.followers || 0}
            icon={Users}
          />
          <StatCard
            title="Following"
            value={stats?.following || 0}
            icon={Star}
          />
        </div>
      )}
    </section>
  );
};

export default Dashboard;
