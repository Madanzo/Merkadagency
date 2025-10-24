const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function createProject(data: {
  title: string;
  brief: string;
  ratio?: string;
}) {
  const res = await fetch(`${API_URL}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create project');
  return res.json();
}

export async function getProject(id: string) {
  const res = await fetch(`${API_URL}/api/projects/${id}`);
  if (!res.ok) throw new Error('Failed to fetch project');
  return res.json();
}

export async function getProjects() {
  const res = await fetch(`${API_URL}/api/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function generateVo(projectId: string, useMock: boolean = true) {
  const res = await fetch(`${API_URL}/api/projects/${projectId}/generate-vo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ useMock }),
  });
  if (!res.ok) throw new Error('Failed to generate VO');
  return res.json();
}

export async function selectMusic(projectId: string, mood?: string, useMock: boolean = true) {
  const res = await fetch(`${API_URL}/api/projects/${projectId}/select-music`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mood, useMock }),
  });
  if (!res.ok) throw new Error('Failed to select music');
  return res.json();
}

export async function renderProject(
  projectId: string,
  options: { exportFcpxml?: boolean; exportEdl?: boolean } = {}
) {
  const res = await fetch(`${API_URL}/api/projects/${projectId}/render`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
  });
  if (!res.ok) throw new Error('Failed to start render');
  return res.json();
}

export async function getRenderJob(jobId: string) {
  const res = await fetch(`${API_URL}/api/jobs/${jobId}`);
  if (!res.ok) throw new Error('Failed to fetch job');
  return res.json();
}

export async function getUploadUrl(projectId: string, file: File, assetKind: string) {
  const res = await fetch(`${API_URL}/api/projects/${projectId}/assets/upload-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      assetKind,
    }),
  });
  if (!res.ok) throw new Error('Failed to get upload URL');
  return res.json();
}

export async function uploadFile(uploadUrl: string, file: File) {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
  if (!res.ok) throw new Error('Failed to upload file');
}
