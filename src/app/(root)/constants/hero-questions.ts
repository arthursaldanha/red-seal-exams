export interface HeroQuestion {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: "A" | "B" | "C" | "D";
}

export type TradeKey =
  | "electrician"
  | "plumber"
  | "carpenter"
  | "welder"
  | "heavyDuty";

export const tradeDisplayNames: Record<TradeKey, string> = {
  electrician: "Electrical Trade",
  plumber: "Plumbing Trade",
  carpenter: "Carpentry Trade",
  welder: "Welding Trade",
  heavyDuty: "Heavy Duty Equipment",
};

export const heroQuestions: Record<TradeKey, HeroQuestion[]> = {
  electrician: [
    {
      question:
        "What is the minimum voltage rating required for electrical safety gloves when working on 600V systems?",
      options: {
        A: "Class 00 (500V AC)",
        B: "Class 0 (1000V AC)",
        C: "Class 1 (7500V AC)",
        D: "Class 2 (17000V AC)",
      },
      correctAnswer: "B",
    },
    {
      question:
        "When must safety glasses with side shields be worn on a construction site?",
      options: {
        A: "Only when performing grinding or cutting operations",
        B: "Only in designated hazardous areas marked by signage",
        C: "At all times while on the construction site",
        D: "Only when specifically instructed by a supervisor",
      },
      correctAnswer: "C",
    },
    {
      question:
        "What is the primary purpose of wearing arc-rated clothing when performing electrical work?",
      options: {
        A: "To prevent electric shock from contact with live conductors",
        B: "To protect against arc flash thermal energy and reduce burn injuries",
        C: "To improve visibility in low-light electrical rooms",
        D: "To comply with company uniform policies",
      },
      correctAnswer: "B",
    },
    {
      question:
        "What is the maximum number of conductors allowed in a 4x4 square box with a depth of 1-1/2 inches if the conductors are #14 AWG?",
      options: {
        A: "8 conductors",
        B: "10 conductors",
        C: "12 conductors",
        D: "14 conductors",
      },
      correctAnswer: "B",
    },
    {
      question:
        "What type of respiratory protection is required when working in an area with silica dust from concrete cutting?",
      options: {
        A: "A nuisance dust mask",
        B: "A supplied-air respirator (SAR)",
        C: "An N95 or higher rated particulate respirator",
        D: "No respiratory protection if the area is well-ventilated",
      },
      correctAnswer: "C",
    },
  ],
  plumber: [
    {
      question:
        "What is the primary purpose of conducting a job hazard assessment before starting plumbing work?",
      options: {
        A: "To determine the project timeline",
        B: "To identify potential hazards and implement control measures",
        C: "To calculate material costs",
        D: "To assign work duties to team members",
      },
      correctAnswer: "B",
    },
    {
      question:
        "When working in a confined space, what is the minimum acceptable oxygen level according to most safety regulations?",
      options: {
        A: "16.5%",
        B: "18.0%",
        C: "19.5%",
        D: "21.0%",
      },
      correctAnswer: "C",
    },
    {
      question:
        "What is the recommended minimum clearance distance from overhead power lines when working with metal pipes or ladders?",
      options: {
        A: "1 meter (3 feet)",
        B: "3 meters (10 feet)",
        C: "5 meters (16 feet)",
        D: "10 meters (33 feet)",
      },
      correctAnswer: "B",
    },
    {
      question:
        "Which gas poses the greatest immediate danger in sewer and drainage work due to its toxicity and ability to cause rapid unconsciousness?",
      options: {
        A: "Carbon monoxide",
        B: "Methane",
        C: "Hydrogen sulfide",
        D: "Carbon dioxide",
      },
      correctAnswer: "C",
    },
    {
      question:
        "What is the minimum slope required for a 4-inch diameter horizontal drain pipe?",
      options: {
        A: "1/16 inch per foot",
        B: "1/8 inch per foot",
        C: "1/4 inch per foot",
        D: "1/2 inch per foot",
      },
      correctAnswer: "B",
    },
  ],
  carpenter: [
    {
      question:
        "What is the primary safety concern when using a pneumatic nail gun on a construction site?",
      options: {
        A: "Battery life depletion",
        B: "Air compressor noise levels",
        C: "Accidental discharge when not aimed at work surface",
        D: "Weight of the tool causing fatigue",
      },
      correctAnswer: "C",
    },
    {
      question:
        "When using a circular saw to make a plunge cut, what is the proper technique?",
      options: {
        A: "Start the saw with the blade touching the material",
        B: "Retract the lower guard, position the front of the base plate on the work, then lower the spinning blade into the cut",
        C: "Use the highest speed setting available",
        D: "Remove the lower guard permanently for better visibility",
      },
      correctAnswer: "B",
    },
    {
      question:
        "What is the recommended air pressure for most pneumatic framing nailers?",
      options: {
        A: "50-70 PSI",
        B: "70-120 PSI",
        C: "120-150 PSI",
        D: "150-200 PSI",
      },
      correctAnswer: "B",
    },
    {
      question:
        "When using a reciprocating saw for demolition work, which blade type is most appropriate for cutting through nails embedded in wood?",
      options: {
        A: "Fine-tooth wood blade",
        B: "Carbide-tipped demolition blade",
        C: "High-speed steel metal cutting blade",
        D: "Diamond-coated masonry blade",
      },
      correctAnswer: "B",
    },
    {
      question:
        "What is the standard spacing for floor joists in residential construction?",
      options: {
        A: "12 inches on center",
        B: "16 inches on center",
        C: "20 inches on center",
        D: "24 inches on center",
      },
      correctAnswer: "B",
    },
  ],
  welder: [
    {
      question:
        "What is the correct procedure for cleaning a combination square after use in a fabrication shop?",
      options: {
        A: "Wipe with an oily rag and store in a toolbox",
        B: "Clean with solvent, dry thoroughly, apply light oil, and store in a protective case",
        C: "Rinse with water and air dry before storage",
        D: "Leave as-is to maintain protective oxidation layer",
      },
      correctAnswer: "B",
    },
    {
      question:
        "When should the calibration of a digital angle finder be verified?",
      options: {
        A: "Only when the tool displays an error message",
        B: "At the beginning of each work shift and after any impact or drop",
        C: "Once per month during scheduled maintenance",
        D: "Only when measurements appear inconsistent with visual estimates",
      },
      correctAnswer: "B",
    },
    {
      question:
        "What is the primary reason for storing micrometers in their protective cases when not in use?",
      options: {
        A: "To prevent theft from the work area",
        B: "To maintain consistent temperature and protect precision surfaces from contamination and physical damage",
        C: "To comply with workplace safety regulations",
        D: "To organize the toolbox more efficiently",
      },
      correctAnswer: "B",
    },
    {
      question:
        "How should a welder address a chipping hammer with a mushroomed striking face?",
      options: {
        A: "Continue using it until the mushrooming affects performance",
        B: "Grind the mushroomed edges to restore the original profile and remove sharp burrs",
        C: "Apply heat to reshape the metal back to its original form",
        D: "Replace the entire hammer immediately",
      },
      correctAnswer: "B",
    },
    {
      question:
        "What is the minimum shade number recommended for gas welding operations?",
      options: {
        A: "Shade 3-4",
        B: "Shade 5-6",
        C: "Shade 8-10",
        D: "Shade 12-14",
      },
      correctAnswer: "B",
    },
  ],
  heavyDuty: [
    {
      question:
        "What is the correct procedure for storing precision measuring tools?",
      options: {
        A: "Store in a clean, dry toolbox with protective cases",
        B: "Leave them on the workbench after use",
        C: "Store them in a bucket with other hand tools",
        D: "Hang them on a pegboard exposed to the elements",
      },
      correctAnswer: "A",
    },
    {
      question: "How often should hydraulic jacks be inspected?",
      options: {
        A: "Only when they fail",
        B: "Before each use and during scheduled maintenance intervals",
        C: "Once per year regardless of usage",
        D: "Never, they are maintenance-free",
      },
      correctAnswer: "B",
    },
    {
      question:
        "What indicates that a hand tool should be removed from service?",
      options: {
        A: "It looks slightly used",
        B: "It's a different brand than others",
        C: "It shows cracks, mushroomed heads, or excessive wear",
        D: "It's more than one year old",
      },
      correctAnswer: "C",
    },
    {
      question: "What is the proper way to clean air tools after use?",
      options: {
        A: "Submerge in water",
        B: "Add a few drops of air tool oil through the air inlet",
        C: "Never clean air tools",
        D: "Use gasoline to flush internal parts",
      },
      correctAnswer: "B",
    },
    {
      question:
        "What is the minimum safe distance to maintain when working near heavy equipment in operation?",
      options: {
        A: "5 feet (1.5 meters)",
        B: "10 feet (3 meters)",
        C: "15 feet (4.5 meters)",
        D: "Within the operator's line of sight",
      },
      correctAnswer: "D",
    },
  ],
};
