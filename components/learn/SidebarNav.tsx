'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Menu, X, Search } from 'lucide-react';
import type { SidebarNavProps, NavItem } from '@/types/components';

function NavLeaf({ item, depth = 0 }: { item: Omit<NavItem, 'children'>; depth?: number }) {
  return (
    <Link
      href={item.href}
      aria-current={item.active ? 'page' : undefined}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-body-sm font-medium transition-all ${
        depth > 0 ? 'ml-5 text-[13px]' : ''
      } ${
        item.active
          ? 'bg-primary-100 text-primary-700'
          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
      }`}
    >
      {item.icon && (
        <span className={`flex-shrink-0 ${item.active ? 'text-primary-600' : 'text-neutral-400'}`}>
          {item.icon}
        </span>
      )}
      <span className="truncate">{item.label}</span>
      {item.active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />}
    </Link>
  );
}

function NavGroup({ item }: { item: NavItem }) {
  const hasActive = item.children?.some((c) => c.active);
  const [open, setOpen] = useState(hasActive ?? false);

  if (!item.children?.length) {
    return <NavLeaf item={item} />;
  }

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-body-sm font-medium transition-all ${
          hasActive ? 'text-primary-700' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
        }`}
      >
        {item.icon && <span className="flex-shrink-0 text-neutral-400">{item.icon}</span>}
        <span className="truncate flex-1 text-left">{item.label}</span>
        {open
          ? <ChevronDown size={14} className="flex-shrink-0 text-neutral-400" />
          : <ChevronRight size={14} className="flex-shrink-0 text-neutral-400" />
        }
      </button>

      {open && (
        <div className="mt-0.5 space-y-0.5">
          {item.children.map((child) => (
            <NavLeaf key={child.href} item={child} depth={1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SidebarNav({ items, searchable = false, title }: SidebarNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!filterQuery.trim()) return items;
    const q = filterQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.children?.some((c) => c.label.toLowerCase().includes(q))
    );
  }, [items, filterQuery]);

  const navContent = (
    <nav aria-label={title ?? 'Sidebar navigation'}>
      {title && (
        <p className="px-3 mb-3 text-label-sm font-semibold text-neutral-400 uppercase tracking-wider">
          {title}
        </p>
      )}
      {searchable && (
        <div className="relative mb-3">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter..."
            className="w-full pl-8 pr-3 py-2 text-body-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-400 transition-colors"
          />
        </div>
      )}
      <div className="space-y-0.5">
        {filteredItems.map((item) => (
          <NavGroup key={item.href} item={item} />
        ))}
        {filteredItems.length === 0 && (
          <p className="px-3 py-4 text-body-sm text-neutral-400 italic text-center">No results.</p>
        )}
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-body-sm font-medium text-neutral-700 shadow-sm hover:border-primary-300 transition-colors w-full"
        >
          {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          <span>{mobileOpen ? 'Close' : 'Topics'}</span>
          <ChevronDown size={14} className={`ml-auto transition-transform ${mobileOpen ? 'rotate-180' : ''}`} />
        </button>
        {mobileOpen && (
          <div className="mt-2 p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
            {navContent}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">{navContent}</div>
    </>
  );
}
