import { Calendar, Tag, ArrowRight } from "lucide-react";

interface BlogCardProps {
  title: string;
  excerpt: string;
  category: string;
  slug: string;
  createdAt: string;
}

export default function BlogCard({
  title,
  excerpt,
  category,
  createdAt,
}: BlogCardProps) {
  return (
    <article className="card-cyber p-6 group cursor-pointer">
      <div className="flex items-center gap-3 mb-4">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-neon/10 text-neon text-xs font-medium rounded-full">
          <Tag className="w-3 h-3" />
          {category}
        </span>
        <span className="flex items-center gap-1 text-gray-500 text-xs">
          <Calendar className="w-3 h-3" />
          {new Date(createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-neon transition-colors line-clamp-2">
        {title}
      </h3>

      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
        {excerpt}
      </p>

      <div className="flex items-center text-neon text-sm font-medium">
        Read More <ArrowRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" />
      </div>
    </article>
  );
}
