export interface CBTQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  category: 'Technical' | 'Theoretical' | 'Safety' | 'Regulations';
}

export const cbtData = {
  title: "General Safety in FPV Operations CBT",
  description: "This assessment evaluates your knowledge on FPV drone safety principles, risk management, regulations, and operational best practices.",
  durationMinutes: 45,
  passingScore: 70,
  questions: [
    {
      id: 'cbt-1',
      question: 'What are the three major variables that the FPV Drone Safety System is based on?',
      options: [
        'Speed, Altitude, and Battery Life',
        'Environment, Machine, and Human Being',
        'Frame, Motors, and Propellers',
        'Weather, Obstacles, and Regulations'
      ],
      correctAnswer: 1,
      category: 'Safety'
    },
    {
      id: 'cbt-2',
      question: 'According to studies in aviation, what percentage of accidents are typically linked to human error?',
      options: [
        'Up to 30%',
        'About 50%',
        'Up to 70% or more',
        '100%'
      ],
      correctAnswer: 2,
      category: 'Theoretical'
    },
    {
      id: 'cbt-3',
      question: 'What is the nominal and maximum voltage per cell for a standard LiPo battery?',
      options: [
        '3.3v nominal, 4.0v maximum',
        '3.7v nominal, 4.2v maximum',
        '4.5v nominal, 5.0v maximum',
        '3.0v nominal, 3.7v maximum'
      ],
      correctAnswer: 1,
      category: 'Technical'
    },
    {
      id: 'cbt-4',
      question: 'According to James Reason\'s theory of human error, accidents happen when:',
      options: [
        'Equipment malfunctions randomly.',
        'Weather conditions suddenly change.',
        'Multiple safety barriers fail.',
        'Pilots fly in manual mode.'
      ],
      correctAnswer: 2,
      category: 'Theoretical'
    },
    {
      id: 'cbt-5',
      question: 'Which of the following is NOT considered a common human error in FPV flying?',
      options: [
        'Flying beyond skill level',
        'Ignoring battery limits',
        'Using simulator practice',
        'Overconfidence'
      ],
      correctAnswer: 2,
      category: 'Theoretical'
    },
    {
      id: 'cbt-6',
      question: 'Which organization enforces drone regulations in Nigeria?',
      options: [
        'Federal Aviation Administration (FAA)',
        'International Civil Aviation Organization (ICAO)',
        'Nigerian Civil Aviation Authority (NCAA)',
        'Briech UAS Academy'
      ],
      correctAnswer: 2,
      category: 'Regulations'
    },
    {
      id: 'cbt-7',
      question: 'In the IMSAFE model for assessing personal safety before a flight, what does the "S" stand for?',
      options: [
        'Skill - Am I skilled enough?',
        'Stress - Am I distracted or worried?',
        'Sickness - Am I feeling ill?',
        'Sleep - Did I get enough sleep?'
      ],
      correctAnswer: 1,
      category: 'Safety'
    },
    {
      id: 'cbt-8',
      question: 'If you answer "Yes" to any unsafe condition in the IMSAFE checklist, what is the required action?',
      options: [
        'Fly carefully and close to the ground.',
        'Have a visual observer watch the drone.',
        'Do Not Fly.',
        'Take a 10-minute break before flying.'
      ],
      correctAnswer: 2,
      category: 'Safety'
    },
    {
      id: 'cbt-9',
      question: 'Whose responsibility is it to ensure the drone maintains a safe distance from people and avoids crowds?',
      options: [
        'The Mission Coordinator',
        'The Technician',
        'The Pilot',
        'The Visual Observer'
      ],
      correctAnswer: 2,
      category: 'Safety'
    },
    {
      id: 'cbt-10',
      question: 'Before arming the drone, which of the following system setups must be verified?',
      options: [
        'Correct flight mode, VTX channel, and OSD information',
        'Battery brand and color',
        'Wind speed at 100 meters above ground',
        'The number of people watching'
      ],
      correctAnswer: 0,
      category: 'Technical'
    },
    {
      id: 'cbt-11',
      question: 'When making a Go / No-Go decision, what should you do if you are unsure if the flight is safe?',
      options: [
        'Ask a bystander for their opinion.',
        'Perform a quick test flight anyway.',
        'NO GO.',
        'Switch to a smaller battery.'
      ],
      correctAnswer: 2,
      category: 'Safety'
    },
    {
      id: 'cbt-12',
      question: 'Which of the following is considered a major environmental risk that can cause issues for FPV drones?',
      options: [
        'Strong GPS signals',
        'Magnetic interference',
        'Clear visibility',
        'Low temperatures'
      ],
      correctAnswer: 1,
      category: 'Safety'
    },
    {
      id: 'cbt-13',
      question: 'Which of the following describes a critical battery safety rule for handling FPV LiPo batteries?',
      options: [
        'Always discharge them completely to 0v.',
        'Store them in any standard plastic container.',
        'Never overcharge and store in fireproof bags.',
        'Charge them immediately after a crash.'
      ],
      correctAnswer: 2,
      category: 'Safety'
    },
    {
      id: 'cbt-14',
      question: 'A strong safety culture in the FPV drone community includes:',
      options: [
        'Hiding mistakes to avoid embarrassment',
        'Reporting incidents and sharing lessons learned',
        'Ignoring rules when flying for fun',
        'Refusing to help beginners'
      ],
      correctAnswer: 1,
      category: 'Safety'
    },
    {
      id: 'cbt-15',
      question: 'Which of the following features represents the role of technology in promoting FPV safety?',
      options: [
        'Carbon fiber frames',
        'Geofencing and RTH (Return-to-home)',
        'High-speed motors',
        'HD video recording'
      ],
      correctAnswer: 1,
      category: 'Technical'
    },
    {
      id: 'cbt-16',
      question: 'Complete the core principle from the lecture note: "Technology supports safety, but..."',
      options: [
        '"...hardware ensures it."',
        '"...discipline ensures safety."',
        '"...luck plays a huge role."',
        '"...regulations enforce it."'
      ],
      correctAnswer: 1,
      category: 'Theoretical'
    },
    {
      id: 'cbt-17',
      question: 'By standard conventions, which of the following operations is typically exempted from civil aviation regulations?',
      options: [
        'Commercial photography',
        'Recreational racing',
        'Military operations',
        'Agricultural spraying'
      ],
      correctAnswer: 2,
      category: 'Regulations'
    },
    {
      id: 'cbt-18',
      question: 'What is the voltage of a 6s LiPo battery when fully charged (maximum voltage)?',
      options: [
        '22.2v',
        '24.0v',
        '25.2v',
        '14.8v'
      ],
      correctAnswer: 2,
      category: 'Technical'
    },
    {
      id: 'cbt-19',
      question: 'To reduce accidents in FPV operations, the lecture recommends all of the following EXCEPT:',
      options: [
        'Using checklists',
        'Planning emergency actions',
        'Relying solely on modern obstacle sensors',
        'Maintaining equipment'
      ],
      correctAnswer: 2,
      category: 'Safety'
    },
    {
      id: 'cbt-20',
      question: 'According to the lecture\'s conclusion, safety is not considered a restriction, but rather a form of:',
      options: [
        'Inconvenience',
        'Protection',
        'Regulation',
        'Limitation'
      ],
      correctAnswer: 1,
      category: 'Theoretical'
    }
  ]
};
