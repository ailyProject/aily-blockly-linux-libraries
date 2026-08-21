# Vision

通用 OpenCV 图像处理、轮廓分析、绘制与二维码、条码和 AprilTag 识别。

- npm 包：`@aily-project/lib-vision`
- Blockly 积木：32 个
- 运行环境：`devmode: "python"`，并加载独立 CPython generator runtime
- 目标端依赖：`cv2`、`pyzbar`（以及系统 `zbar`）、`pupil-apriltags`
- FreeType 文字积木要求目标端 OpenCV 包含 `cv2.freetype` 模块，并提供可用的 TrueType/OpenType 字体
- 兼容平台：CyberCAM K230、Raspberry Pi 和 WalnutPi Python

## 图像处理与连通域

- `python_image_resize`
- `python_image_convert`
- `python_image_in_range`
- `python_image_components`
- `python_components_property`
- `python_component_stat`
- `python_image_canny`
- `python_image_hough_circles`
- `python_image_gaussian_blur`
- `python_morphology_kernel`
- `python_image_morphology`
- `python_image_find_contours`

## 轮廓分析

- `python_contour_area`
- `python_contour_perimeter`
- `python_contour_approx`
- `python_contour_is_convex`
- `python_contour_min_area_rect`
- `python_rotated_rect_points`

## 图像文件与绘制

- `python_image_load`
- `python_image_save`
- `python_draw_rectangle`
- `python_draw_circle`
- `python_draw_line`
- `python_draw_text`
- `python_draw_polyline`
- `python_draw_text_freetype`

## 码类识别

- `python_qr_decode`
- `python_barcode_decode`
- `python_code_result_property`
- `python_apriltag_init`
- `python_apriltag_detect`
- `python_apriltag_result_property`

`python_image_find_contours` 直接返回 `contours` 列表，而不是 OpenCV 的 `(contours, hierarchy)` 二元组。`python_components_property` 和 `python_component_stat` 用于读取 `connectedComponentsWithStats` 的结果元组。

Linux V4L2 相机采集由 `@aily-project/lib-camera` 提供；CyberCAM 板载 CSI 相机及 KPU 由独立的 `cybercam_cv` 板级视觉库提供。本库不注册或复制这些板级积木。

该库只向 `globalThis.Python.forBlock` 注册生成器；没有 Python runtime 时安全跳过，不会回退到 MPY/MicroPython。
