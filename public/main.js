(() => {
  const els = {
    dataValue: document.getElementById('dataValue'),
    amount: document.getElementById('amount'),
    btnInc: document.getElementById('btnInc'),
    status: document.getElementById('status'),
    spinner: document.getElementById('spinner')
  };

  const setLoading = (loading) => {
    document.body.classList.toggle('loading', !!loading);
    els.btnInc.disabled = !!loading;
    els.amount.disabled = !!loading;
  };

  const showStatus = (msg) => {
    els.status.textContent = msg;
  };

  const readData = async () => {
    try {
      const res = await fetch('/data');
      if (!res.ok) throw new Error(`Error /data: ${res.status}`);
      const json = await res.json();
      els.dataValue.textContent = json.data ?? '—';
      console.log(`[data] Estado actual: ${json.data}`);
      showStatus('Valor actualizado.');
    } catch (err) {
      showStatus(`Error al leer: ${err.message}`);
    }
  };

  const parseAmount = () => {
    const v = Number(els.amount.value);
    if (!Number.isFinite(v) || v <= 0) throw new Error('Cantidad inválida');
    return Math.floor(v);
  };

  const postJSON = async (path, body) => {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, json };
  };

  const onInc = async () => {
    try {
      setLoading(true);
      showStatus('Enviando transacción de incremento...');
      const amount = parseAmount();
      const currentUI = Number(els.dataValue.textContent);
      const hasCurrent = Number.isFinite(currentUI);
      const expected = hasCurrent ? currentUI + amount : 'N/A';
      console.log(`[sumar] Estado actual (UI): ${hasCurrent ? currentUI : 'N/A'}, se suma: ${amount}, esperado: ${expected}`);
      const { ok, json } = await postJSON('/sumar', { amount });
      if (!ok) throw new Error(json?.error || 'Error al sumar');
      const txInfo = json.txHash ? `tx: ${json.txHash}` : (json.txHashes ? `txs: ${json.txHashes.length}` : '');
      showStatus(`Incremento ok. ${txInfo}`);
      await readData();
      const updated = Number(els.dataValue.textContent);
      console.log(`[sumar] Nuevo estado: ${Number.isFinite(updated) ? updated : 'N/A'}`);
    } catch (err) {
      showStatus(`Error al incrementar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const init = () => {
    els.btnInc.addEventListener('click', onInc);
    readData();
  };

  document.addEventListener('DOMContentLoaded', init);
})();