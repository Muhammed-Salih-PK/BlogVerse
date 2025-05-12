"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
  disabled = false,
}) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (option) => {
    const isSelected = selected.some((item) => item.value === option.value);
    if (isSelected) {
      onChange(selected.filter((item) => item.value !== option.value));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            selected.length === 0 ? "text-muted-foreground" : "text-foreground",
            className
          )}
          disabled={disabled}
        >
          {selected.length > 0
            ? selected.map((item) => item.label).join(", ")
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search options..." />
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => handleSelect(option)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selected.some((item) => item.value === option.value)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}