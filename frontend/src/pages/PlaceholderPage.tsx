import React from "react";
import EmptyState from "../components/ui/EmptyState";

interface PlaceholderPageProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function PlaceholderPage({ icon, title, description }: PlaceholderPageProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-5 py-6 flex items-center justify-center min-h-[60vh]">
        <EmptyState icon={icon} title={title} description={description} />
      </div>
    </div>
  );
}
