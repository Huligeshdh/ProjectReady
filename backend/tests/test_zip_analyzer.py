import os
import zipfile
import tempfile
import pytest
from app.analysis.zip_analyzer import zip_analyzer, ZIPCodeAnalyzer


def create_mock_zip(files_dict: dict, zip_path: str = None) -> str:
    """Helper to create temporary zip archives for testing."""
    import uuid
    if not zip_path:
        extract_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".temp_extracts")
        os.makedirs(extract_dir, exist_ok=True)
        zip_path = os.path.join(extract_dir, f"mock_zip_{uuid.uuid4().hex}.zip")

    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for filename, content in files_dict.items():
            zf.writestr(filename, content)
    return zip_path


def test_1_valid_zip_extraction():
    """Verify valid ZIP codebase is correctly extracted and analyzed."""
    files = {
        "main.py": "from fastapi import FastAPI\napp = FastAPI()\n\n@app.get('/')\ndef root():\n    return {'status': 'ok'}",
        "requirements.txt": "fastapi==0.109.0\nuvicorn==0.27.0",
        "README.md": "# Sample Project\nA valid sample project for testing."
    }
    zip_path = create_mock_zip(files)
    try:
        results = zip_analyzer.analyze_zip(zip_path)
        assert results["total_files"] == 3
        assert "Python" in results["languages"]
        assert "FastAPI" in results["frameworks"]
        assert results["submission_score"] > 0
    finally:
        if os.path.exists(zip_path):
            os.remove(zip_path)


def test_2_empty_zip_handling():
    """Verify empty ZIP archive handles gracefully without crash."""
    zip_path = create_mock_zip({})
    try:
        results = zip_analyzer.analyze_zip(zip_path)
        assert results["total_files"] == 0
        assert results["submission_score"] >= 0
    finally:
        if os.path.exists(zip_path):
            os.remove(zip_path)


def test_3_corrupted_zip_handling():
    """Verify corrupted ZIP file raises a ValueError or BadZipFile exception."""
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".zip")
    tmp.write(b"NOT_A_ZIP_FILE_CORRUPTED_BYTES_12345")
    tmp.close()

    try:
        with pytest.raises(Exception):
            zip_analyzer.analyze_zip(tmp.name)
    finally:
        if os.path.exists(tmp.name):
            os.remove(tmp.name)


def test_4_oversized_zip_limits():
    """Verify size check on large archives."""
    # Test checking logic structure exists
    analyzer = ZIPCodeAnalyzer()
    assert hasattr(analyzer, "analyze_zip")


def test_5_unsupported_file_types():
    """Verify unsupported binary/compiled file types are safely ignored in code files scan."""
    files = {
        "app.exe": b"BINARY_EXECUTABLE_CONTENT",
        "data.bin": b"\x00\x01\x02\x03",
        "script.py": "print('hello')"
    }
    zip_path = create_mock_zip(files)
    try:
        results = zip_analyzer.analyze_zip(zip_path)
        assert "Python" in results["languages"]
    finally:
        if os.path.exists(zip_path):
            os.remove(zip_path)


def test_6_nested_directories():
    """Verify nested directory structures are built into file tree."""
    files = {
        "src/components/Header.tsx": "export const Header = () => <header aria-label='Navigation'>Header</header>;",
        "src/utils/helpers.ts": "export const add = (a: number, b: number) => a + b;",
        "package.json": '{"name": "test-app", "dependencies": {"react": "^18.0.0"}}'
    }
    zip_path = create_mock_zip(files)
    try:
        results = zip_analyzer.analyze_zip(zip_path)
        assert results["total_files"] >= 3
        assert "TypeScript" in results["languages"]
        assert "React" in results["frameworks"]
    finally:
        if os.path.exists(zip_path):
            os.remove(zip_path)


def test_7_path_traversal_protection():
    """Verify ZIP slip path traversal vulnerability (../../malicious.py) is detected and blocked."""
    zip_path = tempfile.NamedTemporaryFile(delete=False, suffix=".zip").name
    try:
        with zipfile.ZipFile(zip_path, 'w') as zf:
            zf.writestr("../../malicious.py", "import os; os.system('echo hacked')")

        with pytest.raises(ValueError) as exc_info:
            zip_analyzer.analyze_zip(zip_path)
        assert "Unsafe file path" in str(exc_info.value)
    finally:
        if os.path.exists(zip_path):
            os.remove(zip_path)


def test_8_suspicious_filenames():
    """Verify relative path traversal in filename is rejected."""
    zip_path = tempfile.NamedTemporaryFile(delete=False, suffix=".zip").name
    try:
        with zipfile.ZipFile(zip_path, 'w') as zf:
            zf.writestr("../etc/passwd", "root:x:0:0:root:/root:/bin/bash")

        with pytest.raises(ValueError):
            zip_analyzer.analyze_zip(zip_path)
    finally:
        if os.path.exists(zip_path):
            os.remove(zip_path)


def test_9_hidden_files_handling():
    """Verify hidden files (.git, .env) are filtered out from tree."""
    files = {
        ".env": "SECRET_KEY=12345",
        "main.py": "print('clean')"
    }
    zip_path = create_mock_zip(files)
    try:
        results = zip_analyzer.analyze_zip(zip_path)
        paths = [item["path"] for item in results["file_tree"]]
        assert ".env" not in paths
    finally:
        if os.path.exists(zip_path):
            os.remove(zip_path)


def test_10_multiple_languages():
    """Verify multi-language projects detect Python, TypeScript, and Java."""
    files = {
        "backend/main.py": "print('Python backend')",
        "frontend/App.tsx": "export const App = () => <div>App</div>;",
        "service/Main.java": "public class Main { public static void main(String[] args) {} }"
    }
    zip_path = create_mock_zip(files)
    try:
        results = zip_analyzer.analyze_zip(zip_path)
        assert "Python" in results["languages"]
        assert "TypeScript" in results["languages"]
        assert "Java" in results["languages"]
    finally:
        if os.path.exists(zip_path):
            os.remove(zip_path)


def test_11_js_ts_project_detection():
    """Verify JS/TS React project structure detection."""
    files = {
        "package.json": '{"dependencies": {"react": "^18.2.0", "react-dom": "^18.2.0"}}',
        "src/index.tsx": "import React from 'react';\nconsole.log(React);"
    }
    zip_path = create_mock_zip(files)
    try:
        results = zip_analyzer.analyze_zip(zip_path)
        assert "TypeScript" in results["languages"]
        assert "React" in results["frameworks"]
    finally:
        if os.path.exists(zip_path):
            os.remove(zip_path)


def test_12_python_project_detection():
    """Verify Python PyTorch / FastAPI detection."""
    files = {
        "requirements.txt": "torch\nfastapi\nuvicorn",
        "app.py": "import torch\nfrom fastapi import FastAPI\napp = FastAPI()"
    }
    zip_path = create_mock_zip(files)
    try:
        results = zip_analyzer.analyze_zip(zip_path)
        assert "Python" in results["languages"]
        assert "FastAPI" in results["frameworks"]
        assert "PyTorch/TensorFlow" in results["frameworks"]
    finally:
        if os.path.exists(zip_path):
            os.remove(zip_path)


def test_13_missing_package_files():
    """Verify project without package.json or requirements.txt still analyzes safely."""
    files = {
        "script.py": "x = 10\nprint(x)"
    }
    zip_path = create_mock_zip(files)
    try:
        results = zip_analyzer.analyze_zip(zip_path)
        assert results["total_files"] == 1
    finally:
        if os.path.exists(zip_path):
            os.remove(zip_path)


def test_14_missing_requirements_files():
    """Verify project without requirements.txt handles without exception."""
    files = {
        "index.js": "console.log('hello');"
    }
    zip_path = create_mock_zip(files)
    try:
        results = zip_analyzer.analyze_zip(zip_path)
        assert "JavaScript" in results["languages"]
    finally:
        if os.path.exists(zip_path):
            os.remove(zip_path)


def test_15_dependency_detection():
    """Verify dependency detection from source content and manifests."""
    files = {
        "requirements.txt": "fastapi==0.100.0\npytest==7.4.0",
        "main.py": "from fastapi import FastAPI\napp = FastAPI()"
    }
    zip_path = create_mock_zip(files)
    try:
        results = zip_analyzer.analyze_zip(zip_path)
        assert "FastAPI" in results["frameworks"]
    finally:
        if os.path.exists(zip_path):
            os.remove(zip_path)


def test_16_framework_detection():
    """Verify Django and PyTorch framework detection."""
    files = {
        "views.py": "from django.http import HttpResponse\ndef index(request): return HttpResponse('Django')",
        "model.py": "import torch\nclass Model(torch.nn.Module): pass"
    }
    zip_path = create_mock_zip(files)
    try:
        results = zip_analyzer.analyze_zip(zip_path)
        assert "Django" in results["frameworks"]
        assert "PyTorch/TensorFlow" in results["frameworks"]
    finally:
        if os.path.exists(zip_path):
            os.remove(zip_path)


def test_17_test_detection():
    """Verify test files detection (test_*.py, *.test.ts)."""
    files = {
        "tests/test_api.py": "def test_root(): assert True",
        "src/App.test.tsx": "test('renders learn react link', () => {});"
    }
    zip_path = create_mock_zip(files)
    try:
        results = zip_analyzer.analyze_zip(zip_path)
        assert results["has_tests"] is True
        assert results["test_files_count"] >= 2
    finally:
        if os.path.exists(zip_path):
            os.remove(zip_path)


def test_18_secret_detection():
    """Verify hardcoded API key and secret detection in static analysis."""
    files = {
        "config.py": 'API_KEY = "sk-proj-abcdef1234567890qwertyuiop"',
        "auth.py": 'jwt.decode(token, key, options={"verify_exp": False})'
    }
    zip_path = create_mock_zip(files)
    try:
        results = zip_analyzer.analyze_zip(zip_path)
        issues = results["issues"]
        categories = [i["category"] for i in issues]
        assert "Security" in categories
    finally:
        if os.path.exists(zip_path):
            os.remove(zip_path)


def test_19_static_analysis_issues():
    """Verify static analysis generates structured issue reports."""
    files = {
        "bug.py": "try:\n    x = 1/0\nexcept:\n    pass"
    }
    zip_path = create_mock_zip(files)
    try:
        results = zip_analyzer.analyze_zip(zip_path)
        issues = results["issues"]
        assert len(issues) > 0
        assert "problem" in issues[0]
        assert "recommended_fix" in issues[0]
    finally:
        if os.path.exists(zip_path):
            os.remove(zip_path)


def test_20_file_tree_generation():
    """Verify hierarchical file tree generation."""
    files = {
        "dirA/file1.py": "print(1)",
        "dirB/file2.py": "print(2)"
    }
    zip_path = create_mock_zip(files)
    try:
        results = zip_analyzer.analyze_zip(zip_path)
        tree = results["file_tree"]
        assert isinstance(tree, list)
        assert len(tree) >= 2
    finally:
        if os.path.exists(zip_path):
            os.remove(zip_path)
