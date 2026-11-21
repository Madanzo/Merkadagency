// Atomic global budget, before Siteverify/CRM. No IPs, tokens or inquiry data.
// The database/resource and request budget require separate deployment approval.
export function createDistributedLimiter({db, documentPath='websiteIntakeAbuse/global-v1', limit, windowMs=60_000, now=Date.now, timeoutMs=3000}) {
  if(!db || !Number.isInteger(limit) || limit<1 || limit>1000 || !/^websiteIntakeAbuse\/[A-Za-z0-9_-]+$/.test(documentPath)) throw Error('Invalid abuse budget configuration');
  const ref=db.doc(documentPath);
  return async()=>{
    let timer;
    try {
      const admitted=db.runTransaction(async tx=>{
        const snap=await tx.get(ref),entry=snap.data(),time=now();
        // Malformed persisted state refuses traffic; never silently resets it.
        if(snap.exists && (!Number.isSafeInteger(entry?.until)||!Number.isSafeInteger(entry?.count)||entry.count<0)) return false;
        const fresh=!snap.exists || entry.until<=time;
        if(!fresh && entry.count>=limit) return false;
        tx.set(ref,{count:fresh?1:entry.count+1,until:fresh?time+windowMs:entry.until});
        return true;
      },{maxAttempts:3});
      // A late transaction may consume a budget slot, but never admits a request.
      return await Promise.race([admitted,new Promise(resolve=>{timer=setTimeout(()=>resolve(false),timeoutMs)})]);
    }catch{return false}finally{clearTimeout(timer)}
  };
}
