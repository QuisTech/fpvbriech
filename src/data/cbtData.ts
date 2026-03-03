
export interface CBTQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  category: 'Technical' | 'Theoretical' | 'Safety' | 'Regulations';
}

export const cbtData = {
  title: "Final Computer Based Test (CBT)",
  description: "This is the final assessment for the Briech UAS Academy. It covers technical knowledge, safety protocols, regulations, and operational procedures. You have 45 minutes to complete this test.",
  durationMinutes: 45,
  passingScore: 70,
  questions: [
    // Safety & Regulations
    {
      id: 'cbt-1',
      question: 'What is the primary rule regarding Visual Line of Sight (VLOS)?',
      options: [
        'You can fly behind buildings as long as you have a spotter.',
        'You must maintain direct visual contact with the aircraft at all times unless authorized for BVLOS.',
        'VLOS is only required for commercial operations.',
        'You can use FPV goggles as a substitute for VLOS without a spotter.'
      ],
      correctAnswer: 1,
      category: 'Regulations'
    },
    {
      id: 'cbt-2',
      question: 'When should you inspect your LiPo batteries?',
      options: [
        'Only when they look puffy.',
        'Before every flight and charging session.',
        'Once a month.',
        'After a crash only.'
      ],
      correctAnswer: 1,
      category: 'Safety'
    },
    {
      id: 'cbt-3',
      question: 'What is the correct procedure if a student freezes during a flight?',
      options: [
        'Yell at them to snap out of it.',
        'Command "LEVEL AND LAND" and take control if possible.',
        'Grab the controller from their hands immediately.',
        'Wait and see if they recover.'
      ],
      correctAnswer: 1,
      category: 'Safety'
    },
    {
      id: 'cbt-4',
      question: 'Which class of fire extinguisher is required for drone operations?',
      options: [
        'Class A (Water)',
        'Class B (CO2)',
        'Class ABC (Dry Chemical)',
        'Class K (Kitchen)'
      ],
      correctAnswer: 2,
      category: 'Safety'
    },
    
    // Technical
    {
      id: 'cbt-5',
      question: 'What does the Flight Controller (FC) do?',
      options: [
        'Transmits video to the goggles.',
        'Regulates power to the motors.',
        'Calculates motor outputs based on sensor data and pilot input.',
        'Receives control signals from the radio.'
      ],
      correctAnswer: 2,
      category: 'Technical'
    },
    {
      id: 'cbt-6',
      question: 'What is the function of an ESC (Electronic Speed Controller)?',
      options: [
        'It controls the camera angle.',
        'It converts DC battery power to 3-phase AC for the motors.',
        'It transmits telemetry data.',
        'It stabilizes the video feed.'
      ],
      correctAnswer: 1,
      category: 'Technical'
    },
    {
      id: 'cbt-7',
      question: 'What does "kV" stand for on a brushless motor?',
      options: [
        'Kilo-Volts',
        'RPM per Volt',
        'Kinetic Velocity',
        'Kick Voltage'
      ],
      correctAnswer: 1,
      category: 'Technical'
    },
    {
      id: 'cbt-8',
      question: 'In FPV, what is "RaceBand"?',
      options: [
        'A type of music played during races.',
        'A rubber band used to secure the battery.',
        'A set of video frequencies designed to minimize interference between multiple pilots.',
        'A specific radio control protocol.'
      ],
      correctAnswer: 2,
      category: 'Technical'
    },

    // Operational
    {
      id: 'cbt-9',
      question: 'What is the first step in the "Crash Procedure"?',
      options: [
        'Run to the drone.',
        'Disarm immediately.',
        'Check the video feed.',
        'Try to take off again.'
      ],
      correctAnswer: 1,
      category: 'Safety'
    },
    {
      id: 'cbt-10',
      question: 'What is the minimum satellite lock count recommended before taking off in GPS mode?',
      options: [
        '3 satellites',
        '4 satellites',
        '6 satellites',
        '10 satellites'
      ],
      correctAnswer: 2,
      category: 'Theoretical'
    },
    {
      id: 'cbt-11',
      question: 'Which stick mode is most commonly used, where Throttle is on the left?',
      options: [
        'Mode 1',
        'Mode 2',
        'Mode 3',
        'Mode 4'
      ],
      correctAnswer: 1,
      category: 'Theoretical'
    },
    {
      id: 'cbt-12',
      question: 'What happens if you discharge a LiPo battery below 3.0V per cell?',
      options: [
        'It flies faster.',
        'It charges quicker next time.',
        'It sustains permanent chemical damage.',
        'Nothing happens.'
      ],
      correctAnswer: 2,
      category: 'Technical'
    },
    {
      id: 'cbt-13',
      question: 'What is the purpose of "Betaflight"?',
      options: [
        'It is a flight simulator.',
        'It is the firmware that runs on the flight controller.',
        'It is a brand of propellers.',
        'It is a video editing software.'
      ],
      correctAnswer: 1,
      category: 'Technical'
    },
    {
      id: 'cbt-14',
      question: 'What does "Failsafe" usually do on a GPS drone when the radio link is lost?',
      options: [
        'The drone drops from the sky.',
        'The drone hovers in place indefinitely.',
        'The drone executes a Return-to-Home (RTH) procedure.',
        'The drone flies to the last known waypoint.'
      ],
      correctAnswer: 2,
      category: 'Theoretical'
    },
    {
      id: 'cbt-15',
      question: 'Which component is responsible for receiving the video signal from the drone?',
      options: [
        'VTX (Video Transmitter)',
        'VRX (Video Receiver)',
        'FC (Flight Controller)',
        'ESC (Electronic Speed Controller)'
      ],
      correctAnswer: 1,
      category: 'Technical'
    }
  ]
};
