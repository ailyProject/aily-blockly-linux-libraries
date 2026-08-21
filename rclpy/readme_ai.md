# @aily-project/lib-rclpy

Curated ROS 2 rclpy integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import rclpy as _python_lib_rclpy`
- Install on target: `Install the ROS 2 rclpy package with the matching ROS distribution via APT`
- Blocks (5): `python_rclpy_call`, `python_rclpy_do`, `python_rclpy_method`, `python_rclpy_do_method`, `python_rclpy_attribute`
- Allowlisted callables: `init`, `shutdown`, `ok`, `spin`, `spin_once`, `create_node`
- Allowlisted methods: `create_publisher`, `create_subscription`, `create_timer`, `create_client`, `create_service`, `get_logger`, `destroy_node`, `publish`
- Allowlisted attributes: `context`, `default_callback_group`
- API source: https://docs.ros.org/en/ros2_packages/rolling/api/rclpy/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

Compatibility note: rclpy must match the installed ROS 2 distribution and is not treated as a generic PyPI dependency.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
