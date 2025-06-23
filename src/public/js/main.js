// Main JavaScript for Football Players website

// Comment editing functionality
function editComment(commentId) {
  const commentDiv = document.getElementById(`comment-${commentId}`);
  const editForm = document.getElementById(`edit-form-${commentId}`);

  if (commentDiv && editForm) {
    commentDiv.style.display = "none";
    editForm.style.display = "block";
  }
}

function cancelEdit(commentId) {
  const commentDiv = document.getElementById(`comment-${commentId}`);
  const editForm = document.getElementById(`edit-form-${commentId}`);

  if (commentDiv && editForm) {
    commentDiv.style.display = "block";
    editForm.style.display = "none";
  }
}

// Search functionality
document.addEventListener("DOMContentLoaded", function () {
  // Auto-submit search form on team selection change
  const teamSelect = document.getElementById("team");
  if (teamSelect) {
    teamSelect.addEventListener("change", function () {
      this.form.submit();
    });
  }

  // Add loading state to buttons
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", function () {
      const submitBtn = this.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="loading"></span> Loading...';
        submitBtn.disabled = true;

        // Re-enable button after 5 seconds as fallback
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 5000);
      }
    });
  });

  // Smooth scroll for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Auto-dismiss alerts after 5 seconds
  const alerts = document.querySelectorAll(".alert:not(.alert-info)");
  alerts.forEach((alert) => {
    setTimeout(() => {
      alert.style.opacity = "0";
      setTimeout(() => {
        alert.remove();
      }, 300);
    }, 5000);
  });

  // Add tooltips to captain badges
  const captainBadges = document.querySelectorAll(
    ".captain-badge, .captain-badge-large"
  );
  captainBadges.forEach((badge) => {
    badge.setAttribute(
      "title",
      "Team Captain - Leader and representative of the team"
    );
  });

  // Image error handling
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.addEventListener("error", function () {
      this.src =
        "https://via.placeholder.com/300x250/007bff/ffffff?text=No+Image";
      this.alt = "Image not available";
    });
  });
});

// Utility functions
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `alert alert-${type} position-fixed`;
  toast.style.cssText =
    "top: 20px; right: 20px; z-index: 9999; min-width: 300px;";
  toast.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <span>${message}</span>
            <button type="button" class="btn-close" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 5000);
}

// Rating display helper
function displayRating(rating, maxRating = 3) {
  let stars = "";
  for (let i = 1; i <= maxRating; i++) {
    if (i <= rating) {
      stars += '<i class="fas fa-star text-warning"></i>';
    } else {
      stars += '<i class="far fa-star text-muted"></i>';
    }
  }
  return stars;
}

// Search and filter helpers
function clearFilters() {
  window.location.href = "/";
}

function updateURL(params) {
  const url = new URL(window.location);
  Object.keys(params).forEach((key) => {
    if (params[key]) {
      url.searchParams.set(key, params[key]);
    } else {
      url.searchParams.delete(key);
    }
  });
  window.history.pushState({}, "", url);
}
