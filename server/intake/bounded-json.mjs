/** Bound untrusted provider responses before parsing. Never logs response contents. */
export async function boundedJson(response, limit = 8192) {
  if (!response.body || Number(response.headers.get('content-length')) > limit) throw new Error('Invalid provider response');
  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) { await reader.cancel(); throw new Error('Invalid provider response'); }
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } finally { reader.releaseLock(); }
}
