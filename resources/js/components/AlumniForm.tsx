import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import * as React from 'react';
import { toast } from 'sonner';

interface AlumniFormProps {
    student_number: string;
    email: string;
    program: string;
}

    export function AlumniForm({ student_number, email, program }: AlumniFormProps) {
        const { data, setData, post, processing, errors } = useForm({
            student_number: '',
            email: '',
            program: '',
            last_name: '',
            given_name: '',
            middle_initial: '',
            present_address: '',
            active_email: '',
            contact_number: '',
            graduation_year: '',
            employment_status: '',
            further_studies: '',
            sector: '',
            work_location: '',
            employer_classification: '',
            consent: false as boolean,
        });

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            post(`/alumni-form/${data.student_number}/submit`, {
                onSuccess: () => toast.success('Form submitted successfully! 🎉'),
                onError: (errors) => {
                    if (errors.student_number) {
                        toast.error(errors.student_number);
                    } else {
                        toast.error('There were errors submitting the form.');
                    }
                },
            });
        };

        return (
            <form onSubmit={handleSubmit} className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
                <h2 className="col-span-2 text-2xl font-bold">Alumni Form</h2>

                <Input placeholder="Student Number" value={data.student_number} onChange={(e) => setData('student_number', e.target.value)} />
                <Input placeholder="Email" value={data.email} onChange={(e) => setData('email', e.target.value)} />

                <Select value={data.program || ''} onValueChange={(value) => setData('program', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Program taken" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="BSIT">BS Information Technology</SelectItem>
                        <SelectItem value="BSBA">BS Business Administration</SelectItem>
                        <SelectItem value="BSE">BS Entrepreneurship</SelectItem>
                        <SelectItem value="BEED">Bachelor of Elementary Education</SelectItem>
                        <SelectItem value="BSTM">BS Tourism Management</SelectItem>
                        <SelectItem value="PSYC">BS Psychology</SelectItem>
                        <SelectItem value="BSCE">BS Civil Engineering</SelectItem>
                    </SelectContent>
                </Select>

                <Input placeholder="Last Name" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} />
                <Input placeholder="Given Name" value={data.given_name} onChange={(e) => setData('given_name', e.target.value)} />
                <Input placeholder="Middle Initial" value={data.middle_initial} onChange={(e) => setData('middle_initial', e.target.value)} />
                <Input placeholder="Present Address" value={data.present_address} onChange={(e) => setData('present_address', e.target.value)} />
                <Input type="email" placeholder="Active Email" value={data.active_email} onChange={(e) => setData('active_email', e.target.value)} />
                <Input placeholder="Contact Number" value={data.contact_number} onChange={(e) => setData('contact_number', e.target.value)} />

                <Input placeholder="Graduation Year" value={data.graduation_year} onChange={(e) => setData('graduation_year', e.target.value)} />

                <Select value={data.employment_status} onValueChange={(value) => setData('employment_status', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Employment Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="employed">Employed</SelectItem>
                        <SelectItem value="under-employed">Under Employed</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                        <SelectItem value="currently-looking">Currently Looking / Applying</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={data.further_studies} onValueChange={(value) => setData('further_studies', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Further Studies (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="ma">MA</SelectItem>
                        <SelectItem value="mba">MBA</SelectItem>
                        <SelectItem value="mit">MIT</SelectItem>
                        <SelectItem value="mce">MCE</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={data.sector} onValueChange={(value) => setData('sector', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Which Sector Do You Work (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="self-employed">Self Employed</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={data.work_location} onValueChange={(value) => setData('work_location', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Where is Your Work Location" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="local">Local</SelectItem>
                        <SelectItem value="abroad">Abroad</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={data.employer_classification} onValueChange={(value) => setData('employer_classification', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="What's Your Employer's Classification" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="local">Local Company in the Philippines</SelectItem>
                        <SelectItem value="foreign-ph">Foreign Company in the Philippines</SelectItem>
                        <SelectItem value="foreign-abroad">Foreign Company Abroad</SelectItem>
                        <SelectItem value="self-employed">I Am Self Employed</SelectItem>
                    </SelectContent>
                </Select>

                <div className="col-span-2 flex items-center gap-2">
                    <input type="checkbox" checked={data.consent} onChange={(e) => setData('consent', e.target.checked)} required />
                    <label className="text-sm">I consent to the processing of my data.</label>
                </div>

                <Button type="submit" disabled={processing} className="col-span-2">
                    Submit
                </Button>
            </form>
        );
    }
