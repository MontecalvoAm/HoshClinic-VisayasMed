import { Hero } from "@/components/sections/Hero";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      
      {/* Sample Content Section: Services */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-brand-primary font-bold tracking-wider uppercase text-sm mb-3">Our Expertise</h2>
            <h3 className="text-4xl font-bold text-gray-900 mb-6">Comprehensive Healthcare Services</h3>
            <p className="text-gray-600 text-lg">
              We offer a wide range of medical services designed to meet the unique needs of every patient.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="group p-8 rounded-2xl border border-gray-100 bg-zinc-50 hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-4">General Medicine</h4>
              <p className="text-gray-600 mb-6">Routine check-ups, vaccinations, and comprehensive health assessments for all ages.</p>
              <Button variant="ghost" className="p-0 !text-brand-primary font-bold">
                Learn more <span>→</span>
              </Button>
            </div>
            
            {/* Service 2 */}
            <div className="group p-8 rounded-2xl border border-gray-100 bg-zinc-50 hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-brand-success/10 rounded-xl flex items-center justify-center text-brand-success mb-6 group-hover:bg-brand-success group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-4">Specialist Consultation</h4>
              <p className="text-gray-600 mb-6">Expert advice from our team of dedicated specialists across various medical fields.</p>
              <Button variant="ghost" className="p-0 !text-brand-primary font-bold">
                Learn more <span>→</span>
              </Button>
            </div>
            
            {/* Service 3 */}
            <div className="group p-8 rounded-2xl border border-gray-100 bg-zinc-50 hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-brand-accent/10 rounded-xl flex items-center justify-center text-brand-accent mb-6 group-hover:bg-brand-accent group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-4">Emergency Services</h4>
              <p className="text-gray-600 mb-6">Round-the-clock emergency medical assistance when every second counts.</p>
              <Button variant="ghost" className="p-0 !text-brand-primary font-bold">
                Learn more <span>→</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Sample Content Section: About */}
      <section className="py-24 bg-brand-primary text-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0 pr-0 md:pr-12">
            <h3 className="text-4xl font-bold mb-8">Why Choose Hosh Clinic?</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="mt-1 w-6 h-6 bg-brand-success rounded-full flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-bold text-lg mb-1">State-of-the-art Facilities</h5>
                  <p className="text-white/70">Equipped with the latest medical technology for accurate diagnosis and treatment.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="mt-1 w-6 h-6 bg-brand-success rounded-full flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-bold text-lg mb-1">Certified Professionals</h5>
                  <p className="text-white/70">Our doctors are highly qualified and experienced in their respective fields.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl">
              <h4 className="text-2xl font-bold mb-4">Patient-Centric Approach</h4>
              <p className="mb-8 text-white/80 leading-relaxed">
                We believe in treating patients, not just symptoms. Our holistic approach ensures that you receive the best care possible in a supportive environment.
              </p>
              <Button variant="primary" size="lg" className="w-full border-2 border-white shadow-xl">
                Meet Our Doctors
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-6 bg-zinc-900 text-white/50 border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">© 2026 Hosh Clinic Healthcare. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
