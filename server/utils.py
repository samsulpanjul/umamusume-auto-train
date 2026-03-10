"""
Compatibility layer for older imports. To be removed after channging all imports to the new modules.

Prefer importing focused modules directly:
- server.legacy_config_store
- server.setup_store
- server.config_store
- server.theme_store
"""

from server.legacy_config_store import load_config, save_config
from server.setup_store import load_setup_config, save_setup_config
from server.config_store import (
  list_configs,
  load_named_config,
  save_named_config,
  create_config,
  duplicate_config,
  delete_config,
)
from server.theme_store import save_theme
