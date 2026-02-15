import projectRobotics from '@/assets/project-robotics.jpg';
import projectAi from '@/assets/project-ai.jpg';
import projectCircuits from '@/assets/project-circuits.jpg';
import projectDrone from '@/assets/project-drone.jpg';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  components: string;
  video: string;
  sourceCode: string;
}

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Autonomous Robotic Arm',
    description: 'A 6-DOF robotic arm with computer vision integration for precise assembly tasks. Built with Arduino Mega, servo motors, and OpenCV for real-time object detection and manipulation in the engineering lab.',
    image: projectRobotics,
    components: 'Arduino Mega, 6x MG996R Servos, Pi Camera, OpenCV, 3D Printed Parts, PCA9685 Driver',
    video: 'https://example.com/video1',
    sourceCode: 'https://github.com/innovex/robotic-arm',
  },
  {
    id: '2',
    title: 'Neural Network Visualizer',
    description: 'An interactive real-time visualization tool for neural network architectures and training processes. Watch data flow through layers, observe gradient descent, and understand backpropagation visually.',
    image: projectAi,
    components: 'Python, TensorFlow, Three.js, WebGL, React, WebSocket Server',
    video: 'https://example.com/video2',
    sourceCode: 'https://github.com/innovex/nn-visualizer',
  },
  {
    id: '3',
    title: 'Custom PCB Design Lab',
    description: 'Complete PCB design and fabrication workflow — from schematic capture to etching. Includes a reflow soldering station and automated optical inspection system built from scratch.',
    image: projectCircuits,
    components: 'KiCad, CNC Mill, UV Exposure Unit, Reflow Oven, AOI Camera System',
    video: 'https://example.com/video3',
    sourceCode: 'https://github.com/innovex/pcb-lab',
  },
  {
    id: '4',
    title: 'Autonomous Survey Drone',
    description: 'A custom-built quadcopter with autonomous flight capabilities, LIDAR mapping, and real-time telemetry. Designed for environmental monitoring and terrain surveying missions.',
    image: projectDrone,
    components: 'Pixhawk FC, LIDAR Lite v3, Raspberry Pi 4, GPS Module, 4G Telemetry',
    video: 'https://example.com/video4',
    sourceCode: 'https://github.com/innovex/survey-drone',
  },
];
