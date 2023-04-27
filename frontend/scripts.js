let resumeContentLoaded = false;

async function fetchVisitorCount() {
  try {
    const response = await fetch('https://d7tqrxj7v4.execute-api.us-east-1.amazonaws.com/count');
    const data = await response.json();
    console.log(data); // Log the JSON response
    const countElement = document.getElementById('visitorCount');
    countElement.innerHTML = `Visitor Count: ${data.visitorCount}`; // Use the correct key 'visitorCount'
  } catch (error) {
    console.error('Error fetching visitor count:', error);
  }
}

function loadSectionContent(sectionId, fileName, callback) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        document.getElementById(sectionId).innerHTML = xhr.responseText;
        if (callback) {
          callback();
        }
        resolve();
      }
    };
    xhr.onerror = function () {
      reject(new Error(`Error loading ${fileName}`));
    };
    xhr.open("GET", fileName, true);
    xhr.send();
  });
}

async function showSection(sectionId) {
  if (sectionId === "resume-content" && !resumeContentLoaded) {
    await loadSectionContent("education-section", "education.html");
    await loadSectionContent("experience-section", "experience.html", () => {
      // Add the click functionality for experience-job-entry elements
      document.querySelectorAll('.experience-job-entry').forEach((entry) => {
        entry.addEventListener('click', () => {
          entry.classList.toggle('expanded');
        });
      });
    });
    await loadSectionContent("skills-section", "skills.html", () => {
      // Add click functionality for skill categories
      document.querySelectorAll('.skill-category').forEach((skillCategory) => {
        skillCategory.addEventListener('click', () => {
          skillCategory.classList.toggle('expanded');
        });
      });
    });
    resumeContentLoaded = true;
  }

  const sections = document.getElementsByClassName('section-content');
  for (let i = 0; i < sections.length; i++) {
    sections[i].classList.remove('active');
  }
  document.getElementById(sectionId).classList.add('active');
}

function navigate(event, sectionId) {
  event.preventDefault();
  showSection(sectionId);
}

document.addEventListener("DOMContentLoaded", async function () {
  fetchVisitorCount();
  await loadSectionContent("about-content", "about.html");
  await loadSectionContent("contact-content", "contact.html");
  await loadSectionContent("resume-content", "resume.html");

  // Show the 'Resume' section by default
  showSection("resume-content");
});
