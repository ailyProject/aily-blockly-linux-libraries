# @aily-project/lib-vision

Portable OpenCV image processing, connected-component and contour analysis, drawing, and QR/barcode/AprilTag recognition.

Blocks (32):

- Image processing: `python_image_resize`, `python_image_convert`, `python_image_in_range`, `python_image_components`, `python_components_property`, `python_component_stat`, `python_image_canny`, `python_image_hough_circles`, `python_image_gaussian_blur`, `python_morphology_kernel`, `python_image_morphology`, `python_image_find_contours`, `python_image_load`, `python_image_save`.
- Contours: `python_contour_area`, `python_contour_perimeter`, `python_contour_approx`, `python_contour_is_convex`, `python_contour_min_area_rect`, `python_rotated_rect_points`.
- Drawing: `python_draw_rectangle`, `python_draw_circle`, `python_draw_line`, `python_draw_text`, `python_draw_polyline`, `python_draw_text_freetype`.
- Codes: `python_qr_decode`, `python_barcode_decode`, `python_code_result_property`, `python_apriltag_init`, `python_apriltag_detect`, `python_apriltag_result_property`.

Target dependencies: cv2, pyzbar with the system zbar library, and pupil-apriltags. `python_draw_text_freetype` additionally requires an OpenCV build exposing `cv2.freetype` plus a TrueType/OpenType font file.

Compatible boards: `canaan:k230:cybercam`, `broadcom:bcm2712:raspberrypi_5`, and `allwinner:t527:walnutpi_2b`.

`python_image_find_contours` returns the contours list directly (`cv2.findContours(...)[0]`). Connected-component result blocks consume the full tuple returned by `cv2.connectedComponentsWithStats`.

Linux V4L2 capture is provided by `@aily-project/lib-camera`. CyberCAM CSI camera, display, and KPU blocks belong to the separate `cybercam_cv` board-specific library and are intentionally not duplicated here.

Requires the standalone CPython generator at globalThis.Python; block type names are migration-stable.
