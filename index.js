
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.fixed-header nav ul li a');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});


// Get all section headers
const sectionLinks= document.querySelectorAll('nav ul li a');
const sections = document.querySelectorAll('.chart-section');

// Function to highlight the current section's header
function highlightActiveHeader() {
  const scrollY = window.scrollY;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        const id = section.getAttribute('id');
        sectionLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    }
});
}

// Initial call to highlight the active header on page load
highlightActiveHeader();

// Add an event listener to trigger the function on scroll
window.addEventListener('scroll', highlightActiveHeader);