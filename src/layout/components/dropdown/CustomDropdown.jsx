import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import './CustomDropdown.css';

import { ChevronDown, Check } from "lucide-react";


function CustomDropdown({
  options=[],
  label='label',
  value,
  onChange,
  placeholder = "Select",
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(
  (option) => option.value === value);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleSelect = (option) => {
    onChange(option.value);
    setOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className="custom-sort-dropdown"
    >
      {/* Trigger */}
      <button
            type="button"
            className={`custom-sort-trigger ${open ? "open" : ""}`}
            onClick={() => !disabled && setOpen((prev) => !prev)}
            aria-expanded={open}
            disabled={disabled}
        >
        <span>
            {selectedOption
            ? selectedOption[label]
            : placeholder}
        </span>

        <ChevronDown
          size={16}
          className={`sort-chevron ${
            open ? "rotate" : ""
          }`}
        />
      </button>

      {/* Options */}
      {open && (
        <div className="custom-sort-menu">
          {options.map((option) => {
            const isSelected =
              option.value === value;

            return (
              <button
                type="button"
                key={option.value}
                className={`custom-sort-option ${
                  isSelected ? "selected" : ""
                }`}
                onClick={() =>
                  handleSelect(option)
                }
              >
                <span>{option.label}</span>

                {isSelected && (
                  <Check
                    size={15}
                    strokeWidth={2.2}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default CustomDropdown