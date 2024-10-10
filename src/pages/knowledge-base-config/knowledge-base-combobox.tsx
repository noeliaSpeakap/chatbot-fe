import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { useController, Control } from "react-hook-form";

interface KnowledgeBaseComboboxProps {
  control: Control<any>;
  name: string;
  label: string;
  knowledgeBases: string[];
  isLoading: boolean;
  isError: boolean;
}

const KnowledgeBaseCombobox: React.FC<KnowledgeBaseComboboxProps> = ({
  control,
  name,
  label,
  knowledgeBases,
  isLoading,
  isError,
}) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: "Knowledge base is required" },
    defaultValue: "",
  });

  const [open, setOpen] = useState(false);

  const handleSelectChange = (folderName: string) => {
    onChange(folderName);
    setOpen(false);
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value || `Select ${label.toLowerCase()}...`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
            <CommandList>
              {isLoading && <CommandItem>Loading...</CommandItem>}
              {isError && (
                <CommandItem>Error fetching {label.toLowerCase()}</CommandItem>
              )}
              {!isLoading && !isError && knowledgeBases.length === 0 && (
                <CommandItem>No {label.toLowerCase()} available</CommandItem>
              )}
              {knowledgeBases.map((folderName: string) => (
                <CommandItem
                  key={folderName}
                  value={folderName}
                  onSelect={() => handleSelectChange(folderName)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === folderName ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {folderName}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage>{error && error.message}</FormMessage>
    </FormItem>
  );
};

export default KnowledgeBaseCombobox;
