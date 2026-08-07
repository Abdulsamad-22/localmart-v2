import { useState, useRef, useEffect } from "react";

type UseInlineEditProps = {
  initialValue: number;
  onSave: (value: number) => Promise<void>;
};

export function useInlineEdit({ initialValue, onSave }: UseInlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (value === initialValue) {
      setIsEditing(false);
      return;
    }

    setSaving(true);
    try {
      await onSave(value);
    } finally {
      setSaving(false);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setValue(initialValue);
      setIsEditing(false);
    }
  };

  return {
    isEditing,
    value,
    saving,
    inputRef,
    setValue,
    setIsEditing,
    handleSave,
    handleKeyDown,
  };
}
