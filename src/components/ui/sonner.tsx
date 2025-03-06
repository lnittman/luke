"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:h-[72px] group-[.toaster]:flex group-[.toaster]:flex-col group-[.toaster]:justify-center group-[.toaster]:",
          title: 
            "group-[.toast]:font-normal group-[.toast]:text-sm group-[.toast]:line-clamp-1",
          description: 
            "group-[.toast]:text-muted-foreground group-[.toast]:text-xs group-[.toast]:line-clamp-1",
          actionButton:
            "group-[.toast]:bg-transparent group-[.toast]:text-slate-700 group-[.toast]:border group-[.toast]:border-slate-300 group-[.toast]:hover:bg-slate-100 group-[.toast]:font-normal group-[.toast]:lowercase group-[.toast]:text-xs",
          cancelButton:
            "group-[.toast]:bg-transparent group-[.toast]:text-slate-700 group-[.toast]:border group-[.toast]:border-slate-300 group-[.toast]:font-normal group-[.toast]:lowercase group-[.toast]:text-xs",
        },
        ...props.toastOptions,
      }}
      {...props}
    />
  )
}

export { Toaster }
