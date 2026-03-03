export const fpvProgramData = {
  title: "FPV Initiator Program",
  overview: "The 12-lesson FPV Initiator program is designed to introduce students and teachers to the exciting world of flying FPV drones. Students will learn the fundamentals of drone safety, flight mechanics, and radio control. They will also gain hands-on experience repairing and flying their own FPV drone.",
  modules: [
    {
      id: "fpv-m1",
      title: "Module 1 - Pilot's Prelude",
      description: "Mastering FPV Drone Basics and Gear Insights",
      content: `
# Module 1: Pilot's Prelude
## Mastering FPV Drone Basics and Gear Insights

Welcome to the world of First Person View (FPV) flying! In this first module, we will cover the foundational concepts and introduce you to the equipment that makes FPV possible.

### What is FPV?
FPV stands for **First Person View**. It involves piloting a radio-controlled aircraft (usually a drone) using a video feed transmitted from a camera on the drone to a pair of goggles worn by the pilot. This gives you the sensation of sitting inside the drone itself.

### Key Components
1.  **The Drone (Quad)**: The aircraft itself, typically a quadcopter with 4 motors.
2.  **Radio Controller (Tx)**: The handheld device used to send control inputs to the drone.
3.  **FPV Goggles**: The headset that displays the live video feed.
4.  **Video Transmitter (VTX)**: The component on the drone that sends the video signal.
5.  **Video Receiver (VRX)**: The component (usually in the goggles) that receives the video signal.

### Safety First
*   **Propellers**: Even small propellers can cause injury. Always disarm your drone when handling it.
*   **Battery Safety**: LiPo batteries require special care. Never puncture them or leave them charging unattended.
*   **Environment**: Always fly in a safe, open area away from people and pets.
      `
    },
    {
      id: "fpv-m2",
      title: "Module 2 - Dialing in Control",
      description: "A Deep Dive into Your RC Setup & Configuration",
      content: `
# Module 2: Dialing in Control
## A Deep Dive into Your RC Setup & Configuration

Your Radio Controller (RC) is your direct link to the aircraft. Understanding how to configure it is crucial for precise control.

### The Transmitter (Radio)
We use the **Orqa FPV.Ctrl**. It communicates with the drone using a specific radio protocol (e.g., Ghost, ELRS, or FrSky).

### Stick Modes
*   **Mode 2** is the most common configuration:
    *   **Left Stick**: Throttle (Up/Down) and Yaw (Rotate Left/Right).
    *   **Right Stick**: Pitch (Forward/Backward) and Roll (Slide Left/Right).

### Binding
"Binding" is the process of linking your radio to the drone's receiver.
1.  Put the Receiver (on drone) into bind mode.
2.  Put the Transmitter into bind mode.
3.  Wait for the solid LED confirmation.

### Switches (Auxiliary Channels)
We configure switches for different functions:
*   **Arming**: A safety switch to enable the motors.
*   **Flight Modes**: Switching between Angle (Stabilized) and Acro (Manual) modes.
*   **Turtle Mode**: A mode to flip the drone over if it lands upside down.
      `
    },
    {
      id: "fpv-m3",
      title: "Module 3 - Unleash Your Potential",
      description: "Simulator Training for Superior Skill Development",
      content: `
# Module 3: Unleash Your Potential
## Simulator Training for Superior Skill Development

Before risking real hardware, we train in a simulator. This builds muscle memory without the cost of repairs.

### Why Simulators?
*   **Zero Cost Crashes**: Crash as many times as you want.
*   **Infinite Battery**: No waiting for charging.
*   **Physics Training**: Learn how a drone carries momentum.

### The Drill: "Hovering"
The hardest thing to learn first is simply staying in one spot.
1.  **Throttle Control**: Find the "hover point" where the drone neither rises nor falls.
2.  **Micro Corrections**: Use tiny stick movements to keep the drone level.
3.  **Tail-In Hover**: Keep the back of the drone facing you.

### Challenge
Spend at least 30 minutes in the simulator today. Try to hover inside a designated circle for 10 continuous seconds.
      `
    },
    {
      id: "fpv-m4",
      title: "Module 4 - Batteries Included",
      description: "Tips and Tricks for Safe and Effective Use",
      content: `
# Module 4: Batteries Included
## Tips and Tricks for Safe and Effective Use

FPV drones use Lithium Polymer (LiPo) batteries. They offer high power density but are volatile if mistreated.

### Understanding the Numbers
*   **Cell Count (S)**: 1S = 3.7V (nominal). Our micro drones use 1S batteries.
*   **Capacity (mAh)**: "Milliamp Hours". Determines flight time (e.g., 380mAh).
*   **C-Rating**: Discharge rate. Higher C = more punch/power.

### Charging Rules
1.  **Never Charge Unattended**: Fire risk is real.
2.  **Use a LiPo Bag**: Charge inside a fire-resistant container.
3.  **1C Charge Rate**: Charge at 1x capacity. For a 380mAh battery, charge at 0.38A.

### Storage
*   **Storage Voltage**: If not flying for >2 days, bring batteries to 3.8V per cell.
*   **Do Not Drain**: Never fly a LiPo below 3.0V per cell, or it may be permanently damaged. Land when you see "Low Battery" (usually around 3.5V).
      `
    },
    {
      id: "fpv-m5",
      title: "Module 5 - Ready, Set, Goggles Up",
      description: "Setting Up Your FPV Goggles for the Ultimate Flying Adventure",
      content: `
# Module 5: Ready, Set, Goggles Up
## Setting Up Your FPV Goggles

Your goggles are your window into the flight. Proper setup ensures a clear image and comfortable experience.

### Video Frequencies (5.8GHz)
Video is transmitted on bands (A, B, E, F, R) and channels (1-8).
*   **Match Frequencies**: Your goggles must be on the exact same channel as your drone's VTX.
*   **RaceBand (R)**: The standard band for FPV racing, designed to separate channels to allow multiple pilots to fly at once.

### Antennas
*   **Linear vs. Circular Polarization**: We use Circular Polarized (CP) antennas (RHCP or LHCP) to reduce multipath interference.
*   **Placement**: Ensure antennas are screwed in tight before powering on goggles.

### DVR (Digital Video Recorder)
*   Most goggles can record your flight footage to a microSD card.
*   **Always Record**: It helps you find a lost drone (replay the crash) and review your flying technique.
      `
    },
    {
      id: "fpv-m6",
      title: "Module 6 - Meet Your Micro",
      description: "Understanding Your Drone's Components and Functionality",
      content: `
# Module 6: Meet Your Micro
## Understanding Your Drone's Components

Let's dissect the Orqa 65mm Micro Drone to understand what makes it tick.

### Anatomy
1.  **Frame**: The plastic skeleton protecting components.
2.  **Motors**: Brushless motors (e.g., 0802 size) that spin the props.
3.  **Flight Controller (FC)**: The brain. It has a gyro to sense movement and a processor to calculate motor outputs.
4.  **ESC (Electronic Speed Controller)**: Regulates power to the motors. Usually built into the FC board on micros.
5.  **Camera & VTX**: The "Whoop" board often combines the camera and video transmitter.
6.  **Canopy**: Protects the camera and electronics.

### Maintenance Check
*   Check for hair/dust wrapped around motor shafts.
*   Ensure the camera lens is clean.
*   Verify the frame struts are not cracked.
      `
    },
    {
      id: "fpv-m7",
      title: "Module 7 - Betaflight Basics",
      description: "Customizing Your Drone's Flight Settings",
      content: `
# Module 7: Betaflight Basics
## Customizing Your Drone's Flight Settings

Betaflight is the firmware that runs on the Flight Controller. The Betaflight Configurator is the software on your PC used to change settings.

### Connecting
1.  Plug drone into PC via USB.
2.  Open Betaflight Configurator.
3.  Click "Connect".

### Key Tabs
*   **Ports**: Configures serial connections (don't touch unless you know why!).
*   **Configuration**: Motor direction, board alignment, and features.
*   **PID Tuning**: Adjusts how the drone responds to disturbances (P-I-D loop).
*   **Receiver**: Verify your stick inputs are mapping correctly (AETR1234).
*   **Modes**: Assign switches to Arm, Angle, Horizon, and Acro modes.
*   **OSD (On Screen Display)**: Arrange what data you see in your goggles (Battery voltage, Timer, Pilot Name).

### Warning
Always **remove propellers** before connecting a battery while plugged into the computer!
      `
    },
    {
      id: "fpv-m8",
      title: "Module 8 - From Crash to Fix",
      description: "Learning the Fundamentals of Micro Drone Repair",
      content: `
# Module 8: From Crash to Fix
## Fundamentals of Micro Drone Repair

In FPV, if you aren't crashing, you aren't learning. Repairing is part of the hobby.

### Common Repairs
1.  **Propeller Replacement**:
    *   Props have a direction (CW or CCW).
    *   "Props Out" vs "Props In" configuration. Ensure you put the correct prop on the correct motor.
2.  **Motor Swap**:
    *   Micro motors often use plugs. Simply unplug the bad motor and plug in the new one.
    *   Check motor direction after swapping.
3.  **Frame Swap**:
    *   Move all electronics from a broken plastic frame to a new one.
    *   Be careful not to pinch wires.

### Troubleshooting
*   **Drifting**: Calibrate the accelerometer in Betaflight.
*   **Video Static**: Check antenna connection and channel frequency.
*   **Won't Arm**: Check arming flags in Betaflight OSD (e.g., "THROTTLE" means throttle isn't at zero).
      `
    },
    {
      id: "fpv-m9",
      title: "Module 9 - First Flight, New Heights",
      description: "Experiencing FPV Drone Racing in Real Life",
      content: `
# Module 9: First Flight, New Heights
## Experiencing FPV Drone Racing in Real Life

Time to put the goggles on and fly for real!

### Pre-Flight Checklist
1.  **Visual Check**: Props secure? Battery charged?
2.  **Power On**: Goggles first, Radio second, Drone last.
3.  **Video Check**: Do you have a clear image? OSD working?
4.  **Arming**: "Arm" switch up. Motors spin at idle.

### The First Flight Profile
1.  **Takeoff**: Smooth throttle up to hover.
2.  **Cruising**: Gentle pitch forward to move. Use roll and yaw together to turn (coordinated turn).
3.  **Landing**: Bring it back, hover, and lower throttle gently. Disarm immediately upon touching the ground.

### Managing Disorientation
It is normal to feel dizzy at first. Sit down while flying. If you feel sick, take the goggles off immediately.
      `
    },
    {
      id: "fpv-m10",
      title: "Module 10 - The Art of Precision",
      description: "Mastering Control and Maneuvering",
      content: `
# Module 10: The Art of Precision
## Mastering Control and Maneuvering

Now we refine your control. Precision is faster than raw speed.

### Throttle Management
*   The key to racing is maintaining altitude while pitching forward.
*   Practice flying at a consistent height of 1 meter off the ground.

### Gap Shooting
*   Set up a gate or hoop.
*   Line up the drone *before* you get to the gate.
*   Commit to the line. Do not hesitate in the middle of the gate.

### Cornering
*   **Bank and Yank**: Roll into the turn, pull back on pitch (yank) to keep the nose up, and use yaw to point the camera.
*   Look through the turn, not at the wall.
      `
    },
    {
      id: "fpv-m11",
      title: "Module 11 - Breaking Ground",
      description: "Building Your First FPV Obstacle Course",
      content: `
# Module 11: Breaking Ground
## Building Your First FPV Obstacle Course

Designing a track is an art form. It challenges pilot skill and flow.

### Course Elements
*   **Start/Finish Gate**: Clearly marked.
*   **Split-S Gate**: A gate you must go over and then dive under (requires a loop).
*   **Slalom**: A series of flags to weave through.
*   **Tunnel**: A low section requiring precise altitude control.

### Flow
*   Avoid 90-degree turns immediately after a high-speed straight.
*   Create a rhythm: Fast section -> Technical section -> Fast section.
*   Ensure safety: No flight paths over the pilot area.

### Setup
Use the included gates, flags, and floor indicators to build a "Classroom Cup" track.
      `
    },
    {
      id: "fpv-m12",
      title: "Module 12 - Mind over Motors",
      description: "Navigating Nerves in Your Inaugural FPV Heat",
      content: `
# Module 12: Mind over Motors
## Navigating Nerves in Your Inaugural FPV Heat

Racing is 90% mental. The "shakes" are real.

### Race Format
*   **Heats**: 2-4 pilots fly at once.
*   **Tone Start**: "Pilots arm your quads... [Beep]".
*   **Laps**: Usually a 2-minute timer or fixed lap count (e.g., 3 laps).

### Managing Adrenaline
*   **Breathe**: Take deep breaths before the tone.
*   **Focus**: Ignore other drones. Fly your own race.
*   **Recovery**: If you crash, use Turtle Mode quickly. Don't panic.

### The Finish Line
Whether you win or crash out, always high-five your fellow pilots. The community is the best part of FPV.
      `
    }
  ],
  equipment: {
    drones: [
      "4x Orqa FPV.One Race goggles",
      "12x Orqa FPV.Ctrl controllers",
      "4x Orqa 65mm Micro Drones",
      "4x ImmersionRC rapidFIRE receivers",
      "4x ImmersionRC Ghost Tx modules",
      "4x ImmersionRC SpiroNET antenna bundles",
      "24x 380 mAh 1S LiPo batteries",
      "16x replacement propellers",
      "4x goggle battery chargers",
      "4x flight battery chargers with cables",
      "4x 4-port USB charging hubs",
      "1x LiPo safe storage bag",
      "12x USB to USB Type C cables",
      "12x microSDHC cards - 16GB",
      "4x microSD card readers",
      "4x Micro USB cables",
      "4x 6-pc mini-screwdriver set",
      "2x storage trunks"
    ],
    courseMaterials: [
      "10x mini arch gates",
      "6x race flags",
      "2x race cubes",
      "60x floor indicators",
      "1x 1000 ft. measuring wheel",
      "4x stopwatches",
      "100x USDRA League stickers"
    ],
    curriculum: [
      "1x Coach's Playbook",
      "12x Pilot Handbooks",
      "1x 12-month access to online curriculum"
    ]
  },
  details: {
    contactHours: {
      title: "Contact Hours",
      description: "20+ hours - FPV Initiator includes 12 interactive learning modules, each intended to run for 90 minutes. Modules include a combination of planned activities, video instruction, quizzes, and drills. Hours can be increased through additional time spent in the flight simulator, both in and out of the classroom."
    },
    support: {
      title: "Training & Support",
      items: [
        "Unlimited professional development, live via Zoom",
        "Customer support",
        "Drone Legends LMS: Cross platform (Mac, PC, Chromebook) browser-based, GDPR-compliant application",
        "SkyDive drone flight simulator: Chromebook and Windows compatible, plus iOS and Android app available for at home practice"
      ]
    }
  }
};
