import * as React from "react"
import { AlumniForm } from "@/components/AlumniForm"

export default function AlumniFormLink() {
  return (
    <div className="p-6">
      <AlumniForm mode="create" />
    </div>
  )
}
