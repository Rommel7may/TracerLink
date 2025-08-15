import { Star } from "lucide-react"
import { useState } from "react"

interface StarRatingProps {
  value: number
  onChange: (rating: number) => void
  error?: string
}

export function StarRating({ value, onChange, error }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="col-span-2">
      <label className="text-sm font-medium">
        How would you rate the quality of instruction in the program you've taken?
      </label>
      <p className="text-xs text-muted-foreground mb-1">(Scale: 1–5, Poor to Excellent)</p>
      
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = (hovered ?? value) >= star

          return (
            <Star
              key={star}
              className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${
                isFilled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
              onClick={() => onChange(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(null)}
            />
          )
        })}
      </div>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}
