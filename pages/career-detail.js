// Import DOMPurify
import DOMPurify from 'dompurify';

// Get jobId from the URL query parameter
const jobId = new URLSearchParams(window.location.search).get('jobId');

// Function to decode and sanitize HTML
function decodeAndCleanHTML(encodedHTML) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = encodedHTML;
  let decoded = textarea.value;

  // Remove inline styles
  decoded = decoded.replace(/ style="[^"]*"/g, '');

  // Sanitize the HTML using DOMPurify
  const cleaned = DOMPurify.sanitize(decoded, {
    ALLOWED_TAGS: ['p', 'span', 'ul', 'li', 'b', 'strong', 'em', 'br'],
    ALLOWED_ATTR: [],
  });

  return cleaned;
}

// Function to populate job details dynamically
function populateJobDetail(jobDetail) {
  console.log('Job Detail:', jobDetail);

  const titleEl = document.getElementById('job-title');
  if (titleEl) {
    titleEl.textContent = jobDetail.jobTitle || 'No Title Available';
  }

  const descriptionEl = document.getElementById('job-description');
  if (descriptionEl && jobDetail.description) {
    const cleanedDescription = decodeAndCleanHTML(jobDetail.description);
    descriptionEl.innerHTML = cleanedDescription;
  }

  const departmentEl = document.getElementById('job-department');
  if (departmentEl) {
    departmentEl.textContent = jobDetail.department || 'No Department';
  }

  const locationEl = document.getElementById('job-location');
  if (locationEl) {
    const locationText = `${jobDetail.city || ''}, ${jobDetail.country || ''}`.trim();
    locationEl.textContent = locationText || 'No Location Available';
  }

  const typeEl = document.getElementById('job-type');
  if (typeEl) {
    typeEl.textContent = jobDetail.jobType || 'No Job Type';
  }

  const dateEl = document.getElementById('job-posted-date');
  if (dateEl) {
    dateEl.textContent = jobDetail.timestamp || 'No Date Available';
  }

  const applyButton = document.getElementById('apply-button');
  if (applyButton && jobId) {
    applyButton.href = `https://doku.darwinbox.com/ms/candidate/careers/${jobId}`;
  }

  const whatsappButton = document.getElementById('whatsapp-share-button');
  if (whatsappButton && jobDetail.jobTitle) {
    const message = `${jobDetail.jobTitle} - Check it out: ${window.location.href}`;
    const encodedMessage = encodeURIComponent(message);
    whatsappButton.href = `https://api.whatsapp.com/send?text=${encodedMessage}`;
  }

  const copyButton = document.getElementById('copy-link-button');
  if (copyButton && jobDetail.jobTitle) {
    copyButton.addEventListener('click', () => {
      const copyMessage = `${jobDetail.jobTitle} - Check it out: ${window.location.href}`;
      navigator.clipboard
        .writeText(copyMessage)
        .then(() => {
          alert('Link copied!');
        })
        .catch((err) => {
          console.error('Failed to copy: ', err);
        });
    });
  }
}

// Fetch job details and populate content
if (!jobId) {
  console.error('No jobId provided in the URL');
  const titleEl = document.getElementById('job-title');
  if (titleEl) {
    titleEl.textContent = 'Job Not Found';
  }
} else {
  const detailApiUrl = `https://proxy-server-doku.vercel.app/api/job-detail?jobId=${jobId}`;
  fetch(detailApiUrl)
    .then((response) => response.json())
    .then((jobDetail) => {
      populateJobDetail(jobDetail);
    })
    .catch((error) => {
      console.error('Error fetching job details:', error);
      const titleEl = document.getElementById('job-title');
      if (titleEl) {
        titleEl.textContent = 'Error Loading Job Details';
      }
    });
}