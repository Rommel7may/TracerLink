"use client"

import * as React from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import axios from "axios"
import { SendIcon, Share2Icon, Loader2 } from "lucide-react"

type Student = {
  id: number
  student_number: string
  student_name: string
  email?: string
}

interface Props {
  selectedStudents: Student[]
}

export function SendEmailToSelected({ selectedStudents }: Props) {
  const [open, setOpen] = React.useState(false)
  const [isSending, setIsSending] = React.useState(false)

  const handleSend = async () => {
    // Filter only students with valid emails
    const emails = selectedStudents.map(s => s.email).filter((e): e is string => Boolean(e))

    if (!emails.length) {
      toast.error("Selected students have no email addresses!")
      return
    }

    if (!confirm(`Send email to ${emails.length} students?`)) return

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
        <DialogTrigger asChild>
          <Button variant="default">
            <SendIcon className="w-4 h-4 mr-2" />
            Send Email to Selected
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p>Send email to {selectedStudents.length} selected students?</p>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button 
              onClick={handleSend} 
              disabled={isSending}
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