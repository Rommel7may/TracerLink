"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { usePage, useForm } from "@inertiajs/react"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { StarRating } from "@/components/StarRating";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function UpdateForm() {
  const { props } = usePage()
  const alumni = props.alumni as Record<string, any>

  const [programs, setPrograms] = useState<{ id: number; name: string }[]>([])

  useEffect(() => {
    axios.get("/api/programs").then((res) => setPrograms(res.data))
  }, [])

  const { data, setData, put, processing } = useForm({
    student_number: alumni.student_number || "",
    email: alumni.email || "",
    program_id: alumni.program_id ? String(alumni.program_id) : "",
    last_name: alumni.last_name || "",
    given_name: alumni.given_name || "",
    middle_initial: alumni.middle_initial || "",
    present_address: alumni.present_address || "",
    active_email: alumni.active_email || "",
    contact_number: alumni.contact_number || "",
    graduation_year: alumni.graduation_year || "",
    employment_status: alumni.employment_status || "",
    company_name: alumni.company_name || "",
    related_to_course: alumni.related_to_course || "",
    further_studies: alumni.further_studies || "",
    sector: alumni.sector || "",
    work_location: alumni.work_location || "",
    employer_classification: alumni.employer_classification || "",
    consent: alumni.consent ?? false,
    instruction_rating: alumni.instruction_rating ?? 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const isEmployed = data.employment_status === "employed"

    const cleanedData = {
      ...data,
      company_name: isEmployed ? data.company_name : "",
      related_to_course: isEmployed ? data.related_to_course : "",
      sector: isEmployed ? data.sector : "",
      work_location: isEmployed ? data.work_location : "",
      employer_classification: isEmployed ? data.employer_classification : "",
    }

    put(`/alumni-update-form/${alumni.student_number}`, {
      data: cleanedData,
      preserveScroll: true,
      onSuccess: () => {
        toast.success("✅ Successfully updated your alumni record!")
        setTimeout(() => window.close(), 1000)
      },
      onError: (errors) => {
        const messages = Object.values(errors).filter(Boolean).join(", ")
        toast.error(`❌ ${messages || "Failed to update. Please check the fields."}`)
      },
    })
  }

  const currentYear = new Date().getFullYear()
  const graduationYears = Array.from(
    { length: currentYear - 2022 + 1 },
    (_, i) => `${currentYear - i}`
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Update Your Alumni Information</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Student Number</label>
          <Input value={data.student_number} readOnly className="bg-gray-100 font-semibold text-black" />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Student Email</label>
          <Input value={data.email} onChange={(e) => setData("email", e.target.value)} />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Program Taken</label>
          <Select value={data.program_id} onValueChange={(val) => setData("program_id", val)}>
            <SelectTrigger><SelectValue placeholder="Select Program" /></SelectTrigger>
            <SelectContent>
              {programs.map((program) => (
                <SelectItem key={program.id} value={String(program.id)}>{program.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Last Name</label>
          <Input value={data.last_name} onChange={(e) => setData("last_name", e.target.value)} />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Given Name</label>
          <Input value={data.given_name} onChange={(e) => setData("given_name", e.target.value)} />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Middle Initial</label>
          <Input value={data.middle_initial} onChange={(e) => setData("middle_initial", e.target.value)} />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Present Address</label>
          <Input value={data.present_address} onChange={(e) => setData("present_address", e.target.value)} />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Active Email</label>
          <Input type="email" value={data.active_email} onChange={(e) => setData("active_email", e.target.value)} />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Contact Number</label>
          <Input value={data.contact_number} onChange={(e) => setData("contact_number", e.target.value)} />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Graduation Year</label>
          <Select value={data.graduation_year} onValueChange={(val) => setData("graduation_year", val)}>
            <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
            <SelectContent>
              {graduationYears.map((year) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Employment Status</label>
          <Select value={data.employment_status} onValueChange={(val) => {
            setData("employment_status", val)
            if (val !== "employed") {
              setData("company_name", "")
              setData("related_to_course", "")
              setData("sector", "")
              setData("work_location", "")
              setData("employer_classification", "")
            }
          }}>
            <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="employed">Employed</SelectItem>
              <SelectItem value="under-employed">Under Employed</SelectItem>
              <SelectItem value="unemployed">Unemployed</SelectItem>
              <SelectItem value="self-employed">Self Employed</SelectItem>
              <SelectItem value="currently-looking">Currently Looking</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {data.employment_status === "employed" && (
          <>
            <div>
              <label className="block mb-1 text-sm font-medium">Company Name</label>
              <Input value={data.company_name} onChange={(e) => setData("company_name", e.target.value)} />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Job Related to Course?</label>
              <Select value={data.related_to_course} onValueChange={(val) => setData("related_to_course", val)}>
                <SelectTrigger><SelectValue placeholder="Select Option" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="unsure">Not Sure</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Work Sector</label>
              <Select value={data.sector} onValueChange={(val) => setData("sector", val)}>
                <SelectTrigger><SelectValue placeholder="Select Sector" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="self-employed">Self Employed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Work Location</label>
              <Select value={data.work_location} onValueChange={(val) => setData("work_location", val)}>
                <SelectTrigger><SelectValue placeholder="Select Location" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="abroad">Abroad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Employer Classification</label>
              <Select value={data.employer_classification} onValueChange={(val) => setData("employer_classification", val)}>
                <SelectTrigger><SelectValue placeholder="Select Classification" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Local Company in PH</SelectItem>
                  <SelectItem value="foreign-ph">Foreign Company in PH</SelectItem>
                  <SelectItem value="foreign-abroad">Foreign Company Abroad</SelectItem>
                  <SelectItem value="self-employed">I Am Self Employed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div>
          <label className="block mb-1 text-sm font-medium">Are you pursuing further studies?</label>
          <Select value={data.further_studies} onValueChange={(val) => setData("further_studies", val)}>
            <SelectTrigger><SelectValue placeholder="Select Option" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2">
  
  <StarRating
    value={data.instruction_rating}
    onChange={(value) => setData("instruction_rating", value)}
  />
</div>


        <div className="col-span-2 flex items-start gap-2">
          <input
            type="checkbox"
            checked={data.consent}
            onChange={(e) => setData("consent", e.target.checked)}
            required
          />
          <label className="text-sm">I consent to the processing of my data.</label>
        </div>

        <Button type="submit" disabled={processing} className="col-span-2">
          Update Info
        </Button>
      </form>
    </div>
  )
}
