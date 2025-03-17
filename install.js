module.exports = {
//  "cmds": {
//    "nvidia": "pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118",
//    "amd": "pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm5.6",
//    "default": "pip3 install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cpu"
//  },
  "cmds": {
    "win32": {
      "nvidia": "pip install torch torchvision torchaudio xformers --index-url https://download.pytorch.org/whl/cu121",
      "amd": "pip install torch-directml",
      "cpu": "pip install torch torchvision torchaudio"
    },
    "darwin": "pip3 install torch torchvision torchaudio",
    "linux": {
      "nvidia": "pip install torch torchvision torchaudio xformers --index-url https://download.pytorch.org/whl/cu121",
      "amd": "pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm5.7",
      "cpu": "pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu"
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
        "pip install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cu128",
        "pip install gradio",
        "pip install -r requirements.txt",
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
        "pip install gradio",
        "pip install -r requirements.txt",
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
