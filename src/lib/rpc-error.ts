type ApiErrorBody = { error: { code: string; message: string } };

/**
 * Extrai `{ code, message }` de uma resposta de erro do RPC do Hono.
 *
 * `res.json()` aqui é tipado a partir do caminho de sucesso da rota — o RPC
 * do Hono não infere o formato do `onError` global (ver
 * src/server/api/middlewares/error-handler.ts). O corpo real, em runtime,
 * segue o envelope `{ error: { code, message } } `documentado lá; o cast é
 * inevitável e fica centralizado aqui em vez de duplicado em cada formulário.
 */
async function readRpcError(res: Response): Promise<{ code: string; message: string }> {
  const body = (await res.json()) as unknown as ApiErrorBody;
  return body.error;
}

export { readRpcError };
