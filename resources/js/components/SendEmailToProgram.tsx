"use client"

import * as React from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { toast } from "sonner"
import axios from "axios"
import {
  FormInputIcon,
  Share2Icon,
  DownloadIcon,
} from "lucide-react"

const programs = [
  "BS INFORMATION TECHNOLOGY",
  "BS BUSINESS ADMINISTRATION",
  "BS ENTREPRENEURSHIP",
  "BS PSYCHOLOGY",
  "BS CIVIL ENGINEERING",
  "Bachelor of Elementary Education",
  "BS Tourism Management",
]

export function SendEmailToProgram() {
  const [open, setOpen] = React.useState(false)
  const [selectedProgram, setSelectedProgram] = React.useState("")

  const handleSend = async () => {
    if (!selectedProgram) {
      toast.warning("Please select a program.")
      return
    }

    try {
      const response = await axios.post("/send-email", { program: selectedProgram })
      const { sent = [], failed = [] } = response.data

      if (failed.length > 0) {
        const failedList = failed.map((f: any) => f.email).join(", ")
        toast.warning("Some emails failed to send ❗", {
          description: `Failed: ${failedList}`,
        })
      } else {
        toast.success("Emails sent successfully! 📧", {
          description: `Program: ${selectedProgram} (${sent.length} students)`,
        })
      }

      setOpen(false)
      setSelectedProgram("")
    } catch (err: any) {
      toast.error("Failed to send emails", {
        description: err?.response?.data?.message || "Something went wrong.",
      })
    }
  }

  const handleShareLink = () => {
    const link = `${window.location.origin}/alumni-form-link`
    navigator.clipboard.writeText(link)
    toast.success("Form link copied to clipboard! 📎")
  }

 

  return (
    <div className="flex gap-2 flex-wrap">
      {/* 🔗 Share Link */}
      <Button variant="outline" onClick={handleShareLink}>
        <Share2Icon className="w-4 h-4 mr-2" />
        Share Link
      </Button>



      {/* 📧 Send Email Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default">
            <FormInputIcon className="w-4 h-4 mr-2" />
            Send Email to Program
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select a Program</DialogTitle>
          </DialogHeader>
          <Select value={selectedProgram} onValueChange={setSelectedProgram}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a program..." />
            </SelectTrigger>
            <SelectContent>
              {programs.map((prog) => (
                <SelectItem key={prog} value={prog}>
                  {prog}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button onClick={handleSend}>Send</Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
