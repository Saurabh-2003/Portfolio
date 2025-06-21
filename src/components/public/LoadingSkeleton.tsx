import { AnimatedSkeleton } from "@/components/public/animated-sections";

export function LoadingSkeleton() {
  return (
    <div className="space-y-16 pt-16">
      {/* Hero Skeleton */}
      <section className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <AnimatedSkeleton className="w-32 h-32 mx-auto rounded-full" />
            <div className="space-y-2">
              <AnimatedSkeleton className="h-12 w-64 mx-auto rounded" />
              <AnimatedSkeleton className="h-6 w-48 mx-auto rounded" />
            </div>
            <AnimatedSkeleton className="h-20 w-full max-w-2xl mx-auto rounded" />
          </div>
        </div>
      </section>

      {/* Content Skeletons */}
      {[1, 2, 3].map((i) => (
        <section key={i} className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSkeleton className="h-8 w-48 rounded mb-8 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((j) => (
                <AnimatedSkeleton key={j} className="h-64 rounded-lg" />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
