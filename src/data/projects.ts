import projectRobotics from '@/assets/project-robotics.jpg';
import projectAi from '@/assets/project-ai.jpg';
import projectCircuits from '@/assets/project-circuits.jpg';
import projectDrone from '@/assets/project-drone.jpg';

/** Shape used throughout the frontend for project display */
export interface Project {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  components?: string;
  videoUrl?: string;
  sourceCode?: string;
  createdBy?: string;
  createdAt?: number;
}

/** Fallback data shown when the DB has no projects yet */
export const MOCK_PROJECTS: Project[] = [
  {
    _id: '1',
    title: 'Autonomous Robotic Arm',
    description: 'A 6-DOF robotic arm with computer vision integration for precise assembly tasks. Built with Arduino Mega, servo motors, and OpenCV for real-time object detection and manipulation in the engineering lab.',
    imageUrl: projectRobotics,
    components: 'Arduino Mega, 6x MG996R Servos, Pi Camera, OpenCV, 3D Printed Parts, PCA9685 Driver',
    videoUrl: 'https://example.com/video1',
    sourceCode: 'https://github.com/innovex/robotic-arm',
  },
  {
    _id: '2',
    title: 'Neural Network Visualizer',
    description: 'An interactive real-time visualization tool for neural network architectures and training processes. Watch data flow through layers, observe gradient descent, and understand backpropagation visually.',
    imageUrl: projectAi,
    components: 'Python, TensorFlow, Three.js, WebGL, React, WebSocket Server',
    videoUrl: 'https://example.com/video2',
    sourceCode: 'https://github.com/innovex/nn-visualizer',
  },
  {
    _id: '3',
    title: 'Custom PCB Design Lab',
    description: 'Complete PCB design and fabrication workflow — from schematic capture to etching. Includes a reflow soldering station and automated optical inspection system built from scratch.',
    imageUrl: projectCircuits,
    components: 'KiCad, CNC Mill, UV Exposure Unit, Reflow Oven, AOI Camera System',
    videoUrl: 'https://example.com/video3',
    sourceCode: 'https://github.com/innovex/pcb-lab',
  },
  {
    _id: '4',
    title: 'Autonomous Survey Drone',
    description: 'A custom-built quadcopter with autonomous flight capabilities, LIDAR mapping, and real-time telemetry. Designed for environmental monitoring and terrain surveying missions.',
    imageUrl: projectDrone,
    components: 'Pixhawk FC, LIDAR Lite v3, Raspberry Pi 4, GPS Module, 4G Telemetry',
    videoUrl: 'https://example.com/video4',
    sourceCode: 'https://github.com/innovex/survey-drone',
  },
];
