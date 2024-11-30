import React from "react";

const Keybind = React.forwardRef<
  HTMLSpanElement,
  {
    shortcut: string | string[];
    className?: string;
    inButton?: boolean;
  }
>(({ shortcut, className = "", inButton = false }, ref) => {
  const keys = Array.isArray(shortcut) ? shortcut : [shortcut];

  return (
    <span ref={ref} className="inline-flex items-center gap-1">
      {keys.map((key, index) => (
        <React.Fragment key={key}>
          <kbd
            className={`
              inline-flex h-5 select-none items-center gap-1
              rounded border px-1.5 font-mono text-[10px]
              font-medium opacity-70
              ${inButton ? "border-inherit bg-inherit" : "border-gray-200 bg-gray-100 text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"}
              ${className}
            `}
          >
            {key}
          </kbd>
          {index < keys.length - 1 && <span className="opacity-60">+</span>}
        </React.Fragment>
      ))}
    </span>
  );
});

Keybind.displayName = "Keybind";

export { Keybind };
