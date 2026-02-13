import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';

/**
 * DropdownMenu - Hover-activated dropdown menu component
 * Supports multiple columns layout and works with React Router Links
 */
const DropdownMenu = ({
  label,
  columns = [],
  header = null,
  footer = null,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Calculate number of columns for grid
  const gridClassMap = {
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    2: 'grid-cols-1 sm:grid-cols-2',
    1: 'grid-cols-1'
  };
  const gridClass = gridClassMap[columns.length] || 'grid-cols-1';

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={dropdownRef}
    >
      {/* Trigger Button */}
      <button
        className="nav-link flex items-center gap-1"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <FiChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 z-50 min-w-max"
          role="menu"
          aria-orientation="vertical"
        >
          {/* Header if provided */}
          {header && (
            <div className="px-4 py-3 bg-primary-50 dark:bg-primary-900/20 border-b border-gray-200 dark:border-slate-700 rounded-t-lg">
              <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed max-w-md">{header}</p>
            </div>
          )}

          {/* Columns Grid */}
          <div className={`grid ${gridClass} p-4 gap-4`}>
            {columns.map((column, colIndex) => (
              <div key={colIndex} className="min-w-[180px]">
                {/* Column Title if provided */}
                {column.title && (
                  <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-2 text-sm uppercase tracking-wide">
                    {column.title}
                  </h3>
                )}
                {/* Column Items */}
                <ul className="space-y-1">
                  {column.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.href || '#'}
                        className="block px-3 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors group"
                        role="menuitem"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="block text-sm font-medium text-gray-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                          {item.label}
                        </span>
                        {item.description && (
                          <span className="block text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                            {item.description}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer if provided */}
          {footer && (
            <div className="px-4 py-3 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 rounded-b-lg">
              <Link
                to={footer.href || '#'}
                className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {footer.label}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
