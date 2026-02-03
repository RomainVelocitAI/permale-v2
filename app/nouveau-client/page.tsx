import FormulaireClient from '@/components/FormulaireClient';
import Header from '@/components/Header';

export default function NouveauClientPage() {
  return (
    <div className="min-h-screen bg-[#efefef]">
      <Header variant="light" />
      
      <main className="relative py-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden pb-12 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-gradient-to-br from-[#363d43]/5 via-transparent to-[#acae9f]/5" />
          <div className="relative max-w-4xl mx-auto text-center">
            <h1 
              className="text-5xl md:text-6xl font-light tracking-[0.3em] text-[#363d43] mb-6" 
              style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial, sans-serif' }}
            >
              NOUVEAU PROJET
            </h1>
            <p 
              className="text-lg text-[#363d43]/70 max-w-2xl mx-auto font-light tracking-wider"
              style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
            >
              Créons ensemble votre bijou unique, une pièce d'exception
              qui raconte votre histoire
            </p>
          </div>
        </div>
        
        <FormulaireClient />
      </main>
    </div>
  );
}