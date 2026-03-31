import {
  Flame,
  CheckCircle2,
  TimerOff,
  Timer,
  Lightbulb,
  Eye,
} from "lucide-react";

export function StreakCard({
  current,
  longest,
}: {
  current: number;
  longest: number;
}) {
  return (
    <div className="bg-surface-high p-8 rounded-[2rem] flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-tertiary-container/10 rounded-2xl flex items-center justify-center mb-4">
        <Flame className="text-tertiary-container" size={32} fill="red" />
      </div>
      <h3 className="text-sm text-on-surface-variant font-medium uppercase tracking-widest">
        Current Streak
      </h3>
      <p className="text-5xl font-black mt-2 text-on-surface">
        {current}
        <span className="text-lg font-medium text-on-surface-variant">
          days
        </span>
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-on-surface-variant/60">
        Best {longest} days
      </p>
      <p className="text-xs text-on-surface-variant/60 mt-4 leading-relaxed">
        You&apos;re in the top 5% of developers prioritizing ocular health this week.
      </p>
    </div>
  );
}

export function TodayStatsCard({
  breaksTaken,
  breaksMissed,
  totalScreenTime,
}: {
  breaksTaken: number;
  breaksMissed: number;
  totalScreenTime: number;
}) {
  const formatScreenTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  };

  const stats = [
    {
      label: "Taken",
      value: breaksTaken,
      icon: CheckCircle2,
      color: "text-secondary",
      bg: "bg-secondary-container/10",
    },
    {
      label: "Missed",
      value: breaksMissed,
      icon: TimerOff,
      color: "text-tertiary-container",
      bg: "bg-tertiary-container/10",
    },
    {
      label: "Focus Time",
      value: formatScreenTime(totalScreenTime),
      icon: Timer,
      color: "text-on-surface-variant",
      bg: "bg-surface-highest",
    },
  ];

  return (
    <div className="bg-surface-high p-8 rounded-[2rem]">
      <h3 className="text-lg font-bold font-manrope mb-8">Today Stats</h3>
      <div className="space-y-6">
        {stats.map((stat, idx) => (
          <div key={stat.label}>
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full ${stat.bg} flex items-center justify-center`}
                >
                  <stat.icon className={stat.color} size={18} />
                </div>
                <span className="font-medium text-on-surface">
                  {stat.label}
                </span>
              </div>
              <span className="text-xl font-bold font-manrope">
                {stat.value}
              </span>
            </div>
            {idx < stats.length - 1 && (
              <div className="h-px bg-outline-variant/5 mt-6" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProTipCard() {
  return (
    <div className="bg-surface-highest/40 backdrop-blur-xl border border-outline-variant/10 p-6 rounded-[2rem] relative overflow-hidden">
      <div className="relative z-10">
        <Lightbulb className="text-primary mb-3" size={24} />
        <h4 className="font-bold text-on-surface mb-2">Pro Tip</h4>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Try the 20-20-20 rule. Every 20 minutes, look at something 20 feet
          away for 20 seconds.
        </p>
      </div>
      <div className="absolute -bottom-8 -right-8 opacity-10">
        <Eye size={160} />
      </div>
    </div>
  );
}
