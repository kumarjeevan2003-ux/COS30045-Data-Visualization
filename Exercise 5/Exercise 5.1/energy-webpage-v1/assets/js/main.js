document.addEventListener('DOMContentLoaded', () => {
  // Dynamically set current year in footer
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // FAQ Accordion Interactivity
  const accordionButtons = document.querySelectorAll('.accordion-btn');

  accordionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const parentItem = button.closest('.accordion-item');
      


      // Toggle current item
      parentItem.classList.toggle('open');
    });
  });
});