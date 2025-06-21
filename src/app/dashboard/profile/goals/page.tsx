"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Goal {
  id: string;
  title: string;
  description?: string;
  created_at: string;
}

export default function GoalsSection() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch("/api/goals")
      .then((res) => res.json())
      .then((data) => setGoals(data))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    if (res.ok) {
      const newGoal = await res.json();
      setGoals([newGoal, ...goals]);
      setTitle("");
      setDescription("");
    }
    setAdding(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAdd} className="space-y-2 mb-4">
          <Input
            placeholder="Goal title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Goal description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button type="submit" disabled={adding || !title} className="w-full">
            Add Goal
          </Button>
        </form>
        {loading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : goals.length === 0 ? (
          <div className="text-muted-foreground">No goals yet.</div>
        ) : (
          <ul className="space-y-2">
            {goals.map((goal) => (
              <li key={goal.id} className="border rounded p-3">
                <div className="font-semibold">{goal.title}</div>
                {goal.description && (
                  <div className="text-sm text-muted-foreground">
                    {goal.description}
                  </div>
                )}
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date(goal.created_at).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
