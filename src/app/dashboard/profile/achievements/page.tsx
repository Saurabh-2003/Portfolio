"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Achievement {
  id: string;
  title: string;
  description?: string;
  created_at: string;
}

export default function AchievementsSection() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch("/api/achievements")
      .then((res) => res.json())
      .then((data) => setAchievements(data))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    const res = await fetch("/api/achievements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    if (res.ok) {
      const newAchievement = await res.json();
      setAchievements([newAchievement, ...achievements]);
      setTitle("");
      setDescription("");
    }
    setAdding(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAdd} className="space-y-2 mb-4">
          <Input
            placeholder="Achievement title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Achievement description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button type="submit" disabled={adding || !title} className="w-full">
            Add Achievement
          </Button>
        </form>
        {loading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : achievements.length === 0 ? (
          <div className="text-muted-foreground">No achievements yet.</div>
        ) : (
          <ul className="space-y-2">
            {achievements.map((ach) => (
              <li key={ach.id} className="border rounded p-3">
                <div className="font-semibold">{ach.title}</div>
                {ach.description && (
                  <div className="text-sm text-muted-foreground">
                    {ach.description}
                  </div>
                )}
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date(ach.created_at).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
