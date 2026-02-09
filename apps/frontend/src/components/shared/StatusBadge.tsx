import { cn } from '@/lib/utils';

type Status = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

const statusConfig: Record<Status, { label: string; className: string; dotColor: string }> = {
  DRAFT: {
    label: 'Draft',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    dotColor: 'bg-amber-500',
  },
  ACTIVE: {
    label: 'Active',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotColor: 'bg-emerald-500',
  },
  ARCHIVED: {
    label: 'Archived',
    className: 'bg-gray-50 text-gray-600 border-gray-200',
    dotColor: 'bg-gray-400',
  },
};

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border',
        config.className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dotColor)} />
      {config.label}
    </span>
  );
}
