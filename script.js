document.addEventListener("DOMContentLoaded", function () {
  // Homepage service card animation
  const civilButton = document.querySelector(".civil-card");
  const softwareButton = document.querySelector(".software-card");

  if (civilButton) {
    civilButton.addEventListener("click", function (event) {
      event.preventDefault();
      civilButton.classList.add("active");

      setTimeout(function () {
        window.location.href = "civil.html";
      }, 700);
    });
  }

  if (softwareButton) {
    softwareButton.addEventListener("click", function (event) {
      event.preventDefault();
      softwareButton.classList.add("active");

      setTimeout(function () {
        window.location.href = "software.html";
      }, 700);
    });
  }

  // Enquiry form backend connection
  async function submitEnquiry(form, serviceName) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = new FormData(form);

      const enquiry = {
        customerName: formData.get("customerName"),
        phoneNumber: formData.get("customerPhone"),
        serviceType:
          formData.get("civilService") ||
          formData.get("softwareService") ||
          serviceName,
        projectDetails: formData.get("projectDetails"),
      };

      try {
        const response = await fetch("http://localhost:8080/api/enquiries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(enquiry),
        });

        if (!response.ok) {
          throw new Error("Enquiry submission failed");
        }

        alert("Your enquiry submitted successfully!");
        form.reset();
      } catch (error) {
        alert("Unable to submit enquiry. Please try again.");
        console.error(error);
      }
    });
  }

  const civilForm = document.getElementById("civilEnquiryForm");
  const softwareForm = document.getElementById("softwareEnquiryForm");

  if (civilForm) {
    submitEnquiry(civilForm, "Civil");
  }

  if (softwareForm) {
    submitEnquiry(softwareForm, "Software");
  }
});

const consentBanner = document.getElementById("visitorConsentBanner");

const acceptTracking = document.getElementById("acceptVisitorTracking");
const rejectTracking = document.getElementById("rejectVisitorTracking");

const consentChoice = localStorage.getItem("visitorAnalyticsConsent");

if (consentBanner && consentChoice === null) {
  consentBanner.style.display = "block";
}

if (acceptTracking) {
  acceptTracking.addEventListener("click", () => {
    localStorage.setItem("visitorAnalyticsConsent", "accepted");

    if (consentBanner) {
      consentBanner.style.display = "none";
    }

    trackWebsiteVisit();
  });
}

if (rejectTracking) {
  rejectTracking.addEventListener("click", () => {
    localStorage.setItem("visitorAnalyticsConsent", "rejected");

    if (consentBanner) {
      consentBanner.style.display = "none";
    }
  });
}

if (consentChoice === "accepted") {
  trackWebsiteVisit();
}

function getAnonymousVisitorId() {
  let visitorId = localStorage.getItem("aitagVisitorId");

  if (!visitorId) {
    visitorId = crypto.randomUUID();

    localStorage.setItem("aitagVisitorId", visitorId);
  }

  return visitorId;
}
async function trackWebsiteVisit() {
  if (localStorage.getItem("visitorAnalyticsConsent") !== "accepted") {
    return;
  }

  const visitorData = {
    visitorId: getAnonymousVisitorId(),
    pagePath: window.location.pathname,
    eventType: "PAGE_VIEW",
  };

  try {
    const response = await fetch("http://127.0.0.1:8080/api/visitors/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(visitorData),
    });

    if (!response.ok) {
      console.error("Visitor tracking failed:", response.status);
    }
  } catch (error) {
    console.error("Visitor tracking error:", error);
  }
}

/* ===== AI TAGS 3D DIGITAL EARTH ===== */

(function () {
  const canvas = document.getElementById("earthCanvas");

  if (!canvas || !window.THREE) {
    console.error("Three.js or Earth canvas not found");
    return;
  }

  const THREE = window.THREE;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);

  camera.position.z = 4;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  renderer.setClearColor(0x000000, 0);

  const earthGroup = new THREE.Group();
  scene.add(earthGroup);

  // Main blue Earth
  const earthGeometry = new THREE.SphereGeometry(1, 96, 96);

  // Create a futuristic glowing Earth map texture
  const mapCanvas = document.createElement("canvas");
  mapCanvas.width = 1024;
  mapCanvas.height = 512;

  const ctx = mapCanvas.getContext("2d");

  const oceanGradient = ctx.createLinearGradient(0, 0, 1024, 512);
  oceanGradient.addColorStop(0, "#031638");
  oceanGradient.addColorStop(0.5, "#0753a5");
  oceanGradient.addColorStop(1, "#020b25");

  ctx.fillStyle = oceanGradient;
  ctx.fillRect(0, 0, 1024, 512);

  // Longitude grid
  ctx.strokeStyle = "rgba(50, 200, 255, 0.22)";
  ctx.lineWidth = 1;

  for (let x = 0; x <= 1024; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }

  // Latitude grid
  for (let y = 0; y <= 512; y += 42) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Glowing land shapes
  const continents = [
    [
      [130, 100],
      [190, 65],
      [250, 95],
      [270, 145],
      [230, 180],
      [190, 165],
      [160, 220],
      [125, 180],
    ],
    [
      [235, 225],
      [285, 245],
      [300, 310],
      [270, 390],
      [245, 350],
      [220, 280],
    ],
    [
      [430, 105],
      [490, 75],
      [535, 105],
      [520, 155],
      [475, 170],
      [450, 145],
    ],
    [
      [450, 175],
      [510, 160],
      [550, 230],
      [525, 330],
      [485, 370],
      [450, 285],
    ],
    [
      [520, 95],
      [610, 65],
      [720, 90],
      [790, 140],
      [740, 180],
      [650, 155],
      [600, 195],
      [550, 155],
    ],
    [
      [700, 285],
      [755, 270],
      [800, 305],
      [775, 350],
      [720, 340],
    ],
  ];

  const landGradient = ctx.createLinearGradient(0, 80, 0, 420);
  landGradient.addColorStop(0, "#a4f5ff");
  landGradient.addColorStop(1, "#00aaff");

  continents.forEach((points) => {
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point[0], point[1]);
      } else {
        ctx.lineTo(point[0], point[1]);
      }
    });
    ctx.closePath();

    ctx.fillStyle = landGradient;
    ctx.shadowColor = "#00cfff";
    ctx.shadowBlur = 18;
    ctx.fill();

    ctx.strokeStyle = "#8cecff";
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  ctx.shadowBlur = 0;

  const earthTexture = new THREE.CanvasTexture(mapCanvas);

  const earthMaterial = new THREE.MeshPhongMaterial({
    map: earthTexture,
    color: 0xffffff,
    emissive: 0x032b75,
    emissiveIntensity: 0.55,
    shininess: 90,
  });

  const earth = new THREE.Mesh(earthGeometry, earthMaterial);

  earthGroup.add(earth);

  // Glowing wireframe
  const wireGeometry = new THREE.SphereGeometry(1.008, 32, 24);

  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0x20cfff,
    wireframe: true,
    transparent: true,
    opacity: 0.32,
  });

  const wireEarth = new THREE.Mesh(wireGeometry, wireMaterial);

  earthGroup.add(wireEarth);

  // Outer atmosphere
  const atmosphereGeometry = new THREE.SphereGeometry(1.12, 64, 64);

  const atmosphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x00cfff,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.32,
  });

  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);

  earthGroup.add(atmosphere);

  /* ===== ENERGY ORBIT RINGS ===== */

  const orbitRings = [];

  for (let i = 0; i < 3; i++) {
    const ringGeometry = new THREE.TorusGeometry(
      1.45 + i * 0.16,
      0.004,
      8,
      160,
    );

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: i === 1 ? 0xffffff : 0x00aaff,
      transparent: true,
      opacity: 0.65 - i * 0.12,
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);

    ring.rotation.x = Math.PI / 2.5 + i * 0.5;
    ring.rotation.y = i * 0.6;

    earthGroup.add(ring);
    orbitRings.push(ring);
  }

  /* ===== GLOBAL DATA CONNECTION NETWORK ===== */

  function getEarthPoint(lat, lon, radius = 1.025) {
    const phi = ((90 - lat) * Math.PI) / 180;
    const theta = ((lon + 180) * Math.PI) / 180;

    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta),
    );
  }

  const connections = [
    [20, 10, 40, 100],
    [40, 100, -10, 130],
    [20, 10, 50, -100],
    [-10, 130, 30, -40],
    [50, -100, 30, -40],
  ];

  connections.forEach(([lat1, lon1, lat2, lon2]) => {
    const start = getEarthPoint(lat1, lon1);
    const end = getEarthPoint(lat2, lon2);

    const middle = start.clone().add(end).multiplyScalar(0.5);
    middle.normalize().multiplyScalar(1.3);

    const curve = new THREE.QuadraticBezierCurve3(start, middle, end);

    const geometry = new THREE.TubeGeometry(curve, 40, 0.003, 6, false);

    const material = new THREE.MeshBasicMaterial({
      color: 0x38d9ff,
      transparent: true,
      opacity: 1,
    });

    earthGroup.add(new THREE.Mesh(geometry, material));

    const nodeGeometry = new THREE.SphereGeometry(0.025, 12, 12);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });

    [start, end].forEach((point) => {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.copy(point);
      earthGroup.add(node);
    });
  });

  /* ===== GLOWING CITY MARKERS ===== */

  const cityMarkers = [];

  const cities = [
    { lat: 13.08, lon: 80.27 }, // Chennai
    { lat: 19.07, lon: 72.87 }, // Mumbai
    { lat: 28.61, lon: 77.2 }, // Delhi
    { lat: 51.5, lon: -0.12 }, // London
    { lat: 40.71, lon: -74.0 }, // New York
    { lat: 35.67, lon: 139.65 }, // Tokyo
  ];

  cities.forEach((city) => {
    const position = getEarthPoint(city.lat, city.lon, 1.035);

    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
    );

    marker.position.copy(position);
    earthGroup.add(marker);

    const pulse = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 16, 16),
      new THREE.MeshBasicMaterial({
        color: 0x00baff,
        transparent: true,
        opacity: 0.9,
        wireframe: true,
      }),
    );

    pulse.position.copy(position);
    earthGroup.add(pulse);

    cityMarkers.push(pulse);
  });

  /* ===== 3D ORBITING SATELLITE ===== */

  const satelliteOrbit = new THREE.Group();
  scene.add(satelliteOrbit);

  // Satellite body
  const satellite = new THREE.Group();

  const satelliteBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.12, 0.12),
    new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0x0088ff,
      emissiveIntensity: 0.9,
    }),
  );

  satellite.add(satelliteBody);

  // Left solar panel
  const panelMaterial = new THREE.MeshBasicMaterial({
    color: 0x008cff,
    side: THREE.DoubleSide,
  });

  const leftPanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.09, 0.015),
    panelMaterial,
  );

  leftPanel.position.x = -0.23;
  satellite.add(leftPanel);

  // Right solar panel
  const rightPanel = leftPanel.clone();
  rightPanel.position.x = 0.23;
  satellite.add(rightPanel);

  // Satellite position
  satellite.position.set(1.7, 0, 0);

  satelliteOrbit.add(satellite);

  // Orbit path
  const satellitePath = new THREE.Mesh(
    new THREE.TorusGeometry(1.7, 0.002, 8, 120),
    new THREE.MeshBasicMaterial({
      color: 0x00aaff,
      transparent: true,
      opacity: 0.4,
    }),
  );

  satellitePath.rotation.x = Math.PI / 2.5;
  scene.add(satellitePath);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x8bbdff, 1.5);

  scene.add(ambientLight);

  const blueLight = new THREE.PointLight(0x00aaff, 3);

  blueLight.position.set(3, 2, 4);
  scene.add(blueLight);

  const whiteLight = new THREE.PointLight(0xffffff, 2);

  whiteLight.position.set(-3, -1, 2);
  scene.add(whiteLight);

  /* ===== FLOATING DIGITAL PARTICLES ===== */

  const particleCount = 900;
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    const radius = 1.5 + Math.random() * 2.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);

    particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);

    particlePositions[i3 + 2] = radius * Math.cos(phi);
  }

  const particleGeometry = new THREE.BufferGeometry();

  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(particlePositions, 3),
  );

  const particleMaterial = new THREE.PointsMaterial({
    color: 0x35caff,
    size: 0.018,
    transparent: true,
    opacity: 0.95,
    sizeAttenuation: true,
  });

  const digitalParticles = new THREE.Points(particleGeometry, particleMaterial);

  scene.add(digitalParticles);

  // Responsive size
  function resizeEarth() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (!width || !height) return;

    renderer.setSize(width, height, false);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", resizeEarth);
  resizeEarth();

  // Hide fallback after successful setup
  const fallback = document.querySelector(".earth-fallback");

  if (fallback) {
    fallback.style.display = "none";
  }
  /* ===== INTERACTIVE MOUSE MOVEMENT ===== */

  let targetRotationX = -0.12;
  let targetRotationY = 0;

  window.addEventListener("mousemove", (event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = (event.clientY / window.innerHeight) * 2 - 1;

    targetRotationY = x * 0.18;
    targetRotationX = -0.12 + y * 0.12;
  });
  // Animation
  function animateEarth() {
    requestAnimationFrame(animateEarth);

    earthGroup.rotation.y += 0.0015;
    earthGroup.rotation.y += targetRotationY * 0.01;
    digitalParticles.rotation.y += 0.0008;
    digitalParticles.rotation.x += 0.0003;
    earthGroup.rotation.x += (targetRotationX - earthGroup.rotation.x) * 0.03;

    wireEarth.rotation.y += 0.0025;

    renderer.render(scene, camera);
    atmosphere.material.opacity = 0.25 + Math.sin(Date.now() * 0.0015) * 0.08;
    orbitRings.forEach((ring, index) => {
      ring.rotation.z += 0.0007 + index * 0.0003;
    });
    cityMarkers.forEach((marker, index) => {
      const pulse = 1 + Math.sin(Date.now() * 0.002 + index) * 0.2;
      marker.scale.setScalar(pulse);
    });
    satelliteOrbit.rotation.y += 0.003;
  }

  animateEarth();
})();

/* ===== INTERACTIVE 3D CARD TILT ===== */

document.querySelectorAll(".selection-card").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((centerY - y) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  });
});

/* ===== SCROLL REVEAL ANIMATION ===== */

const revealElements = document.querySelectorAll(
  ".selection-card, .choose-title, .locations",
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-visible");
      }
    });
  },
  { threshold: 0.15 },
);

revealElements.forEach((element) => {
  element.classList.add("reveal-hidden");
  revealObserver.observe(element);
});

/* ===== ABOUT CARDS 3D TILT ===== */

document.querySelectorAll(".about-card").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateX = ((rect.height / 2 - y) / (rect.height / 2)) * 7;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 7;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

/* ===== CIVIL SERVICE 3D TILT ===== */

document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateX = ((rect.height / 2 - y) / (rect.height / 2)) * 7;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 7;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

const civilBuilding = document.querySelector(".civil-building-image");

if (civilBuilding) {
  civilBuilding.addEventListener("mousemove", (event) => {
    const rect = civilBuilding.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * 16;
    const rotateX = (0.5 - y) * 10;

    civilBuilding.style.animation = "none";
    civilBuilding.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
  });
  console.log("Civil building 3D effect loaded");
  civilBuilding.addEventListener("mouseleave", () => {
    civilBuilding.style.transform = "";
    civilBuilding.style.animation = "";
  });
}

/* ===== REAL 3D CIVIL SKYSCRAPER ===== */

(function () {
  const canvas = document.getElementById("civilBuildingCanvas");

  if (!canvas || !window.THREE) return;

  const THREE = window.THREE;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(6, 3.5, 8);
  camera.lookAt(0, 1.8, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const building = new THREE.Group();
  scene.add(building);

  // Main skyscraper structure
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x075080,
    metalness: 0.35,
    roughness: 0.12,
    transmission: 0.15,
    transparent: true,
    opacity: 0.92,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    emissive: 0x001a33,
    emissiveIntensity: 0.4,
  });

  const tower = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 4.5, 1.5),
    glassMaterial,
  );

  tower.position.y = 2.25;
  building.add(tower);

  // Floor divisions
  for (let i = 0; i < 12; i++) {
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(2.23, 0.025, 1.53),
      new THREE.MeshPhongMaterial({
        color: 0x00cfff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
        shininess: 100,
      }),
    );

    floor.position.y = 0.35 + i * 0.35;
    building.add(floor);
  }

  // Front glass windows
  for (let row = 0; row < 12; row++) {
    for (let col = 0; col < 5; col++) {
      const windowPanel = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.23, 0.018),
        new THREE.MeshPhongMaterial({
          color: 0x42cfff,
          emissive: 0x0088cc,
          emissiveIntensity: 0.8,
          shininess: 120,
        }),
      );

      windowPanel.position.set(-0.88 + col * 0.44, 0.25 + row * 0.35, 0.76);

      building.add(windowPanel);
    }
  }

  // Side windows
  for (let row = 0; row < 12; row++) {
    for (let col = 0; col < 3; col++) {
      const sideWindow = new THREE.Mesh(
        new THREE.BoxGeometry(0.018, 0.23, 0.32),
        new THREE.MeshPhongMaterial({
          color: 0x168fca,
          emissive: 0x052d55,
        }),
      );

      sideWindow.position.set(1.11, 0.25 + row * 0.35, -0.48 + col * 0.45);

      building.add(sideWindow);
    }
  }

  // Rooftop
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.16, 1.3),
    new THREE.MeshPhongMaterial({ color: 0x00aaff }),
  );

  roof.position.y = 4.55;
  building.add(roof);

  // Construction base
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.18, 2.3),
    new THREE.MeshPhongMaterial({
      color: 0x06335b,
      shininess: 80,
    }),
  );

  base.position.y = -0.1;
  building.add(base);

  // Blue Energy Rings
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x00aaff,
    transparent: true,
    opacity: 0.65,
  });
  // Glowing Circular Platform
  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(2.1, 2.1, 0.08, 64),
    new THREE.MeshPhongMaterial({
      color: 0x06335b,
      emissive: 0x0066aa,
      emissiveIntensity: 1.2,
      shininess: 100,
    }),
  );

  platform.position.y = -0.18;
  building.add(platform);

  const ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(2.1, 0.018, 8, 100),
    ringMaterial,
  );
  ring1.rotation.x = Math.PI / 2.5;
  ring1.position.y = 1.8;
  building.add(ring1);

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(2.5, 0.012, 8, 100),
    ringMaterial.clone(),
  );
  ring2.rotation.x = Math.PI / 2.2;
  ring2.position.y = 2.5;
  building.add(ring2);
  // Floating Blue Particles
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = [];

  for (let i = 0; i < 100; i++) {
    particlePositions.push(
      (Math.random() - 0.5) * 7,
      Math.random() * 6,
      (Math.random() - 0.5) * 7,
    );
  }

  particleGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(particlePositions, 3),
  );

  const particleMaterial = new THREE.PointsMaterial({
    color: 0x00aaff,
    size: 0.035,
    transparent: true,
    opacity: 0.8,
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);

  scene.add(particles);
  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 1.5));

  const blueLight = new THREE.PointLight(0x00aaff, 3);
  blueLight.position.set(4, 6, 5);
  scene.add(blueLight);

  const whiteLight = new THREE.PointLight(0xffffff, 2);
  whiteLight.position.set(-4, 3, 4);
  scene.add(whiteLight);

  // Responsive canvas
  function resizeBuilding() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (!width || !height) return;

    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", resizeBuilding);
  resizeBuilding();

  // Mouse-controlled 3D movement
  let targetX = -0.15;
  let targetY = 0;

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    targetY = (x - 0.5) * 0.8;
    targetX = (y - 0.5) * 0.35;
  });

  canvas.addEventListener("pointerleave", () => {
    targetX = -0.15;
    targetY = 0;
  });

  // Animation
  function animateBuilding() {
    requestAnimationFrame(animateBuilding);

    building.rotation.y += (targetY - building.rotation.y) * 0.04;

    building.rotation.x += (targetX - building.rotation.x) * 0.04;
    ring1.rotation.z += 0.006;
    ring2.rotation.z -= 0.004;

    renderer.render(scene, camera);
    platform.material.emissiveIntensity =
      0.8 + Math.sin(Date.now() * 0.002) * 0.5;

    particles.rotation.y += 0.0015;
    particles.position.y = Math.sin(Date.now() * 0.001) * 0.08;
  }

  animateBuilding();
})();
/* ===== SOFTWARE 3D LAPTOP ===== */
/* ===== FUTURISTIC 3D SOFTWARE LAPTOP ===== */
(function () {
  const canvas = document.getElementById("softwareLaptopCanvas");
  if (!canvas || !window.THREE) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(4.5, 3.2, 7.5);
  camera.lookAt(0, 0.9, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const laptop = new THREE.Group();
  scene.add(laptop);

  // Materials
  const bodyMaterial = new THREE.MeshPhongMaterial({
    color: 0x142b46,
    shininess: 120,
    specular: 0x55ccff,
  });

  const neonMaterial = new THREE.MeshBasicMaterial({
    color: 0x00cfff,
  });

  const screenMaterial = new THREE.MeshBasicMaterial({
    color: 0x031b38,
  });

  // Laptop Base
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.16, 2),
    bodyMaterial,
  );
  base.position.y = 0;
  laptop.add(base);

  // Glowing Base Edge
  const baseEdge = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(3.22, 0.17, 2.02)),
    neonMaterial,
  );
  baseEdge.position.y = 0;
  laptop.add(baseEdge);

  // Keyboard Background
  const keyboard = new THREE.Mesh(
    new THREE.BoxGeometry(2.65, 0.025, 0.85),
    new THREE.MeshBasicMaterial({ color: 0x052b50 }),
  );
  keyboard.position.set(0, 0.095, 0.25);
  laptop.add(keyboard);

  // Individual Keyboard Keys
  const keyMaterial = new THREE.MeshBasicMaterial({
    color: 0x00aaff,
  });

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 12; col++) {
      const key = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.025, 0.12),
        keyMaterial,
      );

      key.position.set(-0.86 + col * 0.155, 0.12, -0.04 + row * 0.19);

      laptop.add(key);
    }
  }

  // Touchpad
  const touchpad = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.015, 0.35),
    new THREE.MeshBasicMaterial({ color: 0x0874a8 }),
  );
  touchpad.position.set(0, 0.1, 0.72);
  laptop.add(touchpad);

  // Laptop Screen Frame
  const screenFrame = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 2, 0.12),
    bodyMaterial,
  );

  screenFrame.position.set(0, 1.08, -0.92);
  screenFrame.rotation.x = -0.12;
  laptop.add(screenFrame);

  // Screen Border Glow
  const screenEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(3.22, 2.02, 0.13)),
    neonMaterial,
  );
  screenEdges.position.copy(screenFrame.position);
  screenEdges.rotation.copy(screenFrame.rotation);
  laptop.add(screenEdges);

  // Screen Display
  const display = new THREE.Mesh(
    new THREE.PlaneGeometry(2.85, 1.7),
    screenMaterial,
  );

  display.position.set(0, 1.1, -0.845);
  laptop.add(display);

  // Animated Code Lines
  const codeLines = [];

  for (let i = 0; i < 10; i++) {
    const line = new THREE.Mesh(
      new THREE.BoxGeometry(1.1 + Math.random() * 0.9, 0.025, 0.01),
      new THREE.MeshBasicMaterial({
        color: i % 3 === 0 ? 0x00ffff : 0x168cff,
      }),
    );

    line.position.set(-0.65, 1.75 - i * 0.15, -0.83);
    laptop.add(line);
    codeLines.push(line);
  }
  // ===== DIGITAL DASHBOARD ON SCREEN =====

  // Dashboard Side Panel
  const dashboardPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.65, 1.25),
    new THREE.MeshBasicMaterial({
      color: 0x06416b,
      transparent: true,
      opacity: 0.9,
    }),
  );

  dashboardPanel.position.set(0.95, 1.1, -0.82);
  laptop.add(dashboardPanel);

  // Dashboard Glowing Bars
  for (let i = 0; i < 5; i++) {
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.035, 0.01),
      new THREE.MeshBasicMaterial({ color: 0x00dfff }),
    );

    bar.position.set(0.95, 1.5 - i * 0.17, -0.8);
    laptop.add(bar);
  }

  // Animated Dashboard Graph
  const graphBars = [];

  for (let i = 0; i < 6; i++) {
    const graph = new THREE.Mesh(
      new THREE.BoxGeometry(0.055, 0.2 + Math.random() * 0.35, 0.015),
      new THREE.MeshBasicMaterial({ color: 0x00aaff }),
    );

    graph.position.set(0.55 + i * 0.12, 0.85, -0.8);
    laptop.add(graph);
    graphBars.push(graph);
  }
  // Screen Top Bar
  const topBar = new THREE.Mesh(
    new THREE.BoxGeometry(2.85, 0.08, 0.015),
    neonMaterial,
  );
  topBar.position.set(0, 1.88, -0.83);
  laptop.add(topBar);

  // Floating Holographic Panels
  const panels = [];

  function createPanel(x, y, z) {
    const group = new THREE.Group();

    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 1.25, 0.04),
      new THREE.MeshBasicMaterial({
        color: 0x06345b,
        transparent: true,
        opacity: 0.8,
      }),
    );

    group.add(panel);

    const border = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(0.88, 1.28, 0.05)),
      neonMaterial,
    );

    group.add(border);

    for (let i = 0; i < 5; i++) {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(0.45 + Math.random() * 0.2, 0.025, 0.01),
        neonMaterial,
      );

      bar.position.set(-0.05, 0.4 - i * 0.17, 0.03);
      group.add(bar);
    }

    group.position.set(x, y, z);
    scene.add(group);
    panels.push(group);
  }

  createPanel(-2.2, 1.8, 0);
  createPanel(2.2, 1.6, 0);
  // ===== GLOWING LAPTOP PLATFORM =====

  const platformMaterial = new THREE.MeshPhongMaterial({
    color: 0x06345b,
    emissive: 0x0066cc,
    emissiveIntensity: 0.8,
    shininess: 100,
    transparent: true,
    opacity: 0.85,
  });

  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(2.1, 2.3, 0.12, 64),
    platformMaterial,
  );

  platform.position.set(0, -0.65, 0);
  scene.add(platform);

  // Platform Neon Ring
  const platformRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.15, 0.025, 8, 100),
    new THREE.MeshBasicMaterial({ color: 0x00cfff }),
  );

  platformRing.rotation.x = Math.PI / 2;
  platformRing.position.y = -0.57;
  scene.add(platformRing);
  // Floating Energy Rings
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x008cff,
    transparent: true,
    opacity: 0.6,
  });

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.8, 0.012, 8, 100),
    ringMaterial,
  );

  ring.rotation.x = 1.2;
  ring.position.y = 0.6;
  scene.add(ring);

  // Floating Particles
  const particlePositions = [];

  for (let i = 0; i < 120; i++) {
    particlePositions.push(
      (Math.random() - 0.5) * 7,
      Math.random() * 4,
      (Math.random() - 0.5) * 5,
    );
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(particlePositions, 3),
  );

  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      color: 0x00cfff,
      size: 0.035,
      transparent: true,
      opacity: 0.8,
    }),
  );

  scene.add(particles);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 1.4));

  const blueLight = new THREE.PointLight(0x008cff, 4);
  blueLight.position.set(4, 5, 5);
  scene.add(blueLight);

  const cyanLight = new THREE.PointLight(0x00ffff, 2);
  cyanLight.position.set(-4, 2, 3);
  scene.add(cyanLight);

  // Responsive Resize
  function resizeLaptop() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (!width || !height) return;

    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", resizeLaptop);
  resizeLaptop();

  // Mouse Interaction
  let targetX = -0.12;
  let targetY = 0;

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();

    targetY = ((event.clientX - rect.left) / rect.width - 0.5) * 0.5;
    targetX = ((event.clientY - rect.top) / rect.height - 0.5) * 0.25;
  });

  canvas.addEventListener("pointerleave", () => {
    targetX = -0.12;
    targetY = 0;
  });

  // Animation
  function animateLaptop() {
    requestAnimationFrame(animateLaptop);

    const time = Date.now() * 0.001;

    laptop.rotation.y += (targetY - laptop.rotation.y) * 0.04;
    laptop.rotation.y += 0.002;
    laptop.rotation.x += (targetX - laptop.rotation.x) * 0.04;

    laptop.position.y = Math.sin(time) * 0.06;

    panels.forEach((panel, index) => {
      panel.position.y =
        (index === 0 ? 1.8 : 1.6) + Math.sin(time * 1.5 + index) * 0.15;
      panel.rotation.y = Math.sin(time + index) * 0.12;
    });

    ring.rotation.z += 0.003;
    particles.rotation.y += 0.001;

    codeLines.forEach((line, index) => {
      line.material.opacity = 0.6 + Math.sin(time * 2 + index) * 0.4;
    });
    graphBars.forEach((bar, index) => {
      bar.scale.y = 0.7 + Math.abs(Math.sin(time * 2 + index)) * 1.5;
    });
    renderer.render(scene, camera);
    platform.material.emissiveIntensity = 0.6 + Math.sin(time * 2) * 0.35;

    platformRing.rotation.z += 0.005;
  }

  animateLaptop();
})();
/* SOFTWARE SERVICE ICON ANIMATION */

document
  .querySelectorAll("#software-services .service-card")
  .forEach((card) => {
    const icon = card.querySelector(".service-icon");

    card.addEventListener("mousemove", (event) => {
      if (!icon) return;

      const rect = card.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const rotateY = (x / rect.width - 0.5) * 30;
      const rotateX = (y / rect.height - 0.5) * -30;

      icon.style.transform = `translateY(-12px) translateZ(35px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.15)`;
    });

    card.addEventListener("mouseleave", () => {
      if (icon) {
        icon.style.transform = "";
      }
    });
  });
