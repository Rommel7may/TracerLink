"use client"

import * as React from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import axios from "axios"
import { FileInput, Share2Icon, Loader2, ListIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

type Student = {
  id: number
  student_number: string
  student_name: string
  email?: string
}

interface Props {
  selectedStudents: Student[]
  disabled?: boolean
}

export function SendEmailToSelected({ selectedStudents, disabled = false }: Props) {
  const [open, setOpen] = React.useState(false)
  const [isSending, setIsSending] = React.useState(false)

  const handleSend = async () => {
    // Filter only students with valid emails
    const emails = selectedStudents.map(s => s.email).filter((e): e is string => Boolean(e))

    if (!emails.length) {
      toast.error("Selected students have no email addresses!")
      return
    }

    // if (!confirm(`Send email to ${emails.length} students?`)) return

    setIsSending(true)
    
    try {
      const response = await axios.post("/students/send-email", { emails })
      const { sent, failed } = response.data

      if (failed.length > 0) {
        toast.warning(`Some emails failed: ${failed.join(", ")}`)
      }

      if (sent.length > 0) {
        toast.success(`Emails sent successfully! 📧 (${sent.length} students)`)
      }

      setOpen(false)
    } catch (err: any) {
      console.error(err)
      toast.error(err?.response?.data?.message || "Failed to send emails")
    } finally {
      setIsSending(false)
    }
  }

  const handleShareLink = () => {
    const link = `${window.location.origin}/alumni-form-link`
    navigator.clipboard.writeText(link)
    toast.success("Form link copied to clipboard! 📎")
  }

  return (
    <div className="flex gap-2">
      <Button onClick={handleShareLink}>
        <Share2Icon className="w-4 h-4 mr-2" />
        Share Link
      </Button>

      <Dialog open={open} onOpenChange={(isOpen) => {
        if (isSending) return; // Prevent closing when loading
        setOpen(isOpen);
      }}>
        <Tooltip>
  <TooltipTrigger asChild>
    <div> {/* Wrap the button in a div for tooltip to work on disabled elements */}
      <DialogTrigger asChild>
        <Button 
          variant="default" 
          disabled={disabled || selectedStudents.length === 0}
        >
          <FileInput className="w-4 h-4 mr-2" />
          Send Form
        </Button>
      </DialogTrigger>
    </div>
  </TooltipTrigger>
  <TooltipContent>
    <p>
      {disabled 
        ? ""
         
        : selectedStudents.length === 0 
          ? "Please select at least one student" 
          : "Send form to selected students"
      }
    </p>
  </TooltipContent>
</Tooltip>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p>Send email form to {selectedStudents.length} selected students?</p>
            <p className="text-sm text-muted-foreground mt-2">
              {selectedStudents.filter(s => s.email).length} students have valid email addresses
            </p>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button 
              onClick={handleSend} 
              disabled={isSending || selectedStudents.filter(s => s.email).length === 0}
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : "Send"}
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setOpen(false)} 
              disabled={isSending}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}