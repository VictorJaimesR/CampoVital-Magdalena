import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function WelcomePage() {
  const [mostrarAvisoDemo, setMostrarAvisoDemo] = useState(true);
  const botonCerrarRef = useRef(null);

  useEffect(() => {
    if (!mostrarAvisoDemo) return undefined;

    botonCerrarRef.current?.focus();
    const cerrarConEscape = (event) => {
      if (event.key === 'Escape') setMostrarAvisoDemo(false);
    };
    window.addEventListener('keydown', cerrarConEscape);
    return () => window.removeEventListener('keydown', cerrarConEscape);
  }, [mostrarAvisoDemo]);

  return (
    <div className="landing-container">
      {mostrarAvisoDemo && (
        <div
          className="demo-welcome-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setMostrarAvisoDemo(false);
          }}
        >
          <section
            className="demo-welcome-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-welcome-title"
            aria-describedby="demo-welcome-description"
          >
            <button
              ref={botonCerrarRef}
              type="button"
              className="demo-welcome-close"
              aria-label="Cerrar bienvenida"
              onClick={() => setMostrarAvisoDemo(false)}
            >
              <i className="bi bi-x-lg" aria-hidden="true"></i>
            </button>

            <div className="demo-welcome-icon" aria-hidden="true">
              <i className="bi bi-flower1"></i>
            </div>
            <p className="demo-welcome-eyebrow">Demo de CampoVital Magdalena</p>
            <h2 id="demo-welcome-title">¡Te damos la bienvenida!</h2>
            <p id="demo-welcome-description" className="demo-welcome-copy">
              Explora una plataforma creada para acompañar la gestión agrícola del Magdalena.
              Puedes crear una cuenta como <strong>agricultor</strong> o como <strong>técnico</strong>;
              elige tu perfil en el formulario de registro.
            </p>

            <div className="demo-welcome-note" role="note">
              <i className="bi bi-hourglass-split" aria-hidden="true"></i>
              <p>
                La demo funciona en plataformas gratuitas que pueden poner sus servicios en reposo.
                Por eso, el primer inicio de sesión o registro puede tardar alrededor de un minuto.
                Después, espera a que termine la carga.
              </p>
            </div>

            <div className="demo-welcome-actions">
              <button
                type="button"
                className="btn btn-agro-outline"
                onClick={() => setMostrarAvisoDemo(false)}
              >
                Explorar la demo
              </button>
              <Link
                to="/register"
                className="btn btn-agro"
                onClick={() => setMostrarAvisoDemo(false)}
              >
                Crear una cuenta
              </Link>
            </div>
          </section>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section text-center text-white d-flex align-items-center">
        <div className="container">
          <div className="mb-4 animate__animated animate__zoomIn">
            <img
              src="/logo.png"
              alt="CampoVital Logo"
              style={{ maxWidth: '300px', height: 'auto', filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.3))' }}
            />
          </div>
          <h1 className="display-4 fw-bold mb-3 animate__animated animate__fadeInDown">Tecnología que echa raíces</h1>
          <p className="lead fs-4 mb-4 animate__animated animate__fadeInUp animate__delay-1s">
            Transformando la agricultura del Magdalena con inteligencia y tecnología.
          </p>
          <div className="d-flex justify-content-center gap-3 animate__animated animate__fadeInUp animate__delay-2s">
            <Link to="/register" className="btn btn-agro btn-lg px-5 shadow">Empezar Ahora</Link>
            <Link to="/login" className="btn btn-outline-light btn-lg px-5">Iniciar Sesión</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-white">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Nuestras Funcionalidades</h2>
            <div className="bg-agro mx-auto mb-3" style={{ width: 60, height: 4 }}></div>
            <p className="text-muted">Diseñado específicamente para las necesidades del pequeño productor.</p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-4">
                <div className="bg-success bg-opacity-10 text-success rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
                  <i className="bi bi-geo-alt fs-1"></i>
                </div>
                <h5 className="fw-bold">Gestión Georreferenciada</h5>
                <p className="text-muted small">Registra tus fincas y lotes con coordenadas GPS exactas para un seguimiento preciso.</p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-4">
                <div className="bg-primary bg-opacity-10 text-primary rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
                  <i className="bi bi-cpu fs-1"></i>
                </div>
                <h5 className="fw-bold">Recomendaciones Inteligentes</h5>
                <p className="text-muted small">Recibe consejos técnicos basados en el estado real de tus cultivos para maximizar tu cosecha.</p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-4">
                <div className="bg-warning bg-opacity-10 text-warning rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
                  <i className="bi bi-cloud-lightning-rain fs-1"></i>
                </div>
                <h5 className="fw-bold">Alertas Climáticas</h5>
                <p className="text-muted small">Mantente informado sobre riesgos de sequía o inundación en tu municipio en tiempo real.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showoff Section */}
      <section className="py-5 bg-light">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="fw-bold mb-4">Lleva el control de tu producción en el bolsillo</h2>
              <ul className="list-unstyled">
                <li className="d-flex mb-3 gap-3">
                  <i className="bi bi-check-circle-fill text-success fs-4"></i>
                  <div>
                    <h6 className="fw-bold mb-0">Modo Offline</h6>
                    <p className="text-muted small">¿Sin internet en la vereda? No hay problema. Sincroniza cuando vuelvas al pueblo.</p>
                  </div>
                </li>
                <li className="d-flex mb-3 gap-3">
                  <i className="bi bi-check-circle-fill text-success fs-4"></i>
                  <div>
                    <h6 className="fw-bold mb-0">Reportes Detallados</h6>
                    <p className="text-muted small">Exporta tus inventarios y cierres de producción en Excel para trámites bancarios.</p>
                  </div>
                </li>
                <li className="d-flex mb-3 gap-3">
                  <i className="bi bi-check-circle-fill text-success fs-4"></i>
                  <div>
                    <h6 className="fw-bold mb-0">Soporte Multimedia</h6>
                    <p className="text-muted small">Sube fotos de tus cultivos para llevar un registro visual de su crecimiento.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="col-lg-6 text-center">
              <div className="bg-agro rounded shadow-lg p-3" style={{ transform: 'rotate(2deg)' }}>
                <img
                  src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  className="img-fluid rounded shadow-sm"
                  alt="Vista previa de CampoVital"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-agro text-white text-center">
        <div className="container py-4">
          <h2 className="fw-bold mb-4">¿Eres un agricultor del Magdalena?</h2>
          <p className="lead mb-4">Únete a cientos de productores que ya están optimizando sus fincas con CampoVital.</p>
          <Link to="/register" className="btn btn-light btn-lg px-5 shadow">Regístrate Gratis</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 bg-dark text-white text-center">
        <div className="container">
          <p className="mb-0 small opacity-50">&copy; 2026 CampoVital Magdalena — Todos los derechos reservados.</p>
        </div>
      </footer>

      <style>{`
        .landing-container {
          background-color: #f8f9fa;
        }
        .hero-section {
          background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
                      url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80');
          background-size: cover;
          background-position: center;
          height: 80vh;
          min-height: 500px;
        }
        .bg-agro { background-color: #2c6e49 !important; }
        .text-agro { color: #2c6e49 !important; }
        .btn-agro {
          background-color: #2c6e49;
          color: white;
          border: none;
        }
        .btn-agro:hover {
          background-color: #1e4d32;
          color: white;
        }
        .animate__animated {
          animation-duration: 1s;
          animation-fill-mode: both;
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translate3d(0, -50px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate3d(0, 50px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .animate__fadeInDown { animation-name: fadeInDown; }
        .animate__fadeInUp { animation-name: fadeInUp; }
        .animate__delay-1s { animation-delay: 0.5s; }
        .animate__delay-2s { animation-delay: 1s; }

        .demo-welcome-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow-y: auto;
          padding: 1rem;
          background: rgba(8, 31, 17, 0.72);
          backdrop-filter: blur(5px);
        }
        .demo-welcome-dialog {
          position: relative;
          width: min(100%, 540px);
          max-height: calc(100vh - 2rem);
          overflow-y: auto;
          padding: clamp(1.5rem, 5vw, 2.5rem);
          border: 1px solid rgba(26, 92, 46, 0.12);
          border-radius: 20px;
          background: #fff;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.3);
          color: #1a1a2e;
          text-align: center;
          animation: demoWelcomeIn 220ms ease-out both;
        }
        .demo-welcome-close {
          position: absolute;
          top: 0.85rem;
          right: 0.85rem;
          display: grid;
          width: 40px;
          height: 40px;
          place-items: center;
          border: 0;
          border-radius: 50%;
          background: #f0f7f0;
          color: #1a5c2e;
          cursor: pointer;
        }
        .demo-welcome-close:hover { background: #e2eee3; }
        .demo-welcome-icon {
          display: grid;
          width: 56px;
          height: 56px;
          place-items: center;
          margin: 0 auto 0.75rem;
          border-radius: 16px;
          background: #e8f5e9;
          color: #1a5c2e;
          font-size: 1.7rem;
        }
        .demo-welcome-eyebrow {
          margin-bottom: 0.4rem;
          color: #1a5c2e;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .demo-welcome-dialog h2 {
          margin: 0 0 0.75rem;
          color: #163b25;
          font-size: clamp(1.5rem, 5vw, 1.9rem);
          font-weight: 700;
        }
        .demo-welcome-copy {
          margin: 0 auto 1.25rem;
          color: #52605a;
          line-height: 1.65;
        }
        .demo-welcome-note {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          padding: 1rem;
          border: 1px solid #f1d79e;
          border-radius: 12px;
          background: #fff8e8;
          color: #57451f;
          text-align: left;
        }
        .demo-welcome-note > i {
          margin-top: 0.15rem;
          color: #a66a0a;
          font-size: 1.2rem;
        }
        .demo-welcome-note p {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.55;
        }
        .demo-welcome-actions {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }
        .demo-welcome-actions > * {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          text-decoration: none;
        }
        .demo-welcome-actions .btn-agro-outline {
          padding: 0.6rem 1.2rem;
        }
        @keyframes demoWelcomeIn {
          from { opacity: 0; transform: translateY(8px) scale(0.99); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (max-width: 480px) {
          .demo-welcome-actions { flex-direction: column-reverse; }
          .demo-welcome-actions > * { width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .demo-welcome-dialog { animation: none; }
        }
      `}</style>
    </div>
  );
}
