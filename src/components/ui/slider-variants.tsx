import * as React from "react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import styles from "./slider-variants.module.css"

interface SliderVariantProps extends React.ComponentPropsWithoutRef<typeof Slider> {
  variant?: "primary" | "ghost" | "temp"
}

const SliderVariant = React.forwardRef<
  React.ElementRef<typeof Slider>,
  SliderVariantProps
>(({ className, variant = "primary", ...props }, ref) => {
  return (
    <Slider
      ref={ref}
      className={cn(
        styles.sliderTrack,
        variant === "primary" && styles.primary,
        variant === "ghost" && styles.ghost,
        variant === "temp" && styles.temp,
        className
      )}
      {...props}
    />
  )
})

SliderVariant.displayName = "SliderVariant"

export { SliderVariant }
