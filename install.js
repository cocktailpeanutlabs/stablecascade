module.exports = {
//  "cmds": {
//    "nvidia": "pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118",
//    "amd": "pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm5.6",
//    "default": "pip3 install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cpu"
//  },
  "cmds": {
    "win32": {
      "nvidia": "uv pip install torch==2.5.0 torchvision==0.20.0 torchaudio==2.5.0 xformers --index-url https://download.pytorch.org/whl/cu124",
      "amd": "uv pip install torch-directml torchvision torchaudio numpy==1.26.4",
      "cpu": "uv pip install torch==2.5.0 torchvision==0.20.0 torchaudio==2.5.0 --index-url https://download.pytorch.org/whl/cpu"
    },
    "darwin": "uv pip install torch==2.5.0 torchvision==0.20.0 torchaudio==2.5.0 --index-url https://download.pytorch.org/whl/cpu",
    "linux": {
      "nvidia": "uv pip install torch==2.5.0 torchvision==0.20.0 torchaudio==2.5.0 xformers --index-url https://download.pytorch.org/whl/cu124",
      "amd": "uv pip install torch==2.5.0 torchvision==0.20.0 torchaudio==2.5.0 --index-url https://download.pytorch.org/whl/rocm6.2",
      "cpu": "uv pip install torch==2.5.0 torchvision==0.20.0 torchaudio==2.5.0 --index-url https://download.pytorch.org/whl/cpu"
    }
  },
  "run": [{
    "method": "shell.run",
    "params": {
      "env": {
        "GIT_CLONE_PROTECTION_ACTIVE": "false"
      },
      "message": [
        "git lfs install",
        "git clone https://huggingface.co/spaces/cocktailpeanut/stable-cascade app"
      ]
    }
  }, {
    "when": "{{gpu === 'nvidia' && kernel.gpu_model && / 50.+/.test(kernel.gpu_model) }}",
    "method": "shell.run",
    "params": {
      "venv": "env",
      "path": "app",
      "env": {
        "SYSTEM_VERSION_COMPAT": "0"
      },
      "message": [
        "uv pip install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cu128",
        "uv pip install gradio numpy==1.26.4",
        "uv pip install -r requirements.txt",
      ]
    },
    "next": "end"
  }, {
    "method": "shell.run",
    "params": {
      "venv": "env",
      "path": "app",
      "env": {
        "SYSTEM_VERSION_COMPAT": "0"
      },
      "message": [
        "{{gpu === 'nvidia' ? 'conda install -y nvidia/label/cuda-12.1.0::cuda' : null}}",
        "{{gpu === 'nvidia' && platform === 'win32' ? 'conda install -y cudnn libzlib-wapi -c conda-forge' : null}}",
        "{{gpu === 'nvidia' && platform === 'linux' ? 'conda install -y cudnn -c conda-forge' : null}}",
        "{{(platform === 'darwin' ? self.cmds.darwin : (['nvidia', 'amd'].includes(gpu) ? self.cmds[platform][gpu] : self.cmds[platform].cpu))}}",
        "uv pip install gradio numpy==1.26.4",
        "uv pip install -r requirements.txt",
      ]
    }
//  }, {
//    "method": "fs.share",
//    "params": {
//      "venv": "app/env"
//    }
  }, {
    "id": "end",
    "method": "notify",
    "params": {
      "html": "Click the 'start' tab to get started!"
    }
  }]
}
