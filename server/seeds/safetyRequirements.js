const SafetyRequirements = require("../models/SafetyRequirements");

const seedSafetyRequirements = async () => {
  try {
    const safetyData = [
      {
        category: "safety-wear",
        title: "Mandatory Safety Wear",
        items: [
          {
            title: "Fire-Resistant Racing Suit",
            description: "Full-body fire-resistant racing suit required",
            required: true,
            order: 1,
          },
          {
            title: "Racing Helmet",
            description: "Must cover the whole face",
            required: true,
            order: 2,
          },
          {
            title: "Racing Gloves",
            description:
              "Must be closed-finger and long enough to cover the wrist (Minimum)",
            required: true,
            order: 3,
          },
          {
            title: "Racing Shoes",
            description:
              "Must be closed-toe and long enough to cover the ankle (Minimum) (fire-resistant)",
            required: true,
            order: 4,
          },
        ],
      },
      {
        category: "car-components",
        title: "Must Include Car Components",
        items: [
          {
            title: "Safety Switch",
            description: "Working safety switch required",
            required: true,
            order: 1,
          },
          {
            title: "Roll Cage (or) Full Mirror Sticker",
            description: "Certified roll cage or full mirror sticker",
            required: true,
            order: 2,
          },
          {
            title: "Hood Pin Lock",
            description: "Hood pin lock installed",
            required: true,
            order: 3,
          },
          {
            title: "Full Bucket Seat",
            description: "Full bucket racing seat properly mounted",
            required: true,
            order: 4,
          },
          {
            title: "4 Point Racing Seat Belt",
            description: "4-point or higher racing seat belt",
            required: true,
            order: 5,
          },
          {
            title: "Battery Terminal Covers",
            description: "Battery terminals must be covered",
            required: true,
            order: 6,
          },
          {
            title: "Fire Extinguisher",
            description: "Working fire extinguisher mounted and accessible",
            required: true,
            order: 7,
          },
          {
            title: "Tow Front and Rear",
            description: "Tow hooks installed front and rear",
            required: true,
            order: 8,
          },
        ],
      },
      {
        category: "terms-conditions",
        title: "Terms and Conditions",
        items: [
          {
            title: "Liability Waiver",
            description:
              "I acknowledge and accept full liability for any injuries or damages",
            required: true,
            order: 1,
          },
          {
            title: "Event Rules and Regulations",
            description: "I agree to follow all event rules and regulations",
            required: true,
            order: 2,
          },
          {
            title: "Safety Briefing Attendance Requirement",
            description:
              "I will attend the mandatory safety briefing before the event",
            required: true,
            order: 3,
          },
          {
            title: "Vehicle Inspection Agreement",
            description:
              "I agree to have my vehicle inspected before participating",
            required: true,
            order: 4,
          },
          {
            title: "Media Release",
            description:
              "I consent to photos and videos being taken and used for promotional purposes",
            required: true,
            order: 5,
          },
          {
            title: "Cancellation and Refund Policy",
            description:
              "I understand and accept the cancellation and refund policy",
            required: true,
            order: 6,
          },
          {
            title: "Code of Conduct",
            description:
              "I agree to maintain professional conduct and sportsmanship",
            required: true,
            order: 7,
          },
          {
            title: "Assumption of Risk",
            description:
              "I understand motor sports involve inherent risks and participate at my own risk",
            required: true,
            order: 8,
          },
        ],
      },
    ];

    await SafetyRequirements.insertMany(safetyData);
    console.log("Safety requirements seeded successfully");
  } catch (error) {
    console.error("Error seeding safety requirements:", error);
  }
};

module.exports = seedSafetyRequirements;
