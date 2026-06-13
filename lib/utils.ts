import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility function for conditionally joining class names, using clsx for handling conditional logic and twMerge for merging Tailwind CSS classes while avoiding conflicts, ensuring that the resulting class string is optimized and free of duplicates, which can be used throughout the application for consistent styling of components
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
