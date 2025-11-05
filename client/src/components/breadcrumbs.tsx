import React from 'react';

type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items, className = '' }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={`mb-4 text-sm text-white/70 ${className}`}>
      <ol className="mx-auto max-w-3xl flex items-center justify-center gap-2 text-center">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-2">
              {isLast || !item.href ? (
                <span className="text-white">{item.label}</span>
              ) : (
                <a href={item.href} className="hover:text-white">{item.label}</a>
              )}
              {!isLast && <span aria-hidden>›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
