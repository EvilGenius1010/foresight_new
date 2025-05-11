import React from "react";

interface GlassMorphicCardProps {
  title: string;
  description: string;
}

const GlassMorphicCard: React.FC<GlassMorphicCardProps> = ({ title, description }) => {
  return (
    <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-md">
      <h3 className="font-grotesk text-2xl mb-2">{title}</h3>
      <p className="text-sm text-gray-300">{description}</p>
    </div>
  );
};

export default GlassMorphicCard;
