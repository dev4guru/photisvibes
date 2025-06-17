// PhotisVibes - main.js
// ----------------------
// - Logique du menu mobile
// - Validation du formulaire
// - Fixe la date min du calendrier
// - Icônes Lucide

// Initialisation des icônes Lucide
if (window.lucide) lucide.createIcons();

// Menu burger mobile
const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');
const menuOverlay = document.getElementById('menuOverlay');
const mobileLinks = document.querySelectorAll('.mobile-link');
function openMenu() {
  mobileMenu.classList.remove('translate-x-full', 'hidden');
  mobileMenu.classList.add('translate-x-0');
  menuOverlay.classList.add('opacity-100');
  menuOverlay.classList.remove('opacity-0', 'pointer-events-none');
  document.body.style.overflow = 'hidden';
}
function closeMenuFn() {
  mobileMenu.classList.add('translate-x-full', 'hidden');
  mobileMenu.classList.remove('translate-x-0');
  menuOverlay.classList.remove('opacity-100');
  menuOverlay.classList.add('opacity-0', 'pointer-events-none');
  document.body.style.overflow = '';
}
if (burgerBtn && mobileMenu && closeMenu && menuOverlay) {
  burgerBtn.addEventListener('click', openMenu);
  closeMenu.addEventListener('click', closeMenuFn);
  menuOverlay.addEventListener('click', closeMenuFn);
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenuFn();
    });
  });
}

// Fixe la date min du champ date à demain
const dateInput = document.getElementById('date');
if (dateInput) {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

// Formulaire de contact fonctionnel avec Formspree
// Utilise l'ID Formspree fourni : https://formspree.io/f/mldnnkla

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      // Réinitialise les messages d'erreur
      const errorFields = ['nom','prenom','email','tel','date','lieu','type','message'];
      errorFields.forEach(f => {
        const err = document.getElementById('error-' + f);
        if (err) { err.textContent = ''; err.classList.add('hidden'); }
      });
      let hasError = false;
      const nom = contactForm.nom.value.trim();
      const prenom = contactForm.prenom.value.trim();
      const email = contactForm.email.value.trim();
      const tel = contactForm.tel.value.trim();
      const date = contactForm.date.value;
      const lieu = contactForm.lieu.value.trim();
      const type = contactForm.type.value;
      const message = contactForm.message.value.trim();
      // Validation
      if (!nom) {
        const err = document.getElementById('error-nom');
        if (err) { err.textContent = 'Le nom est obligatoire.'; err.classList.remove('hidden'); }
        hasError = true;
      }
      if (!prenom) {
        const err = document.getElementById('error-prenom');
        if (err) { err.textContent = 'Le prénom est obligatoire.'; err.classList.remove('hidden'); }
        hasError = true;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        const err = document.getElementById('error-email');
        if (err) { err.textContent = 'Veuillez saisir un email valide.'; err.classList.remove('hidden'); }
        hasError = true;
      }
      if (tel && !/^(0|\+33|0033)[1-9](\d{8})$/.test(tel.replace(/\s/g, ''))) {
        const err = document.getElementById('error-tel');
        if (err) { err.textContent = 'Numéro de téléphone français invalide.'; err.classList.remove('hidden'); }
        hasError = true;
      }
      if (!date) {
        const err = document.getElementById('error-date');
        if (err) { err.textContent = 'La date est obligatoire.'; err.classList.remove('hidden'); }
        hasError = true;
      } else {
        const today = new Date();
        today.setHours(0,0,0,0);
        const eventDate = new Date(date);
        if (eventDate <= today) {
          const err = document.getElementById('error-date');
          if (err) { err.textContent = 'Merci de choisir une date ultérieure à aujourd\'hui.'; err.classList.remove('hidden'); }
          hasError = true;
        }
      }
      if (!lieu) {
        const err = document.getElementById('error-lieu');
        if (err) { err.textContent = 'Le lieu est obligatoire.'; err.classList.remove('hidden'); }
        hasError = true;
      }
      if (!type) {
        const err = document.getElementById('error-type');
        if (err) { err.textContent = 'Merci de sélectionner un type d\'événement.'; err.classList.remove('hidden'); }
        hasError = true;
      }
      if (!message) {
        const err = document.getElementById('error-message');
        if (err) { err.textContent = 'Merci de préciser votre demande.'; err.classList.remove('hidden'); }
        hasError = true;
      }
      // Suppression de la vérification reCAPTCHA Google
      if (hasError) return;

      // Envoi via Formspree
      const formData = new FormData();
      formData.append('Nom', nom);
      formData.append('Email', email);
      formData.append('Téléphone', tel);
      formData.append('Date', date);
      formData.append('Message', message);

      try {
        const response = await fetch('https://formspree.io/f/mldnnkla', {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          // Affiche une confirmation visuelle
          const confirmation = document.createElement('div');
          confirmation.className = 'text-green-600 font-bold text-center my-4';
          confirmation.textContent = 'Merci ! Votre message a bien été envoyé. Nous vous répondrons rapidement.';
          contactForm.parentNode.insertBefore(confirmation, contactForm.nextSibling);
          contactForm.reset();
          contactForm.style.display = 'none';
          setTimeout(() => {
            confirmation.remove();
            contactForm.style.display = '';
          }, 8000);
        } else {
          alert("Une erreur est survenue lors de l'envoi. Merci de réessayer ou de nous contacter directement à photisvibestls@gmail.com.");
        }
      } catch (err) {
        alert("Une erreur réseau est survenue. Merci de réessayer plus tard.");
      }
    });
  }

  // Désactive le clic droit sur toutes les images
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', e => e.preventDefault());
  });
});
