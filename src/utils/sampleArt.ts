/**
 * High-quality vector black-and-white coloring pages (clean thick outlines, no fills)
 * Perfect as instant previews and fallbacks
 */

export function createSpaceDinoSVG(sceneNumber: number, childName: string): string {
  let innerElements = "";

  if (sceneNumber === 1) {
    // Astronaut T-Rex putting on helmet
    innerElements = `
      <!-- Space Helmet Bubble -->
      <circle cx="200" cy="180" r="110" fill="white" stroke="black" stroke-width="12" />
      <path d="M 120 180 Q 200 120 280 180" fill="none" stroke="black" stroke-width="6" stroke-dasharray="8 6" />
      <!-- Cute T-Rex Head inside helmet -->
      <path d="M 160 210 Q 140 160 190 140 Q 240 140 250 170 Q 260 200 230 220 Z" fill="white" stroke="black" stroke-width="10" />
      <!-- Big Eye -->
      <circle cx="210" cy="165" r="14" fill="white" stroke="black" stroke-width="8" />
      <circle cx="212" cy="165" r="4" fill="black" />
      <!-- Big Smile with Cute Teeth -->
      <path d="M 175 195 Q 210 215 240 195" fill="none" stroke="black" stroke-width="8" />
      <polygon points="190,195 195,205 200,195" fill="white" stroke="black" stroke-width="4" />
      <polygon points="210,195 215,205 220,195" fill="white" stroke="black" stroke-width="4" />
      <!-- Spacesuit Body -->
      <path d="M 140 290 Q 200 270 260 290 L 275 400 Q 200 420 125 400 Z" fill="white" stroke="black" stroke-width="12" />
      <!-- Spacesuit Badge with Child Initial -->
      <circle cx="175" cy="330" r="22" fill="white" stroke="black" stroke-width="6" />
      <text x="175" y="338" font-family="Arial, sans-serif" font-weight="900" font-size="22" text-anchor="middle" fill="black">${childName.charAt(0) || "L"}</text>
      <!-- Tiny T-Rex Arms waving -->
      <path d="M 140 310 Q 100 300 95 320 Q 110 340 140 330" fill="white" stroke="black" stroke-width="8" />
      <path d="M 260 310 Q 300 290 315 310 Q 295 335 260 330" fill="white" stroke="black" stroke-width="8" />
      <!-- Rocket Boots -->
      <rect x="135" y="400" width="45" height="40" rx="10" fill="white" stroke="black" stroke-width="10" />
      <rect x="220" y="400" width="45" height="40" rx="10" fill="white" stroke="black" stroke-width="10" />
      <!-- Stars and Moon -->
      <polygon points="70,70 78,92 100,92 82,105 88,127 70,113 52,127 58,105 40,92 62,92" fill="white" stroke="black" stroke-width="6" />
      <polygon points="320,80 326,96 345,96 330,107 335,123 320,113 305,123 310,107 295,96 314,96" fill="white" stroke="black" stroke-width="6" />
      <!-- Smiling Planet -->
      <circle cx="320" cy="240" r="35" fill="white" stroke="black" stroke-width="8" />
      <ellipse cx="320" cy="240" rx="55" ry="14" fill="none" stroke="black" stroke-width="6" />
    `;
  } else if (sceneNumber === 2) {
    // Stegosaurus on the Moon with flag
    innerElements = `
      <!-- Moon surface crater -->
      <path d="M 0 420 Q 200 360 400 420" fill="white" stroke="black" stroke-width="12" />
      <ellipse cx="90" cy="425" rx="35" ry="12" fill="white" stroke="black" stroke-width="6" />
      <ellipse cx="280" cy="415" rx="45" ry="15" fill="white" stroke="black" stroke-width="6" />
      <!-- Stegosaurus Body -->
      <path d="M 90 330 Q 180 210 300 310 Q 310 360 270 380 Q 150 400 90 330 Z" fill="white" stroke="black" stroke-width="12" />
      <!-- Stego Back Plates -->
      <polygon points="120,285 135,230 155,270" fill="white" stroke="black" stroke-width="8" />
      <polygon points="160,260 185,190 210,250" fill="white" stroke="black" stroke-width="8" />
      <polygon points="215,250 240,195 260,260" fill="white" stroke="black" stroke-width="8" />
      <polygon points="265,265 285,220 298,280" fill="white" stroke="black" stroke-width="8" />
      <!-- Head with astronaut dome -->
      <circle cx="85" cy="315" r="45" fill="white" stroke="black" stroke-width="10" />
      <ellipse cx="75" cy="315" rx="20" ry="15" fill="white" stroke="black" stroke-width="6" />
      <circle cx="75" cy="310" r="5" fill="black" />
      <!-- Legs -->
      <rect x="120" y="360" width="30" height="50" rx="8" fill="white" stroke="black" stroke-width="10" />
      <rect x="230" y="355" width="30" height="55" rx="8" fill="white" stroke="black" stroke-width="10" />
      <!-- Spiked Tail -->
      <path d="M 290 320 Q 360 320 375 300" fill="none" stroke="black" stroke-width="10" />
      <polygon points="360,295 375,270 380,300" fill="white" stroke="black" stroke-width="6" />
      <polygon points="365,310 390,325 365,330" fill="white" stroke="black" stroke-width="6" />
      <!-- Flag planted with Child's Name -->
      <line x1="330" y1="410" x2="330" y2="180" stroke="black" stroke-width="8" />
      <path d="M 330 180 L 220 210 L 330 240 Z" fill="white" stroke="black" stroke-width="8" />
      <text x="275" y="217" font-family="Arial, sans-serif" font-weight="900" font-size="14" text-anchor="middle" fill="black">${childName || "LEO"}</text>
      <!-- Big Star -->
      <polygon points="60,90 68,110 90,110 72,122 78,142 60,130 42,142 48,122 30,110 52,110" fill="white" stroke="black" stroke-width="6" />
    `;
  } else if (sceneNumber === 3) {
    // Baby Pterodactyl flying past Saturn rings
    innerElements = `
      <!-- Big Ringed Planet -->
      <circle cx="280" cy="160" r="70" fill="white" stroke="black" stroke-width="12" />
      <path d="M 150 170 Q 280 80 390 130 Q 420 150 370 170 Q 250 220 150 170 Z" fill="white" stroke="black" stroke-width="8" />
      <!-- Smiling Face on Planet -->
      <circle cx="260" cy="150" r="7" fill="black" />
      <circle cx="300" cy="150" r="7" fill="black" />
      <path d="M 270 170 Q 280 185 295 170" fill="none" stroke="black" stroke-width="6" stroke-linecap="round" />
      <!-- Baby Pterodactyl with jetpack -->
      <!-- Body -->
      <ellipse cx="140" cy="300" rx="35" ry="45" fill="white" stroke="black" stroke-width="10" />
      <!-- Head with crest and beak -->
      <path d="M 130 260 Q 90 220 70 210 Q 120 220 145 235 Q 165 200 190 230 Z" fill="white" stroke="black" stroke-width="10" />
      <circle cx="120" cy="240" r="6" fill="black" />
      <!-- Big Wings Outstretched -->
      <path d="M 120 270 Q 30 240 10 200 Q 60 260 120 290 Z" fill="white" stroke="black" stroke-width="10" />
      <path d="M 160 270 Q 240 240 270 200 Q 210 260 160 290 Z" fill="white" stroke="black" stroke-width="10" />
      <!-- Jetpack with flame swirls -->
      <rect x="125" y="335" width="30" height="40" rx="8" fill="white" stroke="black" stroke-width="8" />
      <path d="M 130 380 Q 140 430 130 460 Q 145 420 140 380" fill="white" stroke="black" stroke-width="6" />
      <path d="M 145 380 Q 155 440 145 470 Q 160 425 150 380" fill="white" stroke="black" stroke-width="6" />
      <!-- Floating Stars & Asteroids -->
      <circle cx="60" cy="390" r="22" fill="white" stroke="black" stroke-width="8" />
      <circle cx="55" cy="385" r="5" fill="none" stroke="black" stroke-width="4" />
      <polygon points="340,320 348,340 370,340 352,352 358,372 340,360 322,372 328,352 310,340 332,340" fill="white" stroke="black" stroke-width="6" />
    `;
  } else if (sceneNumber === 4) {
    // Triceratops driving lunar rover buggy
    innerElements = `
      <!-- Space Buggy Wheels -->
      <circle cx="120" cy="380" r="42" fill="white" stroke="black" stroke-width="12" />
      <circle cx="120" cy="380" r="20" fill="white" stroke="black" stroke-width="6" />
      <circle cx="280" cy="380" r="42" fill="white" stroke="black" stroke-width="12" />
      <circle cx="280" cy="380" r="20" fill="white" stroke="black" stroke-width="6" />
      <!-- Buggy Chassis -->
      <path d="M 60 370 L 340 370 L 320 310 L 160 310 L 110 330 Z" fill="white" stroke="black" stroke-width="10" />
      <!-- Triceratops driver -->
      <!-- Frill -->
      <path d="M 140 260 Q 180 180 240 230 Q 250 280 200 290 Z" fill="white" stroke="black" stroke-width="10" />
      <!-- 3 Horns -->
      <polygon points="175,220 185,160 195,220" fill="white" stroke="black" stroke-width="8" />
      <polygon points="215,220 230,165 235,225" fill="white" stroke="black" stroke-width="8" />
      <polygon points="135,265 110,250 140,280" fill="white" stroke="black" stroke-width="8" />
      <!-- Face -->
      <circle cx="170" cy="260" r="6" fill="black" />
      <path d="M 145 285 Q 165 300 180 285" fill="none" stroke="black" stroke-width="6" />
      <!-- Steering Wheel -->
      <ellipse cx="140" cy="315" rx="16" ry="24" fill="none" stroke="black" stroke-width="8" />
      <!-- Antenna with star signal -->
      <line x1="300" y1="310" x2="330" y2="210" stroke="black" stroke-width="6" />
      <circle cx="330" cy="210" r="10" fill="white" stroke="black" stroke-width="6" />
      <path d="M 335 190 Q 355 195 350 215" fill="none" stroke="black" stroke-width="5" />
      <!-- Distant Earth -->
      <circle cx="60" cy="110" r="35" fill="white" stroke="black" stroke-width="8" />
      <path d="M 40 105 Q 60 90 75 110 Q 55 130 40 105 Z" fill="white" stroke="black" stroke-width="5" />
    `;
  } else {
    // Grand Space Dino Party with Rocket & Cake
    innerElements = `
      <!-- Space Rocket in background -->
      <path d="M 300 280 Q 300 120 330 80 Q 360 120 360 280 Z" fill="white" stroke="black" stroke-width="10" />
      <circle cx="330" cy="170" r="18" fill="white" stroke="black" stroke-width="8" />
      <polygon points="280,260 300,220 300,280" fill="white" stroke="black" stroke-width="8" />
      <polygon points="380,260 360,220 360,280" fill="white" stroke="black" stroke-width="8" />
      <!-- Cheerful Brontosaurus with Party Hat -->
      <path d="M 100 420 Q 80 280 150 180 Q 180 120 220 125 Q 240 140 230 180 Q 190 220 180 320 Q 220 330 250 420 Z" fill="white" stroke="black" stroke-width="12" />
      <!-- Dino Eyes and Smile -->
      <circle cx="210" cy="140" r="6" fill="black" />
      <path d="M 215 160 Q 230 170 225 155" fill="none" stroke="black" stroke-width="6" stroke-linecap="round" />
      <!-- Party Hat with Pom-pom -->
      <polygon points="200,120 220,50 235,120" fill="white" stroke="black" stroke-width="8" />
      <circle cx="220" cy="45" r="10" fill="white" stroke="black" stroke-width="6" />
      <!-- Floating Balloons -->
      <ellipse cx="60" cy="180" rx="25" ry="32" fill="white" stroke="black" stroke-width="8" />
      <path d="M 60 215 Q 50 250 70 290" fill="none" stroke="black" stroke-width="5" />
      <ellipse cx="110" cy="140" rx="22" ry="28" fill="white" stroke="black" stroke-width="8" />
      <path d="M 110 170 Q 120 210 100 250" fill="none" stroke="black" stroke-width="5" />
      <!-- Space Cake on Pedestal -->
      <rect x="180" y="380" width="80" height="35" rx="6" fill="white" stroke="black" stroke-width="8" />
      <line x1="220" y1="380" x2="220" y2="355" stroke="black" stroke-width="6" />
      <!-- Flame -->
      <path d="M 220 355 Q 212 340 220 330 Q 228 340 220 355 Z" fill="white" stroke="black" stroke-width="5" />
      <!-- Banner with Child Name -->
      <rect x="50" y="30" width="130" height="34" rx="8" fill="white" stroke="black" stroke-width="6" />
      <text x="115" y="53" font-family="Arial, sans-serif" font-weight="900" font-size="16" text-anchor="middle" fill="black">YAY ${childName.toUpperCase() || "LEO"}!</text>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480" width="100%" height="100%" style="background-color: white;">
    <rect x="0" y="0" width="400" height="480" fill="white" />
    ${innerElements}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function getDefaultBook(childName = "Leo", theme = "Space Dinosaurs"): any {
  return {
    childName,
    theme,
    ageGroup: "4-7",
    imageSize: "2K",
    aspectRatio: "3:4",
    bookTitle: `${childName}'s Galactic Space Dinosaur Adventure`,
    subtitle: `A magical cosmic coloring story created especially for ${childName}!`,
    coverScenePrompt: "Cute cheerful cartoon dinosaur astronaut floating in starry deep space, holding a helmet, smiling at the viewer",
    coverImageUrl: createSpaceDinoSVG(1, childName),
    createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    pages: [
      {
        pageNumber: 1,
        title: "Page 1: Blast Off Astronaut Rex",
        caption: `Astronaut Rex puts on his shiny space helmet and checks his rocket boots! Ready for countdown, ${childName}!`,
        imagePrompt: "Cute smiling cartoon T-Rex in a bulky astronaut space suit putting on round bubble helmet, stars and planets floating in background, pure thick black line art coloring book page",
        imageUrl: createSpaceDinoSVG(1, childName),
        status: "ready",
        suggestedPalette: ["Cosmic Green", "Rocket Red", "Star Gold", "Galaxy Blue"],
      },
      {
        pageNumber: 2,
        title: "Page 2: Stego Plants the Moon Flag",
        caption: `Stegosaurus touches down on the silvery moon and plants ${childName}'s official explorer flag into the lunar dust!`,
        imagePrompt: "Cute cartoon stegosaurus with space helmet planting a personalized flag on the moon surface with giant craters and stars, bold black line art coloring page",
        imageUrl: createSpaceDinoSVG(2, childName),
        status: "ready",
        suggestedPalette: ["Moon Silver", "Emerald Green", "Neon Orange", "Sky Blue"],
      },
      {
        pageNumber: 3,
        title: "Page 3: Baby Ptero's Jetpack Flight",
        caption: "Whoosh! Baby Pterodactyl zooms past Saturn's magical rings with his super jetpack, waving happily at a smiling planet!",
        imagePrompt: "Adorable baby pterodactyl dinosaur flying with a twin rocket jetpack past giant ringed Saturn planet with smiling cartoon face, thick black vector line art",
        imageUrl: createSpaceDinoSVG(3, childName),
        status: "ready",
        suggestedPalette: ["Sunburst Yellow", "Lilac Purple", "Teal Blue", "Bubblegum Pink"],
      },
      {
        pageNumber: 4,
        title: "Page 4: The Lunar Rover Buggy",
        caption: "Beep beep! Triceratops drives the bouncy moon buggy across stardust hills, honking the cosmic horn for fun!",
        imagePrompt: "Cute cartoon triceratops dinosaur driving a bouncy lunar rover buggy vehicle with giant monster wheels across space craters, thick black outline coloring page",
        imageUrl: createSpaceDinoSVG(4, childName),
        status: "ready",
        suggestedPalette: ["Lime Green", "Electric Blue", "Cheery Yellow", "Tire Black"],
      },
      {
        pageNumber: 5,
        title: "Page 5: The Grand Galaxy Dino Party",
        caption: `All the space dinosaurs gather for a giant celebration to crown ${childName} the bravest explorer in the universe!`,
        imagePrompt: "Big friendly cartoon dinosaur party in space with balloons, rocket ship, birthday cake with candle, banners, and smiling alien friends, clean thick line art coloring book page",
        imageUrl: createSpaceDinoSVG(5, childName),
        status: "ready",
        suggestedPalette: ["Rainbow Colors", "Glitter Gold", "Party Pink", "Midnight Navy"],
      },
    ],
  };
}
