import { Hero } from "@/components/blocks/hero";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col justify-center grow gap-20 max-w-prose mx-auto py-10">
            <Hero />
            <section className="flex items-center justify-center">
                <Button asChild>
                    <Link href="/dashboard">
                        Go to Dashboard
                    </Link>
                </Button>
            </section>
        </div>
    );
}
