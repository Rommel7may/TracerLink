"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import * as React from "react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { StarRating } from "@/components/StarRating";


interface AlumniFormProps {
  mode?: "create" | "edit";
  id?: number;
  student_number?: string;
  email?: string;
  program_id?: string | number | null;
  last_name?: string;
  given_name?: string;
  middle_initial?: string;
  present_address?: string;
  active_email?: string;
  contact_number?: string;
  graduation_year?: string;
  employment_status?: string;
  company_name?: string;
  further_studies?: string;
  sector?: string;
  work_location?: string;
  employer_classification?: string;
  related_to_course?: string;
  consent?: boolean;
  onSuccess?: (updated: any) => void;
}

export function AlumniForm({
  mode = "create",
  id,
  student_number = "",
  email = "",
  program_id = null,
  last_name = "",
  given_name = "",
  middle_initial = "",
  present_address = "",
  active_email = "",
  contact_number = "",
  graduation_year = "",
  employment_status = "",
  company_name = "",
  further_studies = "",
  sector = "",
  work_location = "",
  employer_classification = "",
  related_to_course = "",
  consent = false,
  onSuccess,
}: AlumniFormProps) {
  const isEditing = mode === "edit";
  const [programs, setPrograms] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    axios.get("/api/programs").then((res) => setPrograms(res.data));
  }, []);

  const { data, setData, post, put, processing, reset, errors } = useForm({
    id,
    student_number,
    email,
    program_id: program_id ? String(program_id) : "",
    last_name,
    given_name,
    middle_initial,
    present_address,
    active_email,
    contact_number,
    graduation_year,
    employment_status,
    company_name,
    further_studies,
    sector,
    work_location,
    employer_classification,
    related_to_course,
    consent,
    instruction_rating: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!isEditing) {
        const res = await axios.get("/check-active-email", {
          params: { email: data.active_email },
        });

        if (res.data.exists) {
          toast.error("❌ Active email already exists. Please use another email.");
          return;
        }
      }

      const isEmployed = data.employment_status === "employed";

      // 🛠 Explicitly clear non-employed fields before submission
      if (!isEmployed) {
        setData((prev) => ({
          ...prev,
          company_name: "",
          sector: "",
          work_location: "",
          employer_classification: "",
          related_to_course: "",
        }));
      }

      const endpoint = isEditing
        ? `/alumni-update-form/${data.student_number}`
        : `/alumni-form/${data.student_number}/submit`;

      const method = isEditing ? put : post;

      method(endpoint, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: (page) => {
          toast.success(isEditing ? "✅ Record updated!" : "🎉 Form submitted successfully!");
          const updated = page.props.alumni || null;
          if (updated) onSuccess?.(updated);
          reset();
        },
        onError: (errors: Record<string, string>) => {
          const messages = Object.values(errors).filter(Boolean);
          toast.error(messages.length ? messages.join(", ") : "❌ Submission failed.");
        },
      });
    } catch (error) {
      toast.error("⚠️ Something went wrong while checking active email.");
    }
  };

  const yearOptions = Array.from(
    { length: new Date().getFullYear() - 2022 + 1 },
    (_, i) => (new Date().getFullYear() - i).toString()
  );

  return (
    <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      <h2 className="col-span-2 text-2xl font-bold">
        {isEditing ? "Update Alumni Record" : "Alumni Form"}
      </h2>

      {[["Student Number", "student_number"],
        ["Email", "email"],
        ["Active Email", "active_email"],
        ["Last Name", "last_name"],
        ["Given Name", "given_name"],
        ["Middle Initial", "middle_initial"],
        ["Present Address", "present_address"],
        ["Contact Number", "contact_number"]].map(([label, key]) => (
        <div className="flex flex-col gap-1" key={key}>
          <label className="text-sm font-medium">{label}</label>
          <Input
            className={`h-11 ${errors[key as keyof typeof errors] ? "border-red-500" : ""}`}
            value={(data as any)[key]}
            onChange={(e) => setData(key as any, e.target.value)}
            disabled={processing}
            placeholder=""
          />
        </div>
      ))}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Program Taken</label>
        <Select value={data.program_id} onValueChange={(val) => setData("program_id", val)}>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            {programs.map((prog) => (
              <SelectItem key={prog.id} value={String(prog.id)}>
                {prog.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Graduation Year</label>
        <Select value={data.graduation_year} onValueChange={(val) => setData("graduation_year", val)}>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Employment Status</label>
        <Select
          value={data.employment_status}
          onValueChange={(val) => {
            setData("employment_status", val);
            if (val !== "employed") {
              setData("company_name", "");
              setData("sector", "");
              setData("work_location", "");
              setData("employer_classification", "");
              setData("related_to_course", "");
            }
          }}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="employed">Employed</SelectItem>
            <SelectItem value="under-employed">Under Employed</SelectItem>
            <SelectItem value="unemployed">Unemployed</SelectItem>
            <SelectItem value="self-employed">Self Employed</SelectItem>
            <SelectItem value="currently-looking">Currently Looking / Applying</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Only show if employed */}
      {data.employment_status === "employed" && (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Company Name</label>
            <Input
              className={`h-11 ${errors.company_name ? "border-red-500" : ""}`}
              value={data.company_name}
              onChange={(e) => setData("company_name", e.target.value)}
              disabled={processing}
              placeholder=""
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Sector You Work In</label>
            <Select value={data.sector} onValueChange={(val) => setData("sector", val)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="government">Government</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="self-employed">Self Employed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Work Location</label>
            <Select value={data.work_location} onValueChange={(val) => setData("work_location", val)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Local</SelectItem>
                <SelectItem value="abroad">Abroad</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Employer Classification</label>
            <Select
              value={data.employer_classification}
              onValueChange={(val) => setData("employer_classification", val)}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Local Company in the Philippines</SelectItem>
                <SelectItem value="foreign-ph">Foreign Company in the Philippines</SelectItem>
                <SelectItem value="foreign-abroad">Foreign Company Abroad</SelectItem>
                <SelectItem value="self-employed">I Am Self Employed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Is Work Related to Course?</label>
            <Select value={data.related_to_course} onValueChange={(val) => setData("related_to_course", val)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="unsure">Not Sure</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Pursuing Further Studies?</label>
        <Select value={data.further_studies} onValueChange={(val) => setData("further_studies", val)}>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      
      <div className="flex flex-col gap-1 col-span-2">
  <StarRating
    value={data.instruction_rating}
    onChange={(val) => setData("instruction_rating", val)}
  />
</div>

      <div className="col-span-2 flex items-start gap-2 mt-2">
        <input
          type="checkbox"
          checked={data.consent}
          onChange={(e) => setData("consent", e.target.checked)}
          required
        />
        <label className="text-sm">I consent to the processing of my data.</label>
      </div>

      


      <Button type="submit" disabled={processing} className="col-span-2 mt-4">
        {isEditing ? "Update" : "Submit"}
      </Button>
    </form>
  );
}
