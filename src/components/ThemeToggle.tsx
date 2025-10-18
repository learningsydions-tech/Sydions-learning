import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function ThemeToggle() {
  return <ThemeSwitcher />;
}