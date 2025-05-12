"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function SkillsInput({ value = [], onChange, name, placeholder = "Type a skill and press enter" }) {
  const [inputValue, setInputValue] = useState("");
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    setSkills(Array.isArray(value) ? value : []);
  }, [value]);

  const handleKeyDown = (e) => {
    if (["Enter", "Tab", ","].includes(e.key)) {
      e.preventDefault();
      addSkill();
    }
  };

  const addSkill = () => {
    const skill = inputValue.trim();
    if (skill && !skills.includes(skill)) {
      const newSkills = [...skills, skill];
      setSkills(newSkills);
      onChange({ target: { name, value: newSkills } });
      setInputValue("");
    }
  };

  const removeSkill = (skillToRemove) => {
    const newSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(newSkills);
    onChange({ target: { name, value: newSkills } });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {skills.map(skill => (
          <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm">
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="ml-2 rounded-full hover:bg-accent"
              aria-label={`Remove ${skill}`}
            >
              ×
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addSkill}
        placeholder={placeholder}
      />
      <p className="text-sm text-muted-foreground">
        Add skills by typing and pressing Enter or comma
      </p>
    </div>
  );
}