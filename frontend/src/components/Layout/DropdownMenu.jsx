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
    // Clear any existing timeout before setting a new one
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      timeoutRef.current = null;
    }, 150);
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
          className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 min-w-max"
          role="menu"
          aria-orientation="vertical"
        >
          {/* Header if provided */}
          {header && (
            <div className="px-6 py-4 bg-primary-50 border-b border-gray-200 max-w-xl">
              <p className="text-sm text-gray-600 leading-relaxed">{header}</p>
            </div>
          )}

          {/* Columns Grid */}
          <div className={`grid ${gridClass} gap-6 p-6`}>
            {columns.map((column, colIndex) => (
              <div key={colIndex} className="min-w-[180px]">
                {/* Column Title if provided */}
                {column.title && (
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                    {column.title}
                  </h3>
                )}
                {/* Column Items */}
                <ul className="space-y-1">
                  {column.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        to="#"
                        className="block text-sm text-gray-600 hover:text-primary-600 px-2 py-1.5 transition-colors relative after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-primary-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
                        role="menuitem"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
