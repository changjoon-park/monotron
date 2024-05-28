# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

a = Analysis(
    ['./run_app.py'],
    pathex=[],
    binaries=[],
    datas=[],
    hiddenimports=[],
    hookspath=[],
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=True,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='run_app',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=False,
    console=False,  # Corresponds to the '-w' flag
    disable_windowed_traceback=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=False,  # Corresponds to the '--noupx' flag
    name='run_app',
    clean=True  # Corresponds to the '--clean' flag
)

# Create the application bundle (for macOS)
app = BUNDLE(
    coll,
    name='run_app.app',
    icon=None,
    bundle_identifier=None,
)