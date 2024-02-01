document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('.navbar-toggle').addEventListener('click', function() {
      var links = document.querySelector('.navbar-links');
      if (links.style.display === 'block') {
        links.style.display = 'none';
      } else {
        links.style.display = 'block';
      }
    });
  });
  