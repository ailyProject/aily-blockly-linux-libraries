# @aily-project/lib-camera

Linux V4L2 camera capture through OpenCV `cv2.VideoCapture`.

Blocks (4): linux_camera_init, linux_camera_opened, linux_camera_read, linux_camera_release.

Target dependencies: cv2, an accessible `/dev/video*` V4L2 device, and the required device permissions.

Compatible cores: linux:python:raspberrypi, linux:python:walnutpi, and linux:python:walnutpi-serial. CyberCAM's onboard CSI camera uses `cybercam_camera_*` from `@aily-project/lib-cybercam-cv` instead.

Requires the standalone CPython generator at globalThis.Python; block type names are migration-stable.
