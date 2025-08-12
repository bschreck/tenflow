import json
import subprocess
import tempfile
from pathlib import Path

from tenflow.main import app


def main():
    project_root = Path(__file__).parent.parent.parent
    openapi_spec = app.openapi()

    with tempfile.NamedTemporaryFile(suffix='.json', mode='w', delete=False) as temp_file:
        temp_spec_path = temp_file.name
        json.dump(openapi_spec, temp_file, indent=2)

    try:
        output_file = project_root / 'frontend' / 'src' / 'generated_types.ts'
        frontend_dir = project_root / 'frontend'
        subprocess.run(
            ['npx', 'openapi-typescript', temp_spec_path, '--output', str(output_file), '--prettier'],
            cwd=str(frontend_dir),
            check=True,
        )
        print(f'Generated TypeScript types at: {output_file}')
    finally:
        Path(temp_spec_path).unlink()


if __name__ == '__main__':
    main()
