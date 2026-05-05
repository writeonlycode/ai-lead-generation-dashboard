import { LeadForm } from "@/components/leads/lead-form";

export default function Home() {
    return (
        <div className="flex flex-col justify-center grow gap-6 w-full max-w-prose mx-auto">
            <h2 className="font-medium text-xl text-center">Get In Touch!</h2>
            <LeadForm />
        </div>
    );
}
