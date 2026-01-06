import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 ml-12 sm:ml-0 print:ml-0">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground print:text-black">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1 print:text-gray-600">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 sm:gap-3 print:hidden">{actions}</div>}
    </div>
  );
}