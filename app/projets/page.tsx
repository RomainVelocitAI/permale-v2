import ListeProjets from '@/components/ListeProjets';
import Header from '@/components/Header';

export default function ProjetsPage() {
  return (
    <div className="min-h-screen bg-[#efefef]">
      <Header variant="light" />
      
      <main className="relative">
        {/* Hero Section */}
        <div className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-gradient-to-br from-[#363d43]/5 via-transparent to-[#acae9f]/5" />
          <div className="relative max-w-7xl mx-auto text-center">
            <h1 
              className="text-5xl md:text-6xl font-light tracking-[0.3em] text-[#363d43] mb-6" 
              style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial, sans-serif' }}
            >
              NOS CRÉATIONS
            </h1>
            <p 
              className="text-lg text-[#363d43]/70 max-w-2xl mx-auto font-light tracking-wider"
              style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
            >
              Découvrez l'univers exclusif de nos créations sur-mesure,
              où chaque bijou raconte une histoire unique
            </p>
          </div>
        </div>

        {/* Projects List */}
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <ListeProjets />
        </div>
      </main>

      {/* Luxury Footer */}
      <footer className="bg-[#363d43] border-t border-[#acae9f]/20 mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand */}
            <div>
              <h3 
                className="text-[#acae9f] text-sm font-light tracking-[0.3em] uppercase mb-4"
                style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
              >
                La Maison
              </h3>
              <p className="text-[#efefef]/60 text-sm leading-relaxed">
                Depuis 1875, PERMALE incarne l'excellence
                de la haute joaillerie à La Réunion.
              </p>
            </div>
            
            {/* Contact */}
            <div>
              <h3 
                className="text-[#acae9f] text-sm font-light tracking-[0.3em] uppercase mb-4"
                style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
              >
                Contact
              </h3>
              <p className="text-[#efefef]/60 text-sm">
                La Réunion<br />
                contact@permale.com
              </p>
            </div>
            
            {/* Legal */}
            <div>
              <h3 
                className="text-[#acae9f] text-sm font-light tracking-[0.3em] uppercase mb-4"
                style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
              >
                Informations
              </h3>
              <div className="space-y-2">
                <a href="#" className="block text-[#efefef]/60 hover:text-[#acae9f] transition-colors text-sm">
                  Mentions légales
                </a>
                <a href="#" className="block text-[#efefef]/60 hover:text-[#acae9f] transition-colors text-sm">
                  Politique de confidentialité
                </a>
                <a href="#" className="block text-[#efefef]/60 hover:text-[#acae9f] transition-colors text-sm">
                  Conditions générales
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-[#efefef]/10 text-center">
            <p className="text-[#efefef]/40 text-xs tracking-wider" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
              © 2024 PERMALE - HAUTE JOAILLERIE DEPUIS 1875 • LA RÉUNION
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}