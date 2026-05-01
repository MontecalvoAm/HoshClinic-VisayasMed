import { Hero } from "@/components/sections/Hero";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero />
      
      {/* Expertise Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-zinc-50/50 -z-10"></div>
        <div className="container mx-auto px-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-brand-primary font-black tracking-[0.3em] uppercase text-[10px] mb-4">Our Expertise</h2>
            <h3 className="text-5xl font-black text-zinc-900 mb-8 tracking-tighter">Comprehensive Healthcare</h3>
            <p className="text-zinc-500 text-lg font-medium leading-relaxed">
              We provide world-class medical services tailored to your unique health needs, combining compassionate care with clinical excellence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "General Medicine",
                desc: "Routine check-ups, vaccinations, and comprehensive health assessments for all ages.",
                icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>,
                color: "brand-primary"
              },
              {
                title: "Specialist Consultation",
                desc: "Expert advice from our team of dedicated specialists across various medical fields.",
                icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>,
                color: "brand-success"
              },
              {
                title: "Emergency Care",
                desc: "Round-the-clock emergency medical assistance when every second counts.",
                icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                color: "brand-accent"
              }
            ].map((service) => (
              <Card key={service.title} className="group hover:-translate-y-2 transition-all duration-500 hover:shadow-premium">
                <div className={`w-16 h-16 bg-${service.color}/10 rounded-2xl flex items-center justify-center text-${service.color} mb-8 group-hover:bg-${service.color} group-hover:text-white transition-all duration-500`}>
                  {service.icon}
                </div>
                <h4 className="text-2xl font-black mb-4 tracking-tight text-zinc-900">{service.title}</h4>
                <p className="text-zinc-500 mb-8 font-medium leading-relaxed">{service.desc}</p>
                <Button variant="ghost" className="!p-0 !text-brand-primary group-hover:translate-x-1 transition-transform">
                  Learn more <span className="ml-2">→</span>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why Choose Section */}
      <section className="py-32 bg-zinc-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/10 blur-[120px] -z-0"></div>
        <div className="container mx-auto px-10 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-20">
            <div className="md:w-1/2">
              <h3 className="text-5xl font-black mb-10 tracking-tighter leading-tight">Why Choose <br /><span className="text-brand-primary">Hosh Clinic?</span></h3>
              <div className="space-y-10">
                {[
                  { title: "State-of-the-art Facilities", desc: "Equipped with the latest medical technology for accurate diagnosis and treatment." },
                  { title: "Certified Professionals", desc: "Our doctors are highly qualified and experienced in their respective fields." }
                ].map((item) => (
                  <div key={item.title} className="flex items-start space-x-6 group">
                    <div className="mt-1.5 w-6 h-6 bg-brand-success rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-success/20 group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-3 h-3 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-black text-xl mb-2 tracking-tight">{item.title}</h5>
                      <p className="text-zinc-400 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 w-full">
              <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[3rem] shadow-premium">
                <div className="w-12 h-1 px-0 bg-brand-primary mb-8 rounded-full"></div>
                <h4 className="text-3xl font-black mb-6 tracking-tight">Patient-Centric Approach</h4>
                <p className="mb-10 text-zinc-400 font-medium leading-relaxed text-lg">
                  We believe in treating patients, not just symptoms. Our holistic approach ensures that you receive the best care possible in a supportive, modern environment.
                </p>
                <Button variant="primary" size="lg" className="w-full !bg-white !text-zinc-900 hover:!bg-zinc-100 shadow-premium">
                  Meet Our Doctors
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-zinc-950 text-zinc-500 border-t border-white/5">
        <div className="container mx-auto px-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-brand-primary/20 rounded-lg flex items-center justify-center text-brand-primary font-black">H</div>
              <span className="font-black text-zinc-200 tracking-tighter">HoshClinic</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest">© 2026 Hosh Clinic Healthcare. Medical Precision.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
