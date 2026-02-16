-- Seed projects (uploaded_by = admin user)
INSERT INTO projects (title, description, image_url, video_link, components, source_code, uploaded_by)
SELECT
  p.title,
  p.description,
  p.image_url,
  p.video_link,
  p.components,
  p.source_code,
  u.id
FROM (
  VALUES
    (
      'Autonomous Robotic Arm',
      'A 6-DOF robotic arm with computer vision integration for precise assembly tasks. Built with Arduino Mega, servo motors, and OpenCV for real-time object detection and manipulation in the engineering lab.',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
      'https://example.com/video1',
      'Arduino Mega, 6x MG996R Servos, Pi Camera, OpenCV, 3D Printed Parts, PCA9685 Driver',
      'https://github.com/innovex/robotic-arm'
    ),
    (
      'Neural Network Visualizer',
      'An interactive real-time visualization tool for neural network architectures and training processes. Watch data flow through layers, observe gradient descent, and understand backpropagation visually.',
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
      'https://example.com/video2',
      'Python, TensorFlow, Three.js, WebGL, React, WebSocket Server',
      'https://github.com/innovex/nn-visualizer'
    ),
    (
      'Custom PCB Design Lab',
      'Complete PCB design and fabrication workflow — from schematic capture to etching. Includes a reflow soldering station and automated optical inspection system built from scratch.',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
      'https://example.com/video3',
      'KiCad, CNC Mill, UV Exposure Unit, Reflow Oven, AOI Camera System',
      'https://github.com/innovex/pcb-lab'
    ),
    (
      'Autonomous Survey Drone',
      'A custom-built quadcopter with autonomous flight capabilities, LIDAR mapping, and real-time telemetry. Designed for environmental monitoring and terrain surveying missions.',
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80',
      'https://example.com/video4',
      'Pixhawk FC, LIDAR Lite v3, Raspberry Pi 4, GPS Module, 4G Telemetry',
      'https://github.com/innovex/survey-drone'
    )
) AS p(title, description, image_url, video_link, components, source_code)
CROSS JOIN (SELECT id FROM users WHERE user_id = 'MDNADEEM' LIMIT 1) u;

-- Seed goals
INSERT INTO goals (text, image_url)
VALUES
  (
    'AI-Powered Research Lab — Integrating machine learning tools directly into the lab workflow, from computer vision QA to predictive maintenance on equipment.',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80'
  ),
  (
    'Open Hardware Initiative — Publishing all project designs as open-source hardware, allowing other student labs worldwide to replicate and improve upon our work.',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80'
  ),
  (
    'Industry Partnership Program — Connecting with engineering firms and startups to bring real-world problem statements into the lab for collaborative solution development.',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80'
  );
