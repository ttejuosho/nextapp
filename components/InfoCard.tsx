// InfoCard.tsx
import React from "react";

interface InfoCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon?: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  subtitle,
  description,
  icon,
}) => {
  return (
    <div className="flex-1 bg-[#28394b]/20 backdrop-blur-sm border border-white/30 rounded-lg shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] p-4 text-white relative">
      {/* Overlays */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/60 via-transparent to-transparent opacity-70 pointer-events-none"></div>
      <div className="absolute inset-0 rounded-lg bg-gradient-to-tl from-white/30 via-transparent to-transparent opacity-50 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center border border-white/30">
            {icon || (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold">{title}</h3>
            <p className="text-xs opacity-60">{subtitle}</p>
          </div>
        </div>
        <p className="text-xs opacity-70 mt-3">{description}</p>
      </div>
    </div>
  );
};

export default InfoCard;
