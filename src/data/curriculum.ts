import { BookOpen, Plane, Wrench, ShieldCheck, Target, Zap, Activity, Radio, Layers } from 'lucide-react';

export interface Lesson {
  id: string;
  title: string;
  content: string;
  image?: string;
  duration: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: any;
  lessons: Lesson[];
  quiz?: QuizQuestion[];
}

export const curriculum: Module[] = [
  {
    id: 'intro',
    title: 'Introduction to Briech UAS',
    description: 'Learn about Briech UAS, our mission, and safety protocols.',
    icon: ShieldCheck,
    lessons: [
      {
        id: 'about',
        title: 'About Briech UAS',
        content: `
# About Briech UAS

Briech UAS is a leading manufacturer of unmanned aerial vehicles, registered in Nigeria in 2021. We are committed to becoming a world-leading robotic aerial surveillance company, building Africa's biggest drone manufacturing facility in Kuje, Abuja.

Our customer-centric approach focuses on solving individual customer needs and adjusting our UAS designs to critical mission particularities.

## Our Mission
To provide advanced, reliable, and mission-critical unmanned aerial systems that empower operators across Africa and beyond.
        `,
        duration: '5 min'
      },
      {
        id: 'safety',
        title: 'Safety & Regulations',
        content: `
# Safety First

Operating unmanned aerial systems requires strict adherence to safety protocols and local regulations.

## Key Safety Guidelines
1. **Pre-Flight Inspection**: Always inspect the airframe, motors, and electronics before every flight.
2. **Environment Awareness**: Maintain visual line of sight (VLOS) unless authorized for BVLOS operations.
3. **Battery Management**: Ensure LiPo batteries are charged, balanced, and stored correctly.
4. **Emergency Procedures**: Know the fail-safe modes (Return-to-Home, Land Immediately) for your specific platform.

## Regulatory Compliance
Operators must comply with all Nigerian Civil Aviation Authority (NCAA) regulations and obtain necessary permits for commercial operations.
        `,
        duration: '10 min'
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Where is Briech UAS building its manufacturing facility?',
        options: ['Lagos', 'Kuje, Abuja', 'Port Harcourt', 'Kano'],
        correctAnswer: 1
      },
      {
        id: 'q2',
        question: 'What is the primary rule for battery management?',
        options: ['Store fully charged', 'Store empty', 'Ensure charged, balanced, and stored correctly', 'Discard after one use'],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'fleet',
    title: 'Fleet Overview',
    description: 'Detailed specifications of our advanced UAV systems.',
    icon: Plane,
    lessons: [
      {
        id: 'damisa',
        title: 'Damisa Combat Drone',
        content: `
# Damisa Combat Drone

The Damisa is our next-generation unmanned aerial system designed for precision strikes.

## Key Features
- **Role**: Precision Strike / Combat
- **Capabilities**: High-precision targeting, stealth technology integration.
- **Design**: Optimized for rapid deployment and mission success in hostile environments.

The Damisa represents the pinnacle of our combat-ready fleet, offering unmatched reliability and firepower.
        `,
        duration: '15 min'
      },
      {
        id: 'argini',
        title: 'Argini Reconnaissance Drone',
        content: `
# Argini Reconnaissance Drone

The Argini is a Hybrid VTOL (Vertical Take-Off and Landing) UAV designed for long-endurance intelligence missions.

## Key Features
- **Role**: Intelligence, Surveillance, and Reconnaissance (ISR)
- **Type**: Hybrid VTOL
- **Endurance**: Long-range capabilities for extended missions.
- **Versatility**: Combines the flexibility of a multi-rotor with the efficiency of a fixed-wing aircraft.
        `,
        duration: '12 min'
      },
      {
        id: 'arsenio',
        title: 'Arsenio Reconnaissance Drone',
        content: `
# Arsenio Reconnaissance Drone

A high-endurance ISR drone capable of 8-hour flight missions.

## Key Features
- **Role**: Long-endurance ISR
- **Flight Time**: Up to 8 hours
- **Payload**: Advanced sensor suites for detailed aerial mapping and surveillance.
- **Application**: Ideal for border patrol, pipeline monitoring, and large-area mapping.
        `,
        duration: '12 min'
      },
      {
        id: 'xander',
        title: 'Xander Reconnaissance Drone',
        content: `
# Xander Reconnaissance Drone

An extended ISR platform with 6-hour endurance.

## Key Features
- **Role**: Extended ISR
- **Flight Time**: Up to 6 hours
- **Design**: Robust airframe for challenging weather conditions.
- **Deployment**: Rapid setup and launch capabilities.
        `,
        duration: '10 min'
      },
      {
        id: 'bfly',
        title: 'Bfly Reconnaissance Drone',
        content: `
# Bfly Reconnaissance Drone

A compact solution for rapid ISR missions.

## Key Features
- **Role**: Rapid ISR / Tactical Reconnaissance
- **Size**: Compact and portable
- **Deployment**: Immediate deployment for short-range situational awareness.
- **Stealth**: Low acoustic signature for covert operations.
        `,
        duration: '8 min'
      }
    ],
    quiz: [
      {
        id: 'q3',
        question: 'Which drone is a Hybrid VTOL?',
        options: ['Damisa', 'Argini', 'Arsenio', 'Bfly'],
        correctAnswer: 1
      },
      {
        id: 'q4',
        question: 'What is the flight endurance of the Arsenio drone?',
        options: ['2 hours', '4 hours', '6 hours', '8 hours'],
        correctAnswer: 3
      }
    ]
  },
  {
    id: 'ops',
    title: 'Flight Operations',
    description: 'Standard operating procedures for mission success.',
    icon: Target,
    lessons: [
      {
        id: 'preflight',
        title: 'Pre-Flight Checklist',
        content: `
# Pre-Flight Checklist

Before every mission, complete the following checks:

1. **Airframe**: Check for cracks, loose screws, or structural damage.
2. **Propellers**: Ensure props are secure and free of chips.
3. **Motors**: Check for smooth rotation and debris.
4. **Batteries**: Verify voltage levels and secure mounting.
5. **Radio Link**: Confirm strong signal between ground station and aircraft.
6. **GPS**: Wait for satellite lock (minimum 6 satellites).
7. **Failsafe**: Verify Return-to-Home altitude settings.
        `,
        duration: '20 min'
      },
      {
        id: 'mission',
        title: 'Mission Planning',
        content: `
# Mission Planning

Effective mission planning is crucial for data quality and safety.

## Steps
1. **Define Area of Interest (AOI)**: Map out the flight boundaries.
2. **Set Waypoints**: Determine flight path and altitude.
3. **Check Airspace**: Verify no flight restrictions (NFZ) in the area.
4. **Weather Check**: Confirm wind speed and visibility are within operational limits.
        `,
        duration: '15 min'
      },
      {
        id: 'emergency',
        title: 'Emergency Procedures',
        content: `
# Emergency Procedures

In the event of a system failure or unexpected behavior, follow these protocols immediately.

## Loss of Link (Failsafe)
- **Automatic RTH**: Most Briech UAS platforms will automatically Return-to-Home if the radio link is lost for >3 seconds.
- **Manual Override**: If link is restored, switch to manual mode (Stabilize/Loiter) to regain control.

## Low Battery
- **First Warning**: Land immediately at the nearest safe location.
- **Critical Voltage**: The drone may initiate an auto-landing to prevent battery damage. Do not fight this; guide it to a safe spot.

## GPS Failure
- **Switch to Altitude Hold**: If GPS lock is lost, the drone will drift with the wind. Switch to Altitude Hold mode and manually correct for drift.
- **Land ASAP**: Do not attempt to continue the mission without GPS.

## Flyaway
- **Kill Switch**: If the drone becomes uncontrollable and poses a danger to people, use the emergency motor kill switch (if equipped and safe to do so).
        `,
        duration: '10 min'
      }
    ]
  },
  {
    id: 'maintenance',
    title: 'Maintenance & Repair',
    description: 'Keep your fleet airworthy with proper care.',
    icon: Wrench,
    lessons: [
      {
        id: 'composite',
        title: 'Composite Repair',
        content: `
# Structural Repairs of Composite Materials

Briech UAS specializes in expert restoration of carbon fiber and fiberglass components.

## Basic Repair Process
1. **Assessment**: Identify the extent of the damage (delamination, cracks).
2. **Preparation**: Sand the damaged area to remove loose material.
3. **Patching**: Apply epoxy resin and reinforcement fabric (carbon/glass).
4. **Curing**: Allow the repair to cure under controlled temperature/pressure.
5. **Finishing**: Sand smooth and re-paint to match the airframe.
        `,
        duration: '25 min'
      },
      {
        id: 'calibration',
        title: 'Sensor Calibration',
        content: `
# Electronic Component Overhaul & Calibration

Precision calibration ensures accurate flight data and stable performance.

## When to Calibrate
- After a crash or hard landing.
- When moving to a new location (>100km away).
- If the drone drifts or behaves erratically.

## Components
- **IMU (Inertial Measurement Unit)**: Calibrate on a flat, level surface.
- **Compass**: Perform the "dance" away from magnetic interference.
- **Gimbal**: Calibrate for a level horizon in video feeds.
        `,
        duration: '20 min'
      }
    ]
  }
];
