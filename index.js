// Modal Image Gallery
function onClick(element) {
    document.getElementById("img01").src = element.src;
    document.getElementById("modal01").style.display = "block";
    var captionText = document.getElementById("caption");
    captionText.innerHTML = element.alt;
  }
  
  // Change style of navbar on scroll
  window.onscroll = function() {myFunction()};
  function myFunction() {
      var navbar = document.getElementById("myNavbar");
      if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
          navbar.className = "w3-bar" + " w3-card" + " w3-animate-top" + " w3-white";
      } else {
          navbar.className = navbar.className.replace(" w3-card w3-animate-top w3-white", "");
      }
  }
  
  // Used to toggle the menu on small screens when clicking on the menu button
  function toggleFunction() {
      var x = document.getElementById("navDemo");
      if (x.className.indexOf("w3-show") == -1) {
          x.className += " w3-show";
      } else {
          x.className = x.className.replace(" w3-show", "");
      }
  }
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