'use client';

import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';

// Type definition for customizable select elements
declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        selectedcontent: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement>,
          HTMLElement
        >;
      }
    }
  }
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  'aria-label'?: string;
}

export function Select({
  value: controlledValue,
  onChange,
  options,
  placeholder = 'Select an option',
  className = '',
  'aria-label': ariaLabel,
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [supportsCustomizableSelect, setSupportsCustomizableSelect] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<string>('');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const selectRef = React.useRef<HTMLSelectElement>(null);

  // Determine if component is controlled or uncontrolled
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  // Feature detection for customizable select (appearance: base-select)
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if CSS.supports exists and test for appearance: base-select
    if (typeof CSS !== 'undefined' && CSS.supports) {
      const supported = CSS.supports('appearance', 'base-select');
      setSupportsCustomizableSelect(supported);
    }
  }, []);

  // Close dropdown when clicking outside (fallback mode only)
  React.useEffect(() => {
    if (!isOpen || supportsCustomizableSelect) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, supportsCustomizableSelect]);

  // Handle keyboard navigation (fallback mode only)
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (supportsCustomizableSelect) return;

    switch (event.key) {
      case 'Escape':
        setIsOpen(false);
        break;
      case 'Enter':
      case ' ':
        if (!isOpen) {
          event.preventDefault();
          setIsOpen(true);
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
    }
  };

  const handleOptionClick = (optionValue: string) => {
    // Update internal state if uncontrolled
    if (!isControlled) {
      setInternalValue(optionValue);
    }
    // Call onChange callback
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const handleNativeChange = (newValue: string) => {
    // Update internal state if uncontrolled
    if (!isControlled) {
      setInternalValue(newValue);
    }
    // Call onChange callback
    onChange?.(newValue);
  };

  const selectedOption = options.find(opt => opt.value === value);
  const displayValue = selectedOption?.label || placeholder;

  // Use native customizable select if supported (Chrome 135+)
  if (supportsCustomizableSelect) {
    return (
      <div className={`customizable-select-wrapper ${className}`}>
        <select
          ref={selectRef}
          value={value || ''}
          onChange={(e) => handleNativeChange(e.target.value)}
          aria-label={ariaLabel}
          className="customizable-select"
        >
          <button type="button">
            <selectedcontent>{selectedOption?.label || placeholder}</selectedcontent>
            <ChevronDown size={16} />
          </button>
          {!value && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <style jsx>{`
          .customizable-select {
            appearance: base-select;
            width: 100%;
          }

          /* Style the picker dropdown */
          .customizable-select::picker(select) {
            margin-top: 0.25rem;
            border: 1px solid hsl(var(--border));
            border-radius: 0.5rem;
            background: hsl(var(--background));
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
            max-height: 15rem;
            overflow: auto;
            padding: 0.25rem;
          }

          /* Style the button */
          .customizable-select > button {
            width: 100%;
            padding: 0.625rem;
            border: 1px solid hsl(var(--border));
            border-radius: 0.5rem;
            background: hsl(var(--background));
            color: hsl(var(--foreground));
            display: flex;
            align-items: center;
            justify-content: space-between;
            text-align: left;
            cursor: pointer;
            font-size: inherit;
            font-family: inherit;
          }

          .customizable-select > button:focus {
            outline: none;
            ring: 2px;
            ring-color: hsl(var(--primary));
          }

          .customizable-select > button:hover {
            background: hsl(var(--accent) / 0.5);
          }

          /* Style the selected content */
          .customizable-select selectedcontent {
            color: hsl(var(--foreground));
            flex: 1;
          }

          /* Style the dropdown icon using ::picker-icon */
          .customizable-select::picker-icon {
            display: block;
            margin-left: 0.5rem;
          }

          /* Style options in the dropdown */
          .customizable-select option {
            padding: 0.5rem 0.75rem;
            color: hsl(var(--foreground));
            background: hsl(var(--background));
            cursor: pointer;
            border-radius: 0.375rem;
            margin: 0.125rem 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .customizable-select option:hover {
            background: hsl(var(--accent));
          }

          .customizable-select option:checked {
            background: hsl(var(--accent) / 0.7);
          }

          /* Style the checkmark using ::checkmark pseudo-element */
          .customizable-select option::checkmark {
            display: block;
            content: '';
            color: hsl(var(--primary));
            font-weight: 600;
          }
        `}</style>
      </div>
    );
  }

  // Fallback to custom implementation for browsers that don't support customizable select
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="w-full p-2.5 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between text-left"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={selectedOption ? 'text-foreground' : 'text-muted-foreground'}>
          {displayValue}
        </span>
        <ChevronDown
          size={16}
          className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1 border rounded-lg bg-background shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleOptionClick(option.value)}
              className="w-full px-3 py-2 hover:bg-accent cursor-pointer text-foreground flex items-center justify-between text-left transition-colors"
              role="option"
              aria-selected={value === option.value}
            >
              <span>{option.label}</span>
              {value === option.value && (
                <Check size={16} className="text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
