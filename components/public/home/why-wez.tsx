import { Card, CardContent } from "@/components/ui/card";

export function WhyWez() {
    const reasons = [
        {
            title: "Comprehensive Creative Services",
            description: "From design to production, we handle all aspects of your branding and merchandise needs under one roof.",
        },
        {
            title: "Quality Production",
            description: "We deliver professional-grade printing, branding, and merchandise that represents your brand with excellence.",
        },
        {
            title: "Custom Solutions",
            description: "Every project is unique. We work with you to create tailored solutions that meet your specific requirements.",
        },
        {
            title: "Event Expertise",
            description: "Experienced in supporting events, campaigns, and large-scale production with reliable execution.",
        },
        {
            title: "Flexible Production",
            description: "Whether you need a single item or bulk production, we accommodate projects of all sizes.",
        },
        {
            title: "Professional Communication",
            description: "Clear communication throughout your project ensures your vision is understood and delivered.",
        },
    ];

    return (
        <section id="why-wez" className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-2xl mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Wez Creatives</h2>
                    <p className="text-lg text-muted-foreground">
                        Your partner for professional creative and production solutions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reasons.map((reason, index) => (
                        <Card key={index} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-2">{reason.title}</h3>
                                <p className="text-sm text-muted-foreground">{reason.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}