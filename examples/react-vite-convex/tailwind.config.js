export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@form-builder/core/src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Grid system
    'grid',
    'grid-cols-12',
    'col-span-2',
    'col-span-3',
    'col-span-7',
    'gap-4',
    'h-full',
    'h-screen',
    'min-h-screen',
    'overflow-hidden',
    'overflow-y-auto',
    
    // Layout
    'flex',
    'flex-col',
    'items-center',
    'justify-between',
    'relative',
    'absolute',
    'inset-0',
    
    // Spacing
    'p-6',
    'p-4',
    'p-3',
    'p-2',
    'gap-2',
    'gap-3',
    'gap-4',
    'mb-6',
    'mb-4',
    
    // Colors and backgrounds
    'bg-white',
    'bg-gray-50',
    'bg-slate-50',
    'bg-slate-100',
    'bg-gradient-to-br',
    'from-blue-50',
    'to-indigo-100',
    'bg-brand-50',
    
    // Borders
    'border',
    'border-r',
    'border-2',
    'border-dashed',
    'border-slate-200',
    'border-brand-300',
    'rounded',
    'rounded-xl',
    'rounded-lg',
    
    // Text
    'text-xs',
    'text-sm',
    'text-slate-400',
    'text-slate-500',
    'text-slate-600',
    'text-slate-700',
    'text-center',
    'font-medium',
    'font-semibold',
    
    // Interactive
    'cursor-move',
    'transition-all',
    'transition-colors',
    'duration-200',
    'hover:border-brand-500',
    'hover:shadow-md',
    'hover:shadow-sm',
    'hover:bg-slate-100',
    'hover:text-slate-800',
    'group-hover:text-brand-600',
    'group-hover:text-slate-700',
    
    // Shadows
    'shadow-xl',
    
    // Display
    'min-h-32',
    'w-8',
    'h-8',
    'w-full',
    'flex-1',
  ]
}